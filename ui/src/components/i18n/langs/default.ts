import { VdpFormTranslation } from '../types';

const defaultFormTranslations: VdpFormTranslation = {
  vulnerabilitySummaryTitle: 'Vulnerability Summary',
  reportTitleLabel: 'Report title',
  reportTitlePlaceholder: 'Write your report title',
  productLabel: 'Product/website concerned',
  productPlaceholder: 'Enter the product name or reference',
  pgpKeyLabel: 'PGP Key',
  pgpKeyPlaceholder: 'Select PGP Key',
  cvss3ScoreTitle: 'CVSS3 Score',
  cvss3SeverityLabel: 'Severity',
  cvss3AttackVectorLabel: 'Attack Vector',
  cvss3UserInteractionLabel: 'User Interaction',
  cvss3AttackComplexityLabel: 'Attack Complexity',
  cvss3ConfidentialityLabel: 'Confidentiality',
  cvss3PrivilegesRequiredLabel: 'Privileges Required',
  cvss3IntegrityLabel: 'Integrity',
  cvss3ScopeLabel: 'Scope',
  cvss3AvailabilityLabel: 'Availability',
  cvss3NetworkLabel: 'Network',
  cvss3AdjacentLabel: 'Adjacent',
  cvss3LocalLabel: 'Local',
  cvss3PhysicalLabel: 'Physical',
  cvss3NoneLabel: 'None',
  cvss3LowLabel: 'Low',
  cvss3HighLabel: 'High',
  cvss3RequiredLabel: 'Required',
  cvss3ChangedLabel: 'Changed',
  cvss3UnchangedLabel: 'Unchanged',
  reporterInformationTitle: ' Reporter information',
  reporterNameLabel: 'Your name',
  reporterNamePlaceholder: 'Enter your name',
  reporterEmailLabel: 'Your Mail',
  reporterEmailPlaceholder: 'Enter an email address',
  reporterPgpKeyLabel: 'Your PGP public key',
  technicalDetailsTitle: 'Technical details',
  endpointLabel: 'Endpoint',
  endpointPlaceholder: 'Enter an endpoint',
  vulnerablePartLabel: 'Vulnerable part',
  vulnerablePartPlaceholder: 'Select a vulnerable part',
  partNameLabel: 'Part name',
  partNamePlaceholder: 'Enter a part name',
  payloadLabel: 'Payload',
  payloadPlaceholder: 'Enter a payload',
  technicalEnvironmentLabel: 'Technical environment',
  technicalEnvironmentPlaceholder: 'OS, Browser, Tools, Version...',
  technicalDetailsLabel: 'Technical details',
  technicalDetailsMarkdown: 'using {{markdown}} language',
  technicalDetailsEdit: 'Edit',
  technicalDetailsPreview: 'Preview',
  attachmentsPlaceholder: 'Drop or select {{extensions}} files ({{maxSize}}/file)',
  attachmentsErrorsTitle: 'Attachments errors',
  attachmentTooBigError: '<b>{{file}}:</b> Attachment size ({{size}}) should not exceed {{maxSize}}.',
  attachmentTypeError: '<b>{{file}}:</b> File type is not allowed.',
  captchaLabel: 'Captcha',
  captchaPlaceholder: 'Enter the captcha',
  disclosurePolicyCheckbox: 'I agree with {{disclosurePolicy}}',
  disclosurePolicyLabel: 'Disclosure policy',
  disclosurePolicyHtml:
    '<div>\n' +
    '<ul>\n' +
    '<li>As a vulnerability report submitter, I will give the recipient <strong>reasonable time</strong> to investigate and mitigate an issue I report.</li>\n' +
    '<li>While the recipient investigates, <strong>I refrain from discussing</strong> my discovery in any way with a third party (e.g. fellow researchers, colleagues, companies, governments).</li>\n' +
    '<li>Acting in good faith, <strong>I make an effort to avoid privacy violations and disruptions to others</strong>, including but not limited to destruction of data and interruption or degradation of any services.</li>\n' +
    '<li><strong>I do not exploit a security issue</strong> I discover for any reason. (This includes demonstrating additional risk, such as attempted compromise of sensitive company data or probing for additional issues.)</li>\n' +
    '</ul>\n' +
    '</div>',
  disclosurePolicyAcceptLabel: 'Yes, I accept',
  disclosurePolicyRefuseLabel: 'No, I refuse',
  intellectualPropertyLabel: 'Intellectual property',
  intellectualPropertyCheckbox:
    'By submitting a report, security researcher warrants that the ' +
    'report and any attachments do not violate the intellectual ' +
    'property rights of any third party and the security researcher ' +
    'assigns free of charge to the receiving company who accepts all ' +
    'intellectual property rights.',
  encryptedBeforeSubmission: 'This will be encrypted before submission',
  sendReportLabel: 'Send report',
  maxChars: '{{max}} char maximum',
  valueMustNotBeBlank: 'This value should not be blank.',
  notificationDismissLabel: 'Dismiss',
  formErrorsTitle: 'Form validation errors',
  formInvalidMessage: 'The form is invalid.',
  errorFieldIsEmpty: '<b>{{field}}</b> is empty.',
  errorFieldIsNotAccepted: '<b>{{field}}</b> is not accepted.',
  errorCvssAreNotFilled: '<b>{{field}}</b> metrics are not all filled.',
  unexpectedError: 'Unexpected error: {{message}}',
  submissionCompressingReportLabel: 'Compressing report...',
  submissionCompressingReportError: 'Unable to compress report',
  submissionCompressingReportSuccess: 'Report compressed.',
  submissionEncryptingReportLabel: 'Encrypting report with PGP key...',
  submissionEncryptingReportSuccess: 'Encrypted report ready.',
  submissionSendingReportLabel: 'Sending report...',
  submissionSendingReportSuccess: 'Report successfully sent.',
  submissionSendingReportTooBigError:
    'Report total size {{size}} exceeds {{maxSize}}, try compress or remove attachments.',
  submissionReportDownloadLabel: 'Downloads',
  submissionReportDownloadMessage: 'You can download your own copy of the report here',
  submissionReportSentLabel: 'Report sent!',
};

export default defaultFormTranslations;
