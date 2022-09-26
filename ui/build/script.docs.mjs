import { dirname } from 'path';
import { readFileToJson, writeFile } from './utils.mjs';
import { fileURLToPath } from 'url';
import { jsonApiToMarkDown } from './describe.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const vdpFormJson = readFileToJson(__dirname + '/../src/components/VdpForm.json');
const vdpFormTranslationDescriptions = readFileToJson(__dirname + '/../src/components/i18n/descriptions.json');
vdpFormJson.props.translations.definition = {};
Object.keys(vdpFormTranslationDescriptions).forEach((key) => {
  vdpFormJson.props.translations.definition[key] = {
    type: 'String',
    desc: vdpFormTranslationDescriptions[key],
  };
});
await writeFile('VdpForm.md', jsonApiToMarkDown('VdpForm', vdpFormJson), false);
