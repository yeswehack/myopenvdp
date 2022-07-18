import path from 'path';
import replace from '@rollup/plugin-replace';
import { fileURLToPath } from 'url';
import { logError, readFileToJson } from './utils.mjs';
import buildConf from './config.mjs';

import { build as viteBuild } from 'vite';
import viteVue from '@vitejs/plugin-vue';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { version } = readFileToJson(__dirname + '/../package.json');

await build([
  {
    lib: {
      entry: pathResolve('../src/index.umd.js'),
      name: 'vdpForm',
      fileName: () => 'index.umd.js',
      formats: ['umd'],
    },
    minify: false,
  },
  {
    lib: {
      entry: pathResolve('../src/index.umd.js'),
      name: 'vdpForm',
      fileName: () => 'index.umd.min.js',
      formats: ['umd'],
    },
    minify: true,
  },
  {
    lib: {
      entry: pathResolve('../src/index.esm.js'),
      name: 'vdpForm',
      fileName: () => 'index.esm.js',
      formats: ['es'],
    },
    minify: true,
  },
  {
    lib: {
      entry: pathResolve('../src/index.common.js'),
      name: 'vdpForm',
      fileName: () => 'index.common.js',
      formats: ['cjs'],
    },
    minify: true,
  },
]);

async function buildEntry(options) {
  await viteBuild({
    build: {
      emptyOutDir: false,
      lib: {
        ...options.lib,
      },
      minify: options.minify,
      reportCompressedSize: true,
      rollupOptions: {
        external: ['vue', 'quasar'],
        output: {
          globals: {
            vue: 'Vue',
            quasar: 'Quasar',
          },
          inlineDynamicImports: true,
          banner: buildConf.banner,
        },
        plugins: [
          replace({
            preventAssignment: false,
            values: {
              __UI_VERSION__: `'${version}'`,
            },
          }),
        ],
      },
    },
    plugins: [viteVue()],
  });
}
function build(/** @type array[] */ builds) {
  return Promise.all(builds.map(buildEntry)).catch((error) => {
    logError(error);
    process.exit(1);
  });
}
function pathResolve(_path) {
  return path.resolve(__dirname, _path);
}
