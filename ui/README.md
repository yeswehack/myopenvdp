# Component VdpForm

[![npm](https://img.shields.io/npm/v/quasar-ui-vdp-form.svg?label=quasar-ui-vdp-form)](https://www.npmjs.com/package/quasar-ui-vdp-form)
[![npm](https://img.shields.io/npm/dt/quasar-ui-vdp-form.svg)](https://www.npmjs.com/package/quasar-ui-vdp-form)

**Compatible with Quasar UI v2 and Vue 3**.

> A form to provide details about a vulnerability disclosure

[![VdpForm](docs/screenshot-preview.png)](docs/screenshot.png)

⚠ Integration and development with a backend to handle submitted reports is your responsability.

# How it works
When a user fills and submits the form, the following happens **in its browser**:
- a ZIP file is created which contains:
  - all attachments provided by the user
  - `report.json` file containing a JSON representation of the disclosure
  - `report.md` file containing a Markdown representation of the disclosure
- the ZIP file is encrypted using a PGP key (provided in the component setup)
- the encrypted ZIP file is provided via the [`@submit`](#handling-report-submission) event for **and then handled/processed by you through your own development**.

See [component setup](dev/src/pages/VdpFormWithCaptcha.vue) and [backend API](dev-backend/src/api.ts) (nodejs/express/typescript) for fully functioning examples.

# Usage

## Quasar CLI project

Install the [App Extension](../app-extension).

**OR**:

Create and register a boot file:

```js
import Vue from 'vue';
import Plugin from 'quasar-ui-vdp-form';
import 'quasar-ui-vdp-form/dist/index.css';

Vue.use(Plugin);
```

**OR**:

```html
<style src="quasar-ui-vdp-form/dist/index.css"></style>

<script>
import { Component as VdpForm } from 'quasar-ui-vdp-form';

export default {

  components: {
    VdpForm
  }

}
</script>
```

## Vue CLI project

```js
import Vue from 'vue';
import Plugin from 'quasar-ui-vdp-form';
import 'quasar-ui-vdp-form/dist/index.css';

Vue.use(Plugin);
```

**OR**:

```html
<style src="quasar-ui-vdp-form/dist/index.css"></style>

<script>
import { Component as VdpForm } from 'quasar-ui-vdp-form';

export default {

  components: {
    VdpForm
  }

}
</script>
```

## UMD variant

Exports `window.vdp-form`.

Add the following tag(s) after the Quasar ones:

```html
<head>
  <!-- AFTER the Quasar stylesheet tags: -->
  <link href="https://cdn.jsdelivr.net/npm/quasar-ui-vdp-form/dist/index.min.css" rel="stylesheet" type="text/css">
</head>
<body>
  <!-- at end of body, AFTER Quasar script(s): -->
  <script src="https://cdn.jsdelivr.net/npm/quasar-ui-vdp-form/dist/index.umd.min.js"></script>
</body>
```
If you need the RTL variant of the CSS, then go for the following (instead of the above stylesheet link):
```html
<link href="https://cdn.jsdelivr.net/npm/quasar-ui-vdp-form/dist/index.rtl.min.css" rel="stylesheet" type="text/css">
```

# Component API
The component API is described in [VdpForm.md](VdpForm.md).

## Providing a PGP key
You need to provide a [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) public key for the report's data to be encrypted by the user's browser. It is possible to let the user choose between multiple keys using the `pgp-keys` property. For a better user experience, each key must be named.

See [VdpForm.md Properties section](VdpForm.md#properties) for a more detailed description of the `pgp-keys` property.

### Example setup of `pgp-keys`
```html
<vdp-form
  ...
  pgp-keys="pgpKeys"
></vdp-form>
<script>
import { ref } from 'vue';
const pgpKeys = ref([
  {
    name: 'PGP Key 1',
    key:
`-----BEGIN PGP PUBLIC KEY BLOCK-----
[...]
-----END PGP PUBLIC KEY BLOCK-----`,
  },
  {
    name: 'PGP Key 2',
    key:
`-----BEGIN PGP PUBLIC KEY BLOCK-----
[...]
-----END PGP PUBLIC KEY BLOCK-----`,
  },
]);
</script>
```

## Setting up a captcha
It is possible to limit spamlike submissions by setting up an image based [captcha](https://en.wikipedia.org/wiki/CAPTCHA) in the form. The user will be presented with an image displaying some garbled text which they have to input in a dedicated field. Upon report submission, this text should be checked/validated to ensure that it corresponds to the image that was presented to the user.

The captcha setup requires that you provide the following to the form through the `captcha-provider` property. This property is a function that should return an object containing:
- An URL to the image (data URLs are supported)
- The width and height of the image, in pixels
- A unique key identifying this specific captcha image. This key with be provided to the [`@submit`](#handling-report-submission) event along with the user's inputted value for you to check/validate.

See [VdpForm.md Properties section](VdpForm.md#properties) for a more detailed description of the `captcha-provider` property.

### Example setup of `captcha-provider`
```html
<vdp-form
  ...
  captcha-provider="captchaProvider"
></vdp-form>
<script>
async function captchaProvider() {
  return await fetch('https://vdp-form-backend.localhost/api/captcha')
    .then((response) => response.json());
}
</script>
```

## Handling report submission
When a report is submitted, the event `@submit` is triggered with a payload, a success callback function and a failure callback function as parameters:
- The payload contains the data from the report and an optional [captcha](#setting-up-a-captcha)
- The success callback function is intended to be called when you have handled the report submission successfully
- The failure callback function is intended to be called when you have failed to handle the report submission

See [VdpForm.md Events section](VdpForm.md#events) for a more detailed description of the `@submit` event parameters.

### Example setup of `@submit`
```html
<vdp-form
  ...
  @submit="onSubmit"
></vdp-form>
<script>
function onSubmit(
  payload: {
    captcha: unknown;
    report: unknown;
  },
  success: (message?: string) => void,
  failure: (message?: string) => void
) {
  // build POST data
  const body = new FormData();
  body.append('captcha', JSON.stringify(payload.captcha));
  body.append('report', JSON.stringify(payload.report));
  // post the data to the backend
  fetch(
    'https://vdp-form-backend.localhost/api/upload',
    {
      method: 'POST',
      body,
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        throw await response.text();
      }
    })
    .then(() => success('Your report has been submitted!'))
    .catch((reason) => failure(reason as string));
}
</script>
```

# Setup
```bash
$ yarn
```

# Developing

## Local
```bash
# start dev in SPA mode
$ yarn dev

# start dev in UMD mode
$ yarn dev:umd
```

## Docker
To ease development, a Docker stack is provided which includes a simple backend that allows saving reports in local files.

```bash
$ docker-compose up -d
```

Then head to [https://vdp-form-ui.localhost](https://vdp-form-ui.localhost).

# Building package
```bash
$ yarn build
```

# Adding Testing Components
in the `ui/dev/src/pages` you can add Vue files to test your component/directive. When using `yarn dev` to build the UI, any pages in that location will automatically be picked up by dynamic routing and added to the test page.

# License
MIT (c) YesWeHack project@yeswehack.com
