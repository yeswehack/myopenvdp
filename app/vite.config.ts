import { defineConfig } from 'vite';
import mix from 'vite-plugin-mix';
import fg from 'fast-glob';
import path from 'path';
import { renderWithConfig as renderWithFrontendConfig } from './src/config/frontend';
import { getConfig as getBackendConfig } from './src/config/backend';

const root = process.cwd();
const publicMyOpenVdpPath = path.resolve(path.join(root, 'public', 'my-open-vdp'));
export default defineConfig(async (env) => {
  const publicMyOpenVdpFiles = await fg('*', { cwd: publicMyOpenVdpPath });
  if (!publicMyOpenVdpFiles.length) {
    throw new Error(
      `MyOpenVDP files missing in ${publicMyOpenVdpPath}. Please build ../ui before building this project. (cd ../ui ; yarn build)`
    );
  }
  return {
    plugins: [
      {
        name: 'check-backend-config',
        apply: 'serve',
        configureServer(devServer) {
          try {
            getBackendConfig();
          } catch (e) {
            devServer.config.logger.error('bad backend configuration.', {
              timestamp: true,
            });
            console.error(e);
            devServer.middlewares.use((_request, response) => {
              response.end(`Bad backend configuration: ${e as string}`);
            });
          }
        },
      },
      {
        name: 'index-html-replace-frontend-config-serve',
        apply: 'serve',
        enforce: 'pre',
        transformIndexHtml: renderWithFrontendConfig,
      },
      mix({
        handler: './src/api.ts',
      }),
    ],
  };
});
