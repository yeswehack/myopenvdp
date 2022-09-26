<template>
  <q-form
    ref="vdpForm"
    greedy
    class="col column"
  >
    <div
      ref="htmlFormRef"
      class="col column vdp-form"
    >
      <div class="row justify-center">
        <div class="col column q-col-gutter-md">
          <div class="text-h5 summary-header">
            {{ tr('vulnerabilitySummaryTitle') }}
          </div>
          <vdp-input
            v-model="form.summary.title"
            :label="tr('reportTitleLabel')"
            required
            :required-label="tr('valueMustNotBeBlank')"
            :placeholder="tr('reportTitlePlaceholder')"
            :maxlen-label="rawTr('maxChars')"
            :maxlen="250"
            class="summary-title"
          />
          <vdp-input
            v-model="form.summary.product"
            :label="tr('productLabel')"
            required
            :required-label="tr('valueMustNotBeBlank')"
            :placeholder="tr('productPlaceholder')"
            :maxlen-label="rawTr('maxChars')"
            :maxlen="250"
            class="summary-product"
          />
          <vdp-select
            v-if="pgpKeySelectOptions.length > 1"
            v-model="form.summary.pgpKey"
            :label="tr('pgpKeyLabel')"
            required
            :placeholder="tr('pgpKeyPlaceholder')"
            :options="pgpKeySelectOptions"
            class="summary-cert"
          />
          <div class="text-h5 cvss-header">
            {{ tr('cvss3ScoreTitle') }}
          </div>
          <vdp-cvss
            v-model="form.cvss"
            class="summary-cvss"
            :card-score-title="tr('cvss3CardScoreTitle')"
            :card-severity-title="tr('cvss3CardSeverityTitle')"
            :field-required-label="tr('valueMustNotBeBlank')"
            :attack-vector-label="tr('cvss3AttackVectorLabel')"
            :user-interaction-label="tr('cvss3UserInteractionLabel')"
            :attack-complexity-label="tr('cvss3AttackComplexityLabel')"
            :confidentiality-label="tr('cvss3ConfidentialityLabel')"
            :privileges-required-label="tr('cvss3PrivilegesRequiredLabel')"
            :integrity-label="tr('cvss3IntegrityLabel')"
            :scope-label="tr('cvss3ScopeLabel')"
            :availability-label="tr('cvss3AvailabilityLabel')"
            :av-network-label="tr('cvss3AvNetworkLabel')"
            :av-adjacent-label="tr('cvss3AvAdjacentLabel')"
            :av-local-label="tr('cvss3AvLocalLabel')"
            :av-physical-label="tr('cvss3AvPhysicalLabel')"
            :ui-none-label="tr('cvss3UiNoneLabel')"
            :ui-required-label="tr('cvss3UiRequiredLabel')"
            :ac-low-label="tr('cvss3AcLowLabel')"
            :ac-high-label="tr('cvss3AcHighLabel')"
            :c-none-label="tr('cvss3CNoneLabel')"
            :c-low-label="tr('cvss3CLowLabel')"
            :c-high-label="tr('cvss3CHighLabel')"
            :pr-none-label="tr('cvss3PrNoneLabel')"
            :pr-low-label="tr('cvss3PrLowLabel')"
            :pr-high-label="tr('cvss3PrHighLabel')"
            :i-none-label="tr('cvss3INoneLabel')"
            :i-low-label="tr('cvss3ILowLabel')"
            :i-high-label="tr('cvss3IHighLabel')"
            :s-unchanged-label="tr('cvss3SUnchangedLabel')"
            :s-changed-label="tr('cvss3SChangedLabel')"
            :a-none-label="tr('cvss3ANoneLabel')"
            :a-low-label="tr('cvss3ALowLabel')"
            :a-high-label="tr('cvss3AHighLabel')"
          />
          <div class="text-h5 profile-header">
            <q-icon
              name="key"
              :title="tr('encryptedBeforeSubmission')"
            />
            {{ tr('reporterInformationTitle') }}
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm">
              <vdp-input
                v-model="form.profile.name"
                :label="tr('reporterNameLabel')"
                :placeholder="tr('reporterNamePlaceholder')"
                class="profile-name"
              />
            </div>
            <div class="col-xs-12 col-sm">
              <vdp-input
                v-model="form.profile.mail"
                :label="tr('reporterEmailLabel')"
                :placeholder="tr('reporterEmailPlaceholder')"
                class="profile-mail"
              />
            </div>
          </div>
          <vdp-input
            v-model="form.profile.pgp"
            textarea
            :label="tr('reporterPgpKeyLabel')"
            :placeholder="`-----BEGIN PGP PUBLIC KEY BLOCK-----\n...`"
            class="profile-pgp"
          />
          <div class="text-h5 details-header">
            <q-icon
              name="key"
              :title="tr('encryptedBeforeSubmission')"
            />
            {{ tr('technicalDetailsTitle') }}
          </div>
          <vdp-input
            v-model="form.details.endpoint"
            :label="tr('endpointLabel')"
            :placeholder="tr('endpointPlaceholder')"
            required
            :required-label="tr('valueMustNotBeBlank')"
            class="details-endpoint"
          />
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm">
              <vdp-select
                v-model="form.details.part"
                :label="tr('vulnerablePartLabel')"
                required
                :required-label="tr('valueMustNotBeBlank')"
                :placeholder="tr('vulnerablePartPlaceholder')"
                :options="vulnerablePartOptions"
                class="details-part"
              />
            </div>
            <div class="col-xs-12 col-sm">
              <vdp-input
                v-model="form.details.partName"
                :label="tr('partNameLabel')"
                :placeholder="tr('partNamePlaceholder')"
                :maxlen-label="rawTr('maxChars')"
                :maxlen="250"
                required
                :required-label="tr('valueMustNotBeBlank')"
                class="details-partname"
              />
            </div>
          </div>
          <vdp-input
            v-model="form.details.payload"
            :label="tr('payloadLabel')"
            :placeholder="tr('payloadPlaceholder')"
            required
            :required-label="tr('valueMustNotBeBlank')"
            class="details-payload"
          />
          <vdp-input
            v-model="form.details.env"
            :label="tr('technicalEnvironmentLabel')"
            :placeholder="tr('technicalEnvironmentPlaceholder')"
            :maxlen-label="rawTr('maxChars')"
            :maxlen="250"
            required
            :required-label="tr('valueMustNotBeBlank')"
            class="details-env"
          />
          <div class="row">
            <div class="col column details-report">
              <vdp-label required>
                {{ tr('technicalDetailsLabel') }}
                <!-- eslint-disable vue/no-v-html -->
                (<span
                  class="hint"
                  v-html="technicalDetailsMarkdownTranslation"
                />)
                <!-- eslint-enable -->
              </vdp-label>
              <q-tabs
                v-model="technicalDetailsEditMode"
                align="left"
                no-caps
                dense
              >
                <q-tab
                  name="edit"
                  :label="tr('technicalDetailsEdit')"
                />
                <q-tab
                  name="preview"
                  :label="tr('technicalDetailsPreview')"
                />
              </q-tabs>
              <q-tab-panels
                v-model="technicalDetailsEditMode"
                class="bg-transparent"
              >
                <q-tab-panel
                  name="edit"
                  class="q-px-none"
                >
                  <vdp-input
                    v-model="form.details.report"
                    required
                    :required-label="tr('valueMustNotBeBlank')"
                    textarea
                  />
                </q-tab-panel>
                <q-tab-panel
                  name="preview"
                  class="q-px-none"
                >
                  <q-field outlined>
                    <template #control>
                      <vdp-markdown
                        :content="form.details.report"
                        class="preview-markdown self-center full-width no-outline"
                      />
                    </template>
                  </q-field>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
          <div class="row">
            <div
              class="col attachments q-pa-xl"
              @drop.prevent="loadReportAttachmentsFromDrop"
              @dragenter.prevent
              @dragover.prevent
            >
              <label class="text-center">
                {{
                  tr('attachmentsPlaceholder', {
                    maxSize: humanStorageSize(props.attachmentMaxSizeBytes),
                    extensions: reportAttachmentExtensionsChoice,
                  })
                }}
                <input
                  type="file"
                  :accept="reportAttachmentInputAccept"
                  hidden
                  multiple
                  @change="loadReportAttachmentsFromInput"
                />
              </label>
              <div
                v-for="[idx, attachment] of form.attachments.entries()"
                :key="idx"
                class="row file q-mt-sm"
              >
                <span class="col name">{{ attachment.filename }}</span>
                <span class="col text-right">
                  {{ attachment.strSize }}
                  <q-btn
                    round
                    class="delete q-ml-sm q-mb-xs"
                    icon="clear"
                    size="xs"
                    @click="removeReportAttachment(form, idx)"
                  />
                </span>
              </div>
            </div>
          </div>
          <div
            v-if="providedCaptchaData"
            class="row"
          >
            <div class="col">
              <vdp-captcha
                ref="captcha"
                v-model:captcha-value="form.captcha.value"
                v-model:captcha-url="providedCaptchaData.url"
                v-model:captcha-width="providedCaptchaData.width"
                v-model:captcha-height="providedCaptchaData.height"
                :label="tr('captchaLabel')"
                :placeholder="tr('captchaPlaceholder')"
                required
                :required-label="tr('valueMustNotBeBlank')"
                class="captcha"
                @refresh="refreshCaptcha"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-checkbox
                v-model="form.policyAccepted"
                dense
                class="checkbox policy"
                @vnode-updated="onPolicyNodeUpdated"
              >
                <!-- eslint-disable vue/no-v-html -->
                <span v-html="disclosurePolicyCheckboxTranslation" />
                <!-- eslint-enable -->
              </q-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-checkbox
                v-model="form.intellectualPropertyAccepted"
                dense
                class="checkbox intellectual-property"
              >
                {{ tr('intellectualPropertyCheckbox') }}
              </q-checkbox>
            </div>
          </div>
          <div class="row justify-center">
            <q-btn
              :label="tr('sendReportLabel')"
              color="primary"
              :disabled="submitting"
              @click="submit"
            />
          </div>
          <div class="row">
            <vdp-submission-logs
              :logs="submissionLogs"
              :auto-scroll="logsAutoScroll"
              :timestamp-format="logsTimestampFormat"
            />
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref, toRaw } from 'vue';
import { useQuasar, format, QNotifyCreateOptions, QForm } from 'quasar';
import JSZip from 'jszip';
import cvss from 'cvss';
import { Attachment, CvssMeta, ReportData, Submission, SubmissionLog } from './types';
import {
  cvssToVector,
  defaultAllowedFileExtensions,
  getRequiredFieldsErrors,
  loadReportAttachments,
  reportDataToJson,
  reportDataToMarkdown,
} from './utils';
import { renderTemplate, copy } from '../utils';
import { rawTr as defaultRawTr, TrProvider } from './i18n/tr';
import { VdpFormPartialTranslation, VdpFormTranslationKey } from './i18n/types';
import VdpCaptcha from './VdpCaptcha.vue';
import VdpCvss from './VdpCvss.vue';
import VdpInput from './VdpInput.vue';
import VdpLabel from './VdpLabel.vue';
import VdpMarkdown from './VdpMarkdown.vue';
import VdpSelect from './VdpSelect.vue';
import VdpSubmissionLogs from './VdpSubmissionLogs.vue';

const $q = useQuasar();
const { humanStorageSize } = format;

type NotifyPosition = QNotifyCreateOptions['position'];
type CaptchaData = {
  url: string;
  key: string;
  width?: number;
  height?: number;
};

interface Props {
  pgpKey:
    | string
    | {
        name: string;
        key: string;
      }[];
  attachmentMaxSizeBytes?: number;
  attachmentAllowedExtensions?: string[];
  notificationsPosition?: NotifyPosition;
  successNotificationPosition?: NotifyPosition;
  errorsNotificationPosition?: NotifyPosition;
  disclosurePolicyNotificationPosition?: NotifyPosition;
  captchaProvider?: () => Promise<CaptchaData>;
  logsAutoScroll?: boolean;
  logsTimestampFormat?: string;
  translations?: VdpFormPartialTranslation;
}

const props = withDefaults(defineProps<Props>(), {
  attachmentMaxSizeBytes: 2 * 1024 * 1024,
  attachmentAllowedExtensions: () => defaultAllowedFileExtensions,
  notificationsPosition: 'top',
  successNotificationPosition: undefined,
  errorsNotificationPosition: undefined,
  disclosurePolicyNotificationPosition: undefined,
  captchaProvider: undefined,
  logsAutoScroll: true,
  logsTimestampFormat: undefined,
  translations: () => {
    return {};
  },
});

const rawTr = (key: VdpFormTranslationKey) => props.translations[key] || defaultRawTr(key);
const tr: TrProvider = (key: VdpFormTranslationKey, data: Record<string, string | number> = {}) =>
  renderTemplate(rawTr(key), data);

type SubmitSuccessCallback = () => void;
type SubmitFailureCallback = (message?: string) => void;
const emit = defineEmits<{
  (e: 'submit', payload: Submission, success: SubmitSuccessCallback, failure: SubmitFailureCallback): void;
}>();

let providedCaptchaData = ref<CaptchaData | null>(null);

const initialForm = {
  policyAccepted: false,
  intellectualPropertyAccepted: false,
  captcha: {
    value: '',
  },
  summary: {
    title: '',
    pgpKey: '',
    product: '',
  },
  profile: {
    name: '',
    mail: '',
    pgp: '',
  },
  details: {
    endpoint: '',
    part: '',
    partName: '',
    payload: '',
    env: '',
    report: '',
  },
  attachments: [] as Attachment[],
  cvss: {
    AV: '',
    AC: '',
    PR: '',
    S: '',
    A: '',
    I: '',
    C: '',
    UI: '',
  },
} as ReportData;
const form = reactive(copy(initialForm));

const pgpKeySelectOptions = computed(() =>
  typeof props.pgpKey == 'string'
    ? [{ label: 'default', value: 'default', key: props.pgpKey }]
    : props.pgpKey.map((pgpKey) => ({ label: pgpKey.name, value: pgpKey.name, key: pgpKey.key }))
);

const computedCvss = computed<CvssMeta>(() => ({
  vector: cvssToVector(form.cvss),
  score: cvss.getScore(form.cvss),
}));

const vulnerablePartOptions = ref(
  ['get-parameter', 'post-parameter', 'cookie', 'header', 'path', 'http-method', 'other'].map((part) => ({
    label: part,
    value: part,
  }))
);

const htmlFormRef = ref<HTMLElement>();

const technicalDetailsEditMode = ref('edit');
const technicalDetailsMarkdownTranslation = computed(() =>
  tr('technicalDetailsMarkdown', {
    markdown: '<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a>',
  })
);

const openPolicyLinkClass = 'open-policy-link';
const disclosurePolicyCheckboxTranslation = computed(() =>
  tr('disclosurePolicyCheckbox', {
    disclosurePolicy: renderTemplate('<a href="#" class="{{class}}">{{link}}</a>', {
      class: openPolicyLinkClass,
      link: tr('disclosurePolicyLabel'),
    }),
  })
);
const setOpenPolicyLinkEventListeners = () =>
  Array.from(unref(htmlFormRef)?.getElementsByClassName(openPolicyLinkClass) ?? []).forEach((e) => {
    e.removeEventListener('click', openPolicyClickHandler);
    e.addEventListener('click', openPolicyClickHandler, true);
    e.removeEventListener('keydown', openPolicyKeydownHandler);
    e.addEventListener('keydown', openPolicyKeydownHandler, true);
  });
const onPolicyNodeUpdated = () => setOpenPolicyLinkEventListeners();
function openPolicyClickHandler(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  openPolicy();
}
function openPolicyKeydownHandler(event: Event) {
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.code == 'Enter' || keyboardEvent.code == 'Space') {
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    openPolicy();
  }
}
function openPolicy() {
  $q.notify({
    message: tr('disclosurePolicyHtml'),
    html: true,
    timeout: 60 * 1000,
    multiLine: true,
    position: props.disclosurePolicyNotificationPosition || props.notificationsPosition,
    actions: [
      {
        label: tr('disclosurePolicyAcceptLabel'),
        handler: () => (form.policyAccepted = true),
      },
      {
        label: tr('disclosurePolicyRefuseLabel'),
        handler: () => (form.policyAccepted = false),
      },
    ],
  });
}

const reportAttachmentExtensionsChoice = computed(() => {
  return props.attachmentAllowedExtensions.map((e) => `.${e}`).join(', ');
});
const reportAttachmentInputAccept = computed(() => {
  return props.attachmentAllowedExtensions.map((e) => `.${e}`).join(', ');
});
function loadReportAttachmentsFromDrop(ev: DragEvent) {
  const data = ev.dataTransfer;
  if (data == null) {
    return;
  }
  const files = data.files;
  if (files == null) {
    return;
  }
  const errors = loadReportAttachments(
    tr,
    form,
    files,
    props.attachmentMaxSizeBytes,
    props.attachmentAllowedExtensions
  );
  if (errors.length > 0) {
    notifyError(`<b>${tr('attachmentsErrorsTitle')}:</b><br/>- ${errors.join('<br/>- ')}`);
  }
}
function loadReportAttachmentsFromInput(ev: Event) {
  const target = ev.target as HTMLInputElement;
  if (target == null || target.files == null) {
    return;
  }
  const files = target.files;
  if (files == null) {
    return;
  }
  const errors = loadReportAttachments(
    tr,
    form,
    files,
    props.attachmentMaxSizeBytes,
    props.attachmentAllowedExtensions
  );
  if (errors.length > 0) {
    notifyError(`<b>${tr('attachmentsErrorsTitle')}:</b><br/>- ${errors.join('<br/>- ')}`);
  }
}
function removeReportAttachment(report: ReportData, idx: number) {
  report.attachments.splice(idx, 1);
}

const submissionLogs = ref<SubmissionLog[]>([]);
function resetSubmissionLogs() {
  submissionLogs.value = [];
}
function addSubmissionLog(log: SubmissionLog) {
  submissionLogs.value.push({
    date: new Date(),
    ...log,
  });
}
function updateLastSubmissionLog(log: SubmissionLog) {
  const lastLog = submissionLogs.value[submissionLogs.value.length - 1];
  submissionLogs.value[submissionLogs.value.length - 1] = {
    ...lastLog,
    ...log,
  };
}
async function digestBlob(blob: Blob) {
  const buff = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buff);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createZip() {
  const zip: JSZip = new JSZip();
  const attachmentFolder = zip.folder('attachments');
  if (!attachmentFolder) {
    return Promise.reject();
  }
  const cvssMeta = unref(computedCvss);
  zip.file('report.json', JSON.stringify(reportDataToJson(form, cvssMeta)));
  zip.file('report.md', reportDataToMarkdown(form, cvssMeta));
  for (const [i, attachment] of form.attachments.entries()) {
    const filename = `${i + 1}-${attachment.filename}`;
    attachmentFolder.file(filename, attachment.content);
  }
  const zipBlob = await zip.generateAsync({
    type: 'blob',
  });
  return zipBlob;
}
async function encryptReport(zipBlob: Blob, key: string) {
  const message = new Uint8Array(await zipBlob.arrayBuffer());
  let pgpMessage;
  const openpgp = await import('openpgp');
  try {
    pgpMessage = await openpgp.encrypt({
      message: await openpgp.createMessage({
        binary: message,
      }),
      encryptionKeys: await openpgp.readKey({
        armoredKey: key,
      }),
    });
  } catch (e) {
    return Promise.reject(e as string);
  }
  return pgpMessage;
}
async function sendReport(zipBlob: Blob, pgpMessage: string) {
  const zipBlobPlainHash = await digestBlob(zipBlob);
  const submission: Submission = {
    captcha: {
      key: providedCaptchaData.value?.key,
      value: form.captcha.value,
    },
    report: {
      title: form.summary.title,
      product: form.summary.product,
      cvss: toRaw(form.cvss),
      cvss_score: computedCvss.value.score,
      pgp_data: pgpMessage,
      hash_algorithm: 'SHA-256',
      digest_hex: zipBlobPlainHash,
    },
  };
  return new Promise<string>((resolve, reject) => {
    emit(
      'submit',
      submission,
      (message?: string) => resolve(typeof message == 'string' && message ? message : tr('submissionReportSentLabel')),
      (message?: string) =>
        reject(typeof message == 'string' && message ? message : tr('unexpectedError', { message: '[no message]' }))
    );
  });
}

async function logReportData(zipBlob: Blob, pgpMessage: string) {
  const zipBlobPlainHash = await digestBlob(zipBlob);
  const pgpBlob = new Blob([pgpMessage], { type: 'text/plain' });
  const pgpBlobPlainHash = await digestBlob(pgpBlob);

  addSubmissionLog({
    icon: 'download',
    title: tr('submissionReportDownloadLabel'),
    message: `${tr('submissionReportDownloadMessage')}:`,
    links: [
      {
        label: 'Report.zip',
        download: 'Report.zip',
        url: URL.createObjectURL(zipBlob),
        suffix: ` (sha256: ${zipBlobPlainHash})`,
      },
      {
        label: 'Report.zip.enc',
        download: 'Report.zip.enc',
        url: URL.createObjectURL(pgpBlob),
        suffix: ` (sha256: ${pgpBlobPlainHash})`,
      },
    ],
  });
}

const vdpForm = ref<QForm>();
const submitting = ref(false);
async function submit() {
  submitting.value = true;
  vdpForm.value?.resetValidation();
  resetSubmissionLogs();
  return vdpForm.value
    ?.validate()
    .then((validated) =>
      validated
        ? getRequiredFieldsErrors(tr, form, {
            noCaptcha: !providedCaptchaData.value,
          })
        : Promise.reject(tr('formInvalidMessage'))
    )
    .then((errors) => {
      if (errors.length > 0) {
        return Promise.reject(`<b>${tr('formErrorsTitle')}:</b><br/>- ${errors.join('<br/>- ')}`);
      }
      return Promise.resolve();
    })
    .then(() =>
      addSubmissionLog({
        icon: 'folder_zip',
        title: tr('submissionCompressingReportLabel'),
      })
    )
    .then(createZip)
    .then((zip) => {
      if (!zip) {
        return Promise.reject(tr('submissionCompressingReportError'));
      }
      return zip;
    })
    .then((zip) => {
      updateLastSubmissionLog({
        message: tr('submissionCompressingReportSuccess'),
      });
      const selectedPgpKey = pgpKeySelectOptions.value.find(
        (pgpKeyOption) => pgpKeyOption.label == form.summary.pgpKey
      );
      if (!selectedPgpKey) {
        return Promise.reject(tr('errorFieldIsEmpty', { field: 'PGP Key' }));
      }
      return { zip, key: selectedPgpKey.key };
    })
    .then(async ({ zip, key }) => {
      addSubmissionLog({
        icon: 'key',
        title: tr('submissionEncryptingReportLabel'),
      });
      return {
        zip,
        message: (await encryptReport(zip, key)) as string,
      };
    })
    .then(async ({ zip, message }) => {
      updateLastSubmissionLog({
        message: tr('submissionEncryptingReportSuccess'),
      });
      addSubmissionLog({
        icon: 'send',
        title: tr('submissionSendingReportLabel'),
      });
      const successMessage = await sendReport(zip, message);
      return { zip, message, successMessage };
    })
    .then(async ({ zip, message, successMessage }) => {
      updateLastSubmissionLog({
        message: tr('submissionSendingReportSuccess'),
      });
      await logReportData(zip, message);
      return { successMessage };
    })
    .then(({ successMessage }) => {
      addSubmissionLog({
        icon: 'celebration',
        title: tr('submissionReportSentLabel'),
      });
      return { successMessage };
    })
    .then(({ successMessage }) => {
      notifySuccess(successMessage);
    })
    .then(() => resetForm())
    .catch((error) => {
      if (error) {
        updateLastSubmissionLog({
          message: tr('unexpectedError', {
            message: error as string,
          }),
        });
        notifyError(error as string);
      }
    })
    .finally(() => {
      submitting.value = false;
    });
}

function notifySuccess(message: string) {
  $q.notify({
    type: 'positive',
    group: 'notifications',
    position: props.successNotificationPosition || props.notificationsPosition,
    timeout: 6000,
    html: true,
    message,
    actions: [{ label: tr('notificationDismissLabel'), color: 'white', handler: () => void 0 }],
  });
}

function notifyError(message: string) {
  $q.notify({
    type: 'negative',
    group: 'notifications',
    position: props.errorsNotificationPosition || props.notificationsPosition,
    timeout: 6000,
    html: true,
    message,
    actions: [{ label: tr('notificationDismissLabel'), color: 'white', handler: () => void 0 }],
  });
}

const resetForm = () => {
  Object.assign(form, copy(initialForm));
  if (pgpKeySelectOptions.value.length == 1) {
    form.summary.pgpKey = pgpKeySelectOptions.value[0].label;
  }
  return refreshCaptcha();
};
const refreshCaptcha = async () => {
  if (props.captchaProvider) {
    providedCaptchaData.value = await props.captchaProvider();
  }
};
onMounted(async () => {
  await refreshCaptcha();
  if (pgpKeySelectOptions.value.length == 1) {
    form.summary.pgpKey = pgpKeySelectOptions.value[0].label;
  }
  setOpenPolicyLinkEventListeners();
});
</script>

<style lang="scss" scoped>
@import 'quasar/src/css/variables.sass';

.vdp-form {
  :deep(a) {
    color: $primary;
  }

  .choose-pgp-key {
    border: solid 1px $primary !important;
    border-radius: $generic-border-radius !important;

    p.label {
      font-weight: 600;
    }
  }

  :deep(.preview-markdown) {
    padding: 0.9375em 1.25em 1em;
    height: 250px;
    min-height: calc(1.1875em + 2em);
    overflow: auto;

    @import '../css/markdown-preview.scss';

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0 !important;
    }
  }

  .attachments {
    border: 1px dashed;
    border-radius: $generic-border-radius;
    label {
      display: block;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .file {
      border-bottom: 1px dotted;
      .name {
        overflow: hidden;
      }
    }
  }
}
</style>
