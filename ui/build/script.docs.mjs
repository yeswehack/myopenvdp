import { dirname } from 'path';
import { readFileToJson, writeFile } from './utils.mjs';
import { fileURLToPath } from 'url';
import { jsonApiToMarkDown } from './describe.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await writeFile(
  'VdpForm.md',
  jsonApiToMarkDown('VdpForm', readFileToJson(__dirname + '/../src/components/VdpForm.json')),
  false
);
