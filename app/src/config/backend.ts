import { hostname } from 'os';
import { randomUUID } from 'crypto';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ensureReadJsonFileFromEnv, tryReadFileFromEnv } from '../utils/config';
import defaultMailReportTemplateText from '../templates/mail-new-disclosure-text.txt?raw';
import defaultMailReportTemplateHtml from '../templates/mail-new-disclosure-html.txt?raw';

const envHttpAccessControlAllowOrigin = 'BACKEND_HTTP_ACCESS_CONTROL_ALLOW_ORIGIN';
const envCaptchaEnable = 'BACKEND_CAPTCHA_ENABLE';
const envCaptchaCryptPassword = 'BACKEND_CAPTCHA_CRYPT_PASSWORD';
const envCaptchaExpirationMs = 'BACKEND_CAPTCHA_EXPIRATION_MS';
const envMailConfigFile = 'BACKEND_MAIL_CONFIG_FILE';
const envMailReportTemplateText = 'BACKEND_MAIL_REPORT_TEMPLATE_TEXT_FILE';
const envMailReportTemplateHtml = 'BACKEND_MAIL_REPORT_TEMPLATE_HTML_FILE';
const envMailReportSubjectTemplate = 'BACKEND_MAIL_REPORT_SUBJECT_TEMPLATE';
const envMailReportFrom = 'BACKEND_MAIL_REPORT_FROM';
const envMailReportTo = 'BACKEND_MAIL_REPORT_TO';

type Config = {
  httpAccessControlAllowOrigin: string | undefined;
  captchaEnable: boolean;
  captchaCryptPassword: string;
  captchaExpirationMs: number;
  mailTransportConfig: SMTPTransport.Options;
  mailReportTemplateText: string;
  mailReportTemplateHtml: string;
  mailReportSubjectTemplate: string;
  mailReportFrom: string;
  mailReportTo: string;
};
let config: Config;
const getConfig = () => {
  const env = process.env;
  if (!config) {
    config = {
      httpAccessControlAllowOrigin: env[envHttpAccessControlAllowOrigin],
      captchaEnable: envCaptchaEnable in env ? /true/i.test(env[envCaptchaEnable] || '') : true,
      captchaCryptPassword: env[envCaptchaCryptPassword] ?? randomUUID(),
      captchaExpirationMs:
        envCaptchaExpirationMs in env ? Number.parseInt(env[envCaptchaExpirationMs] as string) : 1000 * 60 * 60,
      mailTransportConfig: ensureReadJsonFileFromEnv<SMTPTransport.Options>(envMailConfigFile),
      mailReportTemplateText: tryReadFileFromEnv(envMailReportTemplateText) ?? defaultMailReportTemplateText,
      mailReportTemplateHtml: tryReadFileFromEnv(envMailReportTemplateHtml) ?? defaultMailReportTemplateHtml,
      mailReportSubjectTemplate:
        env[envMailReportSubjectTemplate] ?? 'New Vulnerability Disclosure',
      mailReportFrom: env[envMailReportFrom] ?? `my-open-vdp@${hostname()}`,
      mailReportTo: env[envMailReportTo] ?? `security@${hostname()}`,
    };
  }
  return config;
};

export { getConfig };
