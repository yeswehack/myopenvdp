process.env.NODE_ENV = 'production';

import { fork } from 'child_process';
import { join, dirname } from 'path';
import { createFolder, readFileToJson } from './utils.mjs';
import { syncAppExt } from './script.app-ext.mjs';
import { clean } from './script.clean.mjs';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { green } = chalk;

console.log();

syncAppExt();
clean();

console.log(` 📦 Building ${green('v' + readFileToJson(__dirname + '/../package.json').version)}...\n`);

createFolder('dist');

fork(join(__dirname, './script.javascript.mjs')).on('exit', (code) => {
  if (code === 0) {
    fork(join(__dirname, './script.css.mjs'));
  }
});
