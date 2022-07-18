import { CvssMeta, ReportData } from './types';
import { TrProvider } from './i18n/tr';
import { format } from 'quasar';
import { renderTemplate } from '../utils';

const { humanStorageSize } = format;
export const defaultAllowedFileExtensions = ['jpg', 'jpeg', 'png', 'txt'];

export function getRequiredFieldsErrors(
  tr: TrProvider,
  report: ReportData,
  options?: { noCaptcha?: boolean }
): string[] {
  type FieldType = 'passthrough' | 'text' | 'checkbox' | 'cvss';
  type FieldValidator = {
    type: FieldType;
    field: string;
    valid: () => boolean;
  };
  const passthrough = {
    type: 'passthrough',
    field: 'passthrough',
    valid: () => true,
  } as FieldValidator;
  const textValidator = (model: string, field: string) =>
    ({
      type: 'text',
      field,
      valid: () => model && model.length > 0,
    } as FieldValidator);
  const checkboxValidator = (model: boolean, field: string) =>
    ({
      type: 'checkbox',
      field,
      valid: () => model,
    } as FieldValidator);
  const cvssValidator = (model: ReportData['cvss'], field: string) =>
    ({
      type: 'cvss',
      field,
      valid: () =>
        model &&
        [model.A, model.AC, model.AV, model.C, model.I, model.PR, model.S, model.UI].filter(
          (v: string) => v.length === 0
        ).length === 0,
    } as FieldValidator);
  const requiredFields: FieldValidator[] = [
    textValidator(report.summary.title, tr('reportTitleLabel')),
    textValidator(report.summary.pgpKey, tr('pgpKeyLabel')),
    textValidator(report.summary.product, tr('productLabel')),
    cvssValidator(report.cvss, tr('cvss3ScoreTitle')),
    textValidator(report.details.endpoint, tr('endpointLabel')),
    textValidator(report.details.part, tr('vulnerablePartLabel')),
    textValidator(report.details.partName, tr('partNameLabel')),
    textValidator(report.details.payload, tr('payloadLabel')),
    textValidator(report.details.env, tr('technicalEnvironmentLabel')),
    textValidator(report.details.report, tr('technicalDetailsLabel')),
    options?.noCaptcha ? passthrough : textValidator(report.captcha.value, tr('captchaLabel')),
    checkboxValidator(report.policyAccepted, tr('disclosurePolicyLabel')),
    checkboxValidator(report.intellectualPropertyAccepted, tr('intellectualPropertyLabel')),
  ];
  return requiredFields
    .filter((validator) => !validator.valid())
    .map((validator) => {
      switch (validator.type) {
        case 'passthrough':
          return '';
        case 'text':
          return tr('errorFieldIsEmpty', { field: validator.field });
        case 'checkbox':
          return tr('errorFieldIsNotAccepted', { field: validator.field });
        case 'cvss':
          return tr('errorCvssAreNotFilled', { field: validator.field });
      }
    });
}

export function checkFileExtension(filename: string, allowedExtensions: string[] = defaultAllowedFileExtensions) {
  const parts = filename.split('.');
  return parts.length > 1 && allowedExtensions.includes(parts[parts.length - 1].toLowerCase());
}

export function loadReportAttachments(
  tr: TrProvider,
  report: ReportData,
  files: FileList,
  attachmentMaxAllowedSize: number,
  attachmentAllowedExtensions: string[] = defaultAllowedFileExtensions
): string[] {
  const errors: string[] = [];
  for (const file of Array.from(files)) {
    if (file.size > attachmentMaxAllowedSize) {
      errors.push(
        tr('attachmentTooBigError', {
          file: file.name,
          size: humanStorageSize(file.size),
          maxSize: humanStorageSize(attachmentMaxAllowedSize),
        })
      );
      continue;
    }
    if (!checkFileExtension(file.name, attachmentAllowedExtensions)) {
      errors.push(
        tr('attachmentTypeError', {
          file: file.name,
        })
      );
      continue;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (ev) => {
      if (ev.target == null) {
        return;
      }
      report.attachments.push({
        filename: file.name,
        strSize: humanStorageSize(file.size),
        size: file.size,
        content: ev.target.result as ArrayBuffer,
      });
    });
    reader.readAsArrayBuffer(file);
  }
  return errors;
}

export function cvssToVector(cvssData: ReportData['cvss']) {
  const keys: (keyof ReportData['cvss'])[] = ['AV', 'AC', 'PR', 'UI', 'S', 'C', 'I', 'A'];
  const vector = ['CVSS:3.0'];
  for (const key of keys) {
    if (cvssData[key] === undefined) {
      return '';
    }
    vector.push(`${key}:${cvssData[key]}`);
  }
  return vector.join('/');
}

export function reportDataToJson(report: ReportData, cvssMeta: CvssMeta) {
  return {
    title: report.summary.title,
    product: report.summary.product,
    pgp_key: report.summary.pgpKey,
    description: report.details.report,
    technical_environment: report.details.env,
    end_point: report.details.endpoint,
    vulnerable_part: report.details.part,
    part_name: report.details.partName,
    application_finger_print: '',
    payload_sample: report.details.payload,
    name_hunter: report.profile.name,
    email_hunter: report.profile.mail,
    pgp_hunter: report.profile.pgp,
    cvss: {
      ...report.cvss,
      SCORE: cvssMeta.score,
    },
  };
}

export function reportDataToMarkdown(report: ReportData, cvssMeta: CvssMeta) {
  const template = `# {{summaryTitle}}

## Hunter contact

* Name: {{profileName}}
* Email: {{profileMail}}
* GPG:

\`\`\`
{{profilePgp}}
\`\`\`

## Vulnerability Summary

* Product:         {{summaryProduct}}
* CVSS:            {{cvssVector}} ({{cvssScore}})
* Endpoint:        {{detailsEndpoint}}
* Vulnerable part: {{detailsPart}}
* Part name:       {{detailsPartName}}
* Payload:         {{detailsPayload}}
* Tech. environ.:  {{detailsEnv}}

## Vulnerability Description

{{details}}

`;
  return renderTemplate(template, {
    summaryTitle: report.summary.title,
    profileName: report.profile.name,
    profileMail: report.profile.mail,
    profilePgp: report.profile.pgp,
    summaryProduct: report.summary.product,
    cvssVector: cvssMeta.vector,
    cvssScore: cvssMeta.score,
    detailsEndpoint: report.details.endpoint,
    detailsPart: report.details.part,
    detailsPartName: report.details.partName,
    detailsPayload: report.details.payload,
    detailsEnv: report.details.env,
    details: report.details.report,
  });
}
