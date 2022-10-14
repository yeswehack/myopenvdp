import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import formidable from 'formidable';
import nodemailer from 'nodemailer';
import he from 'he';
import { Report } from '../types/report';
import { validateCaptcha } from './captcha';
import { getConfig as getBackendConfig } from '../config/backend';
import { render } from '../utils/template';
import { Attachment } from 'nodemailer/lib/mailer';
import { randomUUID } from 'crypto';

const sendMail = (mail: {
  subject: string;
  from: string;
  to: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}) => {
  const config = getBackendConfig();
  const transport = nodemailer.createTransport(config.mailTransportConfig);
  return new Promise<string>((resolve, reject) => {
    transport.sendMail(
      {
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: mail.attachments,
      },
      (error, info) => {
        if (error) {
          console.log(error);
          reject(error.message);
        } else {
          console.log(`Email sent: ${info.response}`);
          resolve(info.response);
        }
      }
    );
  });
};

const getUploadParseRequestCallback =
  (useCaptcha: boolean) => async (response: ExpressResponse, err: unknown, fields: formidable.Fields) => {
    if (err) {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end(String(err));
      return;
    }
    const config = getBackendConfig();
    if (useCaptcha) {
      if ('captcha' in fields) {
        const captcha = JSON.parse(fields['captcha'] as string) as {
          key: string;
          value: string;
        };
        try {
          await validateCaptcha(captcha.key, captcha.value);
        } catch (e) {
          response.writeHead(401, { 'Content-Type': 'text/plain' });
          response.end(e instanceof Error ? e.message : (e as string));
          return;
        }
      } else {
        response.writeHead(401, { 'Content-Type': 'text/plain' });
        response.end('Captcha error (not provided)!');
        return;
      }
    }
    if ('report' in fields) {
      const reportString = fields['report'] as string;
      const report = JSON.parse(reportString) as Report;
      const templateData = {
        attachment_id: randomUUID(),
        attachment_name: 'report.zip.enc',
        title: report.title,
        product: report.product,
        cvss_score: report.cvss_score.toString(),
        'cvss.A': report.cvss.A,
        'cvss.AC': report.cvss.AC,
        'cvss.AV': report.cvss.AV,
        'cvss.C': report.cvss.C,
        'cvss.I': report.cvss.I,
        'cvss.PR': report.cvss.PR,
        'cvss.S': report.cvss.S,
        'cvss.UI': report.cvss.UI,
      };
      const htmlSafeTemplateData: typeof templateData = Object.assign({}, templateData);
      let key: keyof typeof htmlSafeTemplateData;
      for (key in htmlSafeTemplateData) {
        htmlSafeTemplateData[key] = he.encode(htmlSafeTemplateData[key]);
      }
      await sendMail({
        from: config.mailReportFrom,
        to: config.mailReportTo,
        subject: render(config.mailReportSubjectTemplate, htmlSafeTemplateData),
        text: render(config.mailReportTemplateText, templateData),
        html: render(config.mailReportTemplateHtml, htmlSafeTemplateData),
        attachments: [
          {
            cid: templateData.attachment_id,
            filename: templateData.attachment_name,
            contentDisposition: 'attachment',
            contentType: 'text/plain',
            content: report.pgp_data,
          },
        ],
      })
        .then(() => {
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.write('Report sent!');
          response.end();
        })
        .catch((e) => {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.write(`Unable to send report: ${e as string}`);
          response.end();
        });
      return;
    }
    response.writeHead(400, { 'Content-Type': 'text/plain' });
    response.write('Invalid data (no report)');
    response.end();
  };

const uploadParseRequestCaptchaCallback = getUploadParseRequestCallback(true);
const uploadParseRequestNoCaptchaCallback = getUploadParseRequestCallback(false);
const uploadWithCaptchaCheckRequestHandler = (request: ExpressRequest, response: ExpressResponse) => {
  const form = formidable({ multiples: true });

  form.parse(request, (err, fields) => {
    void uploadParseRequestCaptchaCallback(response, err, fields);
  });
};
const uploadWithoutCaptchaCheckRequestHandler = (request: ExpressRequest, response: ExpressResponse) => {
  const form = formidable({ multiples: true });

  form.parse(request, (err, fields) => {
    void uploadParseRequestNoCaptchaCallback(response, err, fields);
  });
};

export { uploadWithCaptchaCheckRequestHandler, uploadWithoutCaptchaCheckRequestHandler };
