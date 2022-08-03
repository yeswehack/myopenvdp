import http from 'http';
import express from 'express';
import args from 'args';
import formidable from 'formidable';

import { join, resolve } from 'path';
import { writeFileSync as fsWriteFile, readFileSync as fsReadFile, readdirSync as fsReadDir } from 'fs';
import { networkInterfaces } from 'os';

const reportsDir = resolve(__dirname, '..', 'reports');

args.option('host', 'Expose to host', false).option('port', 'Server port', 8082);

const flags = args.parse(process.argv);

const app = express();
const hostname = flags.host ? '0.0.0.0' : '127.0.0.1';
const port = flags.port as number;

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

// Handles POST /api/upload requests
app.options('/api/upload', (request, response) => {
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
  });
  response.end();
});
app.post('/api/upload', (request, response) => {
  const form = formidable({ multiples: true });
  response.setHeader('Access-Control-Allow-Origin', '*');

  form.parse(request, (err, fields, files) => {
    if (err) {
      response.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
      response.end(String(err));
      return;
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
