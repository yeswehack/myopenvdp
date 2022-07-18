import http from 'http';
import formidable from 'formidable';

import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFile as fsWriteFile } from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const reportsDir = resolve(__dirname, '..', 'reports');

const server = http.createServer(function(request, response) {
  if (request.url === '/api/upload' && request.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true });

    form.parse(request, (err, fields, files) => {
      if (err) {
        response.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        response.end(String(err));
        return;
      }
      if ('report' in fields) {
        const report = fields['report'];
        const fileName = `${new Date().toISOString()}-report.json`;
        const filePath = join(reportsDir, fileName);
        let error = null;
        fsWriteFile(filePath, report, writeError => {
          error = writeError;
        });
        if (error) {
          console.error(`Unable to save ${filePath}`, error);
          response.writeHead(500);
          response.end();
          return;
        } else {
          console.log(`Saved ${filePath}`);
        }
      }
      response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify({ fields, files }, null, 2));
    });

  } else {
    response.writeHead(405);
    response.end();
  }
})
  
  const port = 3000
  const host = '127.0.0.1'
  server.listen(port, host)
  console.log(`Listening at http://${host}:${port}`)