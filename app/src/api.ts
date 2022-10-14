import express, { Request, Response } from 'express';
import { getConfig as getBackendConfig } from './config/backend';
import { getConfig as getFrontendConfig, renderWithConfig as renderWithFrontendConfig } from './config/frontend';
import { captchaRequestHandler } from './api/captcha';
import { uploadWithCaptchaCheckRequestHandler, uploadWithoutCaptchaCheckRequestHandler } from './api/upload';

process.on('SIGINT', () => {
  console.info('Interrupted');
  process.exit(0);
});

const app = express();
const config = (() => {
  try {
    return getBackendConfig();
  } catch (e) {
    throw new Error(`Bad backend configuration (caused by: ${e as string})`, {
      cause: e,
    });
  }
})();

if (import.meta.env.MODE == 'production') {
  (() => {
    try {
      return getFrontendConfig();
    } catch (e) {
      throw new Error(`Bad frontend configuration (caused by: ${e as string})`, {
        cause: e,
      });
    }
  })();
}

app.use((_request, response, next) => {
  response.removeHeader('X-Powered-By');
  if (config.httpAccessControlAllowOrigin) {
    response.setHeader('Access-Control-Allow-Origin', config.httpAccessControlAllowOrigin);
  }
  next();
});

const respond404 = (_request: Request, response: Response) => {
  response.writeHead(404);
  response.end();
};
// Handles POST /api/upload requests
if (config.captchaEnable) {
  // Handling GET /api/captcha requests
  app.get('/api/captcha', captchaRequestHandler);
  app.post('/api/upload/captcha', uploadWithCaptchaCheckRequestHandler);
  app.post('/api/upload', respond404);
} else {
  app.get('/api/captcha', respond404);
  app.post('/api/upload/captcha', respond404);
  app.post('/api/upload', uploadWithoutCaptchaCheckRequestHandler);
}
app.get('/', (_request, response, next) => {
  if (import.meta.env.MODE == 'development') {
    // let vite plugins do their magic (see ../vite.config.ts)
    next();
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    });
    response.write(renderWithFrontendConfig(import.meta.env.MIX_HTML));
    response.end();
  }
});

export { app as handler };
