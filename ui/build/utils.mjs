import { existsSync, mkdirSync, writeFile as fsWriteFile, readFileSync } from 'fs';
import { join, relative, dirname } from 'path';
import { gzip } from 'zlib';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import util from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { green, blue, red, cyan, yellow } = chalk;

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
      : dest.indexOf('.md') > -1
      ? yellow('[md]  ')
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

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class StringWriter {

  /**
   * @constructor
   * @param {object} [opts]
   * @param {string} [opts.eol] - default is '\r\n'
   * @param {string} [opts.separator] - default is empty string ''
   */
  constructor(opts) {

    opts = opts || {};
    opts.eol = opts.eol || '\n';
    opts.separator = opts.separator || '';

    /**
     * @type {{eol: string, separator: string}}
     * @private
     */
    this._opts = opts;

    /**
     * @type {Array<string>}
     * @private
     */
    this._buffer = [];
  }

  /**
   * Clear buffer.
   */
  clear() {
    this._buffer.length = 0;
  }

  /**
   * Write string to buffer.
   * @param {string} str
   * @returns {StringWriter}
   */
  write(str) {
    this._buffer.push(str);
    return this;
  }

  /**
   * Write formatted string to buffer.
   * @param {string} format
   * @returns {StringWriter}
   */
  writeFormat(format) {
    return this.write(
      util.format.apply(format, Array.prototype.slice.call(arguments))
    );
  }

  /**
   * Write string and end of line.
   * @param {string} [str]
   * @returns {StringWriter}
   */
  writeLine(str) {
    if (str && str.length) this.write(str);
    return this.write(this._opts.eol);
  }

  /**
   * Cast everything into string.
   * @returns {string}
   */
  toString() {
    return this._buffer.join(this._opts.separator);
  }

  /**
   * Create a new writer.
   * @returns {StringWriter}
   */
  static create() {
    return new StringWriter();
  }

};
