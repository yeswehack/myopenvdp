import { readFileSync } from 'fs';

const tryReadFileFromEnv = (key: string) => {
  const env = process.env;
  if (key in env && env[key]) {
    const path = env[key] as string;
    try {
      return readFileSync(path).toString();
    } catch (e) {
      throw new Error(
        `Unable to read file '${path}' as defined by environment variable '${key}' (caused by: ${e as string})`,
        {
          cause: e,
        }
      );
    }
  }
  return undefined;
};
const ensureReadFileFromEnv = (key: string) => {
  const content = tryReadFileFromEnv(key);
  if (content === undefined) {
    throw new Error(`Unable to find environment variable '${key}'`);
  }
  return content;
};
const ensureReadJsonFileFromEnv = <T>(key: string) => {
  const content = ensureReadFileFromEnv(key);
  try {
    return JSON.parse(content) as T;
  } catch (e) {
    throw new Error(
      `Unable to read JSON file '${
        process.env[key] as string
      }' as defined by environment variable '${key}' (caused by: ${e as string})`,
      {
        cause: e,
      }
    );
  }
};

export { tryReadFileFromEnv, ensureReadFileFromEnv, ensureReadJsonFileFromEnv };
