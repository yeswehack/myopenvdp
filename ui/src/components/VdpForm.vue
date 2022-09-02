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
          <div
            v-if="pgpKeySelectOptions.length > 1"
            class="row"
          >
            <div class="col column choose-pgp-key q-pa-md">
              <p class="label">{{ tr('pgpKeyWhichLabel') }}</p>
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="tr('pgpKeyWhichExplanation')"></div>
              <!-- eslint-enable -->
            </div>
          </div>
          <div class="text-h5 cvss-header">
            {{ tr('cvss3ScoreTitle') }}
          </div>
          <vdp-cvss
            v-model="form.cvss"
            class="summary-cvss"
            :score-label="tr('cvss3ScoreTitle')"
            :field-required-label="tr('valueMustNotBeBlank')"
            :severity-label="tr('cvss3SeverityLabel')"
            :attack-vector-label="tr('cvss3AttackVectorLabel')"
            :user-interaction-label="tr('cvss3UserInteractionLabel')"
            :attack-complexity-label="tr('cvss3AttackComplexityLabel')"
            :confidentiality-label="tr('cvss3ConfidentialityLabel')"
            :privileges-required-label="tr('cvss3PrivilegesRequiredLabel')"
            :integrity-label="tr('cvss3IntegrityLabel')"
            :scope-label="tr('cvss3ScopeLabel')"
            :availability-label="tr('cvss3AvailabilityLabel')"
            :network-label="tr('cvss3NetworkLabel')"
            :adjacent-label="tr('cvss3AdjacentLabel')"
            :local-label="tr('cvss3LocalLabel')"
            :physical-label="tr('cvss3PhysicalLabel')"
            :none-label="tr('cvss3NoneLabel')"
            :low-label="tr('cvss3LowLabel')"
            :high-label="tr('cvss3HighLabel')"
            :required-label="tr('cvss3RequiredLabel')"
            :changed-label="tr('cvss3ChangedLabel')"
            :unchanged-label="tr('cvss3UnchangedLabel')"
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
            <vdp-submission-logs :logs="submissionLogs" />
          </div>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref, toRaw, watch } from 'vue';
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
import { renderTemplate } from '../utils';
import { rawTr, tr } from './i18n/tr';
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
  pgpKeys: {
    name: string;
    key: string;
  }[];
  attachmentMaxSizeBytes?: number;
  attachmentAllowedExtensions?: string[];
  notificationsPosition?: NotifyPosition;
  errorsNotificationPosition?: NotifyPosition;
  disclosurePolicyNotificationPosition?: NotifyPosition;
  captchaProvider?: () => Promise<CaptchaData>;
}

const props = withDefaults(defineProps<Props>(), {
  attachmentMaxSizeBytes: 2 * 1024 * 1024,
  attachmentAllowedExtensions: () => defaultAllowedFileExtensions,
  notificationsPosition: 'top',
  errorsNotificationPosition: undefined,
  disclosurePolicyNotificationPosition: undefined,
  captchaProvider: undefined,
});

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
const form = reactive(initialForm);

Object.assign(form, {
  policyAccepted: true,
  intellectualPropertyAccepted: true,
  captcha: {
    value: '',
  },
  summary: {
    title: 'My report',
    pgpKey: 'PGP Key 2',
    product: 'The product',
  },
  profile: {
    name: 'Rob Banks',
    mail: 'rob@banks.org',
    pgp: '',
  },
  details: {
    endpoint: '/foo/bar',
    part: 'get-parameter',
    partName: 'baz',
    payload: 'qux',
    env: 'ff, chrome',
    report: '# yo\n\ntu vas bien ?\n\n## moi ça va\n\nsuper\n\n### et toi ?',
  },
  attachments: (() => {
    const encoder = new TextEncoder();
    const fooContent = '*'.repeat(30000);
    const svgContent =
      '<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="2500" viewBox="0 0 637.795 637.801"><path fill="#f90" d="M0 .007h637.793V637.8H0z"/><path fill="#de8500" d="M318.887 318.908h318.906v317.92H318.887z"/><path fill="#ffb13b" d="M.005.002H318.91v318.906H.005z"/><g fill="#f90" transform="matrix(4.67501 0 0 4.67501 -1474.901 -846.129)"><circle cx="340.757" cy="249.099" r="25.063"/><circle cx="353.365" cy="218.661" r="25.063"/><circle cx="383.803" cy="206.053" r="25.063"/><circle cx="414.241" cy="218.661" r="25.063"/><circle cx="426.849" cy="249.099" r="25.063"/><circle cx="414.241" cy="279.538" r="25.063"/><circle cx="383.803" cy="292.146" r="25.063"/><circle cx="353.365" cy="279.538" r="25.063"/></g><path d="M402.742 117.161c0-46.02-37.335-83.36-83.36-83.36s-83.36 37.335-83.36 83.36c-32.557-32.533-85.338-32.533-117.895 0-32.533 32.557-32.533 85.338 0 117.895-46.02 0-83.36 37.335-83.36 83.36 0 46.02 37.335 83.36 83.36 83.36-32.533 32.557-32.533 85.338 0 117.894 32.557 32.534 85.338 32.534 117.895 0 0 46.021 37.334 83.36 83.36 83.36s83.36-37.334 83.36-83.36c32.557 32.534 85.333 32.534 117.894 0 32.534-32.556 32.534-85.337 0-117.894 46.021 0 83.332-37.335 83.332-83.36 0-46.02-37.31-83.36-83.332-83.36 32.534-32.557 32.534-85.338 0-117.895-32.561-32.533-85.337-32.533-117.894 0z"/><path d="M351.28 149.082v92.304l65.277-65.277c0-11.534 4.403-23.095 13.207-31.898 17.634-17.63 46.212-17.63 63.818 0 17.63 17.606 17.63 46.19 0 63.819-8.803 8.803-20.364 13.207-31.898 13.207l-65.277 65.277h92.304c8.167-8.168 19.443-13.23 31.92-13.23 24.91 0 45.105 20.219 45.105 45.127 0 24.909-20.196 45.128-45.104 45.128-12.478 0-23.754-5.058-31.921-13.23h-92.304l65.277 65.277c11.534 0 23.095 4.404 31.898 13.207 17.63 17.634 17.63 46.212 0 63.819-17.606 17.634-46.184 17.634-63.818 0-8.804-8.804-13.207-20.365-13.207-31.898l-65.278-65.277v92.303c8.168 8.167 13.23 19.444 13.23 31.921 0 24.909-20.223 45.105-45.127 45.105-24.909 0-45.128-20.196-45.128-45.105 0-12.477 5.058-23.754 13.23-31.92v-92.304l-65.277 65.277c0 11.533-4.404 23.094-13.207 31.898-17.634 17.634-46.212 17.634-63.818 0-17.634-17.611-17.634-46.19 0-63.819 8.803-8.803 20.364-13.207 31.897-13.207l65.277-65.277h-92.303c-8.167 8.167-19.443 13.23-31.921 13.23-24.908 0-45.104-20.22-45.104-45.128s20.196-45.128 45.104-45.128c12.478 0 23.754 5.063 31.921 13.23h92.303l-65.277-65.276c-11.533 0-23.094-4.4-31.897-13.207-17.634-17.634-17.634-46.213 0-63.819 17.61-17.63 46.184-17.63 63.818 0 8.803 8.803 13.207 20.364 13.207 31.898l65.277 65.277v-92.304c-8.167-8.167-13.23-19.443-13.23-31.92 0-24.909 20.22-45.105 45.128-45.105 24.904 0 45.128 20.196 45.128 45.104 0 12.478-5.063 23.754-13.23 31.921z" fill="#fff"/><path d="M34.795 318.898H603.94v284.1H34.795z"/><path d="M34.795 478.325H603.94v124.678H34.795z"/><path d="M94.448 345.25H548.93c18.62 0 33.828 15.208 33.828 33.829v114.103c-175.636-21.73-349.77-51.766-522.138-48.99V379.08c0-18.62 15.203-33.828 33.828-33.828z" fill="#3f3f3f"/><path fill="#fff" stroke="#000" stroke-width="2.35153003" d="M393.205 337.574l-52.542 253.774h-43.548l-52.57-253.774h43.552l30.79 148.637 30.77-148.637zM467.547 442.687h74.342v74.319c0 41.056-33.286 74.342-74.319 74.342-41.056 0-74.342-33.286-74.342-74.342V411.897h-.023c0-41.032 33.286-74.318 74.342-74.318s74.342 33.286 74.342 74.318h-43.552c0-16.998-13.796-30.766-30.79-30.766-16.998 0-30.766 13.773-30.766 30.766v105.109c0 16.998 13.772 30.79 30.766 30.79s30.79-13.797 30.79-30.767v-30.79h-30.79v-43.552zM117.66 464.459c-13.44-13.464-21.776-32.038-21.776-52.566 0-41.056 33.286-74.319 74.342-74.319 41.032 0 74.318 33.263 74.318 74.319h-43.529c0-16.994-13.796-30.79-30.79-30.79-16.998 0-30.789 13.796-30.789 30.79 0 8.499 3.436 16.17 8.995 21.753h.023a30.693 30.693 0 0 0 21.776 9.013v.023c20.528 0 39.102 8.313 52.543 21.777 13.464 13.44 21.776 32.037 21.776 52.542 0 41.056-33.286 74.342-74.319 74.342-41.056 0-74.342-33.286-74.342-74.342h43.548c0 17.022 13.796 30.79 30.79 30.79 16.998 0 30.79-13.773 30.79-30.79 0-8.476-3.437-16.17-9.014-21.753-5.577-5.554-13.277-9.018-21.776-9.018-20.528.005-39.102-8.33-52.566-21.771z"/></svg>';
    return [
      {
        filename: 'foo.txt',
        size: fooContent.length,
        strSize: humanStorageSize(fooContent.length),
        content: encoder.encode(fooContent),
      },
      {
        filename: 'image.svg',
        size: svgContent.length,
        strSize: humanStorageSize(svgContent.length),
        content: encoder.encode(svgContent),
      },
    ];
  })() as Attachment[],
  cvss: {
    AV: 'N',
    AC: 'L',
    PR: 'N',
    S: 'C',
    A: 'H',
    I: 'H',
    C: 'H',
    UI: 'N',
  },
} as ReportData);

const pgpKeySelectOptions = computed(() => props.pgpKeys.map((pgpKey) => ({ label: pgpKey.name, value: pgpKey.name })));

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
  return new Promise((resolve, reject) => {
    emit(
      'submit',
      submission,
      () => resolve(true),
      (message?: string) => reject(message || '')
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
        : Promise.reject('')
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
      const selectedPgpKey = props.pgpKeys.find((pgpKey) => pgpKey.name == form.summary.pgpKey);
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
      await sendReport(zip, message);
      return { zip, message };
    })
    .then(async ({ zip, message }) => {
      updateLastSubmissionLog({
        message: tr('submissionSendingReportSuccess'),
      });
      await logReportData(zip, message);
    })
    .then(() => {
      addSubmissionLog({
        icon: 'celebration',
        title: tr('submissionReportSentLabel'),
      });
    })
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
      void refreshCaptcha();
      submitting.value = false;
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
  });
}

watch(form, () => {
  resetSubmissionLogs();
});

const refreshCaptcha = async () => {
  if (props.captchaProvider) {
    providedCaptchaData.value = await props.captchaProvider();
  }
};
onMounted(async () => {
  await refreshCaptcha();
  if (props.pgpKeys.length == 1) {
    form.summary.pgpKey = props.pgpKeys[0].name;
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
