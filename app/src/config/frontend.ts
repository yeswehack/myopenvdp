import fs from 'fs';
import path from 'path';
import mustache from 'mustache';
import { getConfig as getBackendConfig} from './backend';
import { tryReadFileFromEnv } from '../utils/config';
import { flattenKeys } from '../utils/flatten';

const envFontsUrlCss = 'FRONTEND_FONTS_URL_CSS';
const envVueUrlJs = 'FRONTEND_VUE_URL_JS';
const envQuasarUrlJs = 'FRONTEND_QUASAR_URL_JS';
const envQuasarUrlCss = 'FRONTEND_QUASAR_URL_CSS';
const envMainTitle = 'FRONTEND_MAIN_TITLE';
const envFormPgpKeysPath = 'FRONTEND_FORM_PGP_KEYS_PATH';
const envFormAttachmentMaxSizeBytes = 'FRONTEND_FORM_ATTACHMENT_MAX_SIZE_BYTES';
const envFormAttachmentAllowedExtensions = 'FRONTEND_FORM_ATTACHMENT_ALLOWED_EXTENSIONS';
const envFormLogsAutoScroll = 'FRONTEND_FORM_LOGS_AUTO_SCROLL';
const envFormLogsTimestampFormat = 'FRONTEND_FORM_TIMESTAMP_FORMAT';
const envFormNotificationsPosition = 'FRONTEND_FORM_NOTIFICATIONS_POSITION';
const envFormSuccessNotificationPosition = 'FRONTEND_FORM_SUCCESS_NOTIFICATION_POSITION';
const envFormErrorsNotificationPosition = 'FRONTEND_FORM_ERRORS_NOTIFICATION_POSITION';
const envFormDisclosurePolicyNotificationPosition = 'FRONTEND_FORM_DISCLOSURE_POLICY_NOTIFICATION_POSITION';
const envPartialHead = 'FRONTEND_PARTIAL_HEAD';
const envPartialBodyBeforeForm = 'FRONTEND_PARTIAL_BODY_BEFORE_FORM';
const envPartialBodyAfterForm = 'FRONTEND_PARTIAL_BODY_AFTER_FORM';
const envPartialBodyAfterScript = 'FRONTEND_PARTIAL_BODY_AFTER_SCRIPT';

const readPgpKeys = (key: string) => {
  const env = process.env;
  if (!(key in env)) {
    throw new Error(`Unable to find environment variable '${key}'`);
  }
  const keysPath = env[key] as string;
  const keysFiles = fs.readdirSync(keysPath).map((name) => {
    const keyPath = path.join(keysPath, name);
    try {
      return {
        name,
        key: fs.readFileSync(keyPath).toString(),
      };
    } catch (e) {
      throw new Error(
        `Unable to read file '${keyPath}' as defined by environment variable '${key}' (caused by: ${e as string})`,
        {
          cause: e,
        }
      );
    }
  });
  if (!keysFiles.length) {
    throw new Error(`No PGP Public keys found in '${keysPath}' as defined by environment variable '${key}'`);
  }
  return keysFiles;
};
type Config = {
  render: {
    values: {
      fonts: {
        url: {
          css: string;
        };
      };
      vue: {
        url: {
          js: string;
        };
      };
      quasar: {
        url: {
          js: string;
          css: string;
        };
      };
      title: string;
      form: {
        'captcha-enabled': boolean;
        'pgp-keys': {
          name: string;
          key: string;
        }[];
        attachment: {
          'max-size-bytes': string;
          'allowed-extensions': string;
        };
        logs: {
          'auto-scroll': string;
          'timestamp-format': string;
        };
        'notifications-position': string;
        'success-notification-position': string;
        'errors-notification-position': string;
        'disclosure-policy-notification-position': string;
      };
    };
    partials: {
      head: string;
      body: {
        'before-form': string;
        'after-form': string;
        'after-script': string;
      };
    };
  };
};
let config: Config;
const getConfig = () => {
  const env = process.env;
  if (!config) {
    config = {
      render: {
        values: {
          fonts: {
            url: {
              css:
                env[envFontsUrlCss] || 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
            },
          },
          vue: {
            url: {
              js: env[envVueUrlJs] || 'https://cdn.jsdelivr.net/npm/vue@3.2.39/dist/vue.global.prod.js',
            },
          },
          quasar: {
            url: {
              js: env[envQuasarUrlJs] || 'https://cdn.jsdelivr.net/npm/quasar@2.8.4/dist/quasar.umd.prod.js',
              css: env[envQuasarUrlCss] || 'https://cdn.jsdelivr.net/npm/quasar@2.8.4/dist/quasar.prod.css',
            },
          },
          title: env[envMainTitle] || 'VDP',
          form: {
            'captcha-enabled': getBackendConfig().captchaEnable,
            'pgp-keys': readPgpKeys(envFormPgpKeysPath),
            attachment: {
              'max-size-bytes': env[envFormAttachmentMaxSizeBytes] || '2 * 1024 * 1024',
              'allowed-extensions': env[envFormAttachmentAllowedExtensions] || 'txt jpeg jpg png gif tiff bmp',
            },
            logs: {
              'auto-scroll': env[envFormLogsAutoScroll] || '',
              'timestamp-format': env[envFormLogsTimestampFormat] || '',
            },
            'notifications-position': env[envFormNotificationsPosition] || '',
            'success-notification-position': env[envFormSuccessNotificationPosition] || '',
            'errors-notification-position': env[envFormErrorsNotificationPosition] || '',
            'disclosure-policy-notification-position': env[envFormDisclosurePolicyNotificationPosition] || '',
          },
        },
        partials: {
          head: tryReadFileFromEnv(envPartialHead) || '',
          body: {
            'before-form': tryReadFileFromEnv(envPartialBodyBeforeForm) || '<div style="width: 60%; margin: auto">',
            'after-form': tryReadFileFromEnv(envPartialBodyAfterForm) || '</div>',
            'after-script': tryReadFileFromEnv(envPartialBodyAfterScript) || '',
          },
        },
      },
    };
  }
  return config;
};

const renderWithConfig = (code: string) => {
  const frontendConfig = getConfig();
  return mustache.render(code, frontendConfig.render.values, flattenKeys<string>(frontendConfig.render.partials, '/'));
};

export { getConfig, renderWithConfig };
