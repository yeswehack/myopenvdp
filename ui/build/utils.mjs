import { existsSync, mkdirSync, writeFile as fsWriteFile, readFileSync } from 'fs';
import { join, relative, dirname } from 'path';
import { gzip } from 'zlib';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { green, blue, red, cyan } = chalk;

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

export function createFolder(folder) {
  const dir = join(__dirname, '..', folder);
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

export function writeFile(dest, code, zip) {
  const banner =
    dest.indexOf('.json') > -1
      ? red('[json]')
      : dest.indexOf('.js') > -1
      ? green('[js]  ')
      : dest.indexOf('.ts') > -1
      ? cyan('[ts]  ')
      : blue('[css] ');

  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(`${banner} ${relative(process.cwd(), dest).padEnd(41)} ${getSize(code).padStart(8)}${extra || ''}`);
      resolve(code);
    }

    fsWriteFile(dest, code, (err) => {
      if (err) return reject(err);
      if (zip) {
        gzip(code, (err, zipped) => {
          if (err) return reject(err);
          report(` (gzipped: ${getSize(zipped).padStart(8)})`);
        });
      } else {
        report();
      }
    });
  });
}

export function readFile(file) {
  return readFileSync(file, 'utf-8');
}

export function readFileToJson(file) {
  return JSON.parse(readFile(file));
}

export function logError(err) {
  console.error('\n' + red('[Error]'), err);
  console.log();
}
