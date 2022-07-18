import rimraf from 'rimraf';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function clean() {
  rimraf.sync(path.resolve(__dirname, '../dist/*'));
  console.log(` 💥 Cleaned build artifacts.\n`);
}
