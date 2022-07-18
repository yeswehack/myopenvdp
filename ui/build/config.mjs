import { dirname } from 'path';
import { readFileToJson } from './utils.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { name, author, version } = readFileToJson(__dirname + '/../package.json');
const year = new Date().getFullYear();

export default {
  name,
  version,
  banner: [`${name} v${version}`, `(c) ${year} ${author}`, 'Released under the MIT License.']
    .map((line) => `/*! ${line} */`)
    .join('\n'),
};
