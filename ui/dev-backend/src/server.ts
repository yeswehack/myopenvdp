import http from 'http';
import express from 'express';
import args from 'args';
import formidable from 'formidable';
import Captcha from './captcha';
import { encryptString, decryptString } from 'encrypt-string';

import { join, resolve } from 'path';
import { writeFileSync as fsWriteFile, readFileSync as fsReadFile, readdirSync as fsReadDir } from 'fs';
import { networkInterfaces } from 'os';

const reportsDir = resolve(__dirname, '..', 'reports');

args.option('host', 'Expose to host', false).option('port', 'Server port', 8082);

const flags = args.parse(process.argv);

const app = express();
const hostname = flags.host ? '0.0.0.0' : '127.0.0.1';
const port = flags.port as number;
const captchaCryptPassword = 'P4$sw0Rd!';

// Handling GET / requests
app.get('/', (request, response) => {
  response.send('Dev backend!');
});

// Handling GET /reports requests
// renders an HTML page with listing of saved reports
app.get('/reports', (request, response) => {
  const reports = fsReadDir(reportsDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => join(reportsDir, fileName))
    .map((reportPath) => fsReadFile(reportPath))
    .map((rawData) => JSON.parse(rawData.toString('utf8')))
    .map((data) => data.report)
    .map(
      (report) => `
    <li>${report.title}
    <ul>
      <li>Product: ${report.product}</li>
      <li>CVSS: <span>${report.cvss_score}</span>
        <table border="1">
          <thead>
            <tr><th>A</th><th>AC</th><th>AV</th><th>C</th><th>I</th><th>PR</th><th>S</th><th>UI</th></tr>
          </thead>
          <tbody>
            <tr><td>${report.cvss.A}</td><td>${report.cvss.AC}</td><td>${report.cvss.AV}</td><td>${report.cvss.C}</td><td>${report.cvss.I}</td><td>${report.cvss.PR}</td><td>${report.cvss.S}</td><td>${report.cvss.UI}</td></tr>
          </tbody>
        </table>
      </li>
    </ul>
    </li>
    `
    );
  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Reports (${reports.length})</title>
    <style>
    table { border-collapse: collapse; border: solid 1px black; }
    thead { background-color: lightblue; }
    th, td { border: solid 1px black; text-align: center; width: 2em; }
    </style>
  </head>
  <body>
    <h1>Reports (${reports.length})</h1>
    <ul>${reports.join('\n')}</ul>
  </body>
</html>
`;
  response.send(html);
});

// Handling GET /api/captcha requests
app.get('/api/captcha', async (request, response) => {
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
  });
  const captcha = new Captcha(
    request.query.w ? Number.parseInt(request.query.w as string) : 200,
    request.query.h ? Number.parseInt(request.query.h as string) : 56
  );
  const key = await encryptString(captcha.getValue(), captchaCryptPassword);
  response.write(
    JSON.stringify({
      key: key,
      url: await captcha.getDataURL(),
      width: captcha.getWidth(),
      height: captcha.getHeight(),
    })
  );
  response.end();
});

// Handles POST /api/upload requests
app.options('/api/upload', (request, response) => {
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
  });
  response.end();
});
const getUploadParseRequestCallback = (useCaptcha: boolean) =>
  async (
    response: express.Response,
    err: any,
    fields: formidable.Fields,
    files: formidable.Files,
  ) => {
    if (err) {
      response.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
      response.end(String(err));
      return;
    }
    if (useCaptcha) {
      if ('captcha' in fields) {
        const captcha = JSON.parse(fields['captcha'] as string) as { key: string; value: string };
        let decryptedCaptcha;
        try {
          decryptedCaptcha = await decryptString(captcha.key, captchaCryptPassword);
        } catch (e) {
          response.writeHead(401, { 'Content-Type': 'text/plain' });
          response.end(`Captcha error (${e})!`);
          return;
        }
        if (decryptedCaptcha.toLowerCase() != captcha.value.toLowerCase()) {
          response.writeHead(401, { 'Content-Type': 'text/plain' });
          response.end('Captcha error!');
          return;
        }
      }
      else {
        response.writeHead(401, { 'Content-Type': 'text/plain' });
        response.end('Captcha error (not provided)!');
        return;
      }
    }
    if ('report' in fields) {
      const report = fields['report'] as string;
      const fileName = `${new Date().toISOString()}-report.json`;
      const filePath = join(reportsDir, fileName);
      try {
        fsWriteFile(filePath, report, { mode: '666' });
      } catch (error) {
        console.error(`Unable to save ${filePath}`, error);
        response.writeHead(500);
        return;
      }
      console.log(`Saved ${filePath}`);
    }
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.write(JSON.stringify({ fields, files }, null, 2));
    response.end();
  };

const uploadParseRequestCaptchaCallback = getUploadParseRequestCallback(true);
const uploadParseRequestNoCaptchaCallback = getUploadParseRequestCallback(false);
app.post('/api/upload/captcha', (request, response) => {
  const form = formidable({ multiples: true });
  response.setHeader('Access-Control-Allow-Origin', '*');

  form.parse(request, async (err, fields, files) => {
    await uploadParseRequestCaptchaCallback(response, err, fields, files);
  });
});
app.post('/api/upload', (request, response) => {
  const form = formidable({ multiples: true });
  response.setHeader('Access-Control-Allow-Origin', '*');

  form.parse(request, async (err, fields, files) => {
    await uploadParseRequestNoCaptchaCallback(response, err, fields, files);
  });
});

// Server setup
http.createServer(app).listen(port, hostname, () => {
  const ips = flags.host
    ? Object.values(networkInterfaces()).reduce(
        (items, interfacesInfo) =>
          items.concat(
            (interfacesInfo || [])
              .filter(
                (interfaceInfo) => interfaceInfo.family == 'IPv4' && !interfaceInfo.internal && interfaceInfo.address
              )
              .map((interfaceInfo) => interfaceInfo.address)
          ),
        new Array()
      )
    : [hostname];
  ips.forEach((host) => console.log(`The application is listening on http://${host}:${port}`));
});
