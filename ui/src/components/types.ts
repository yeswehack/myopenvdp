export type Attachment = {
  filename: string;
  strSize: string;
  size: number;
  content: ArrayBuffer;
};

export type Cvss = {
  AV: string;
  AC: string;
  PR: string;
  S: string;
  A: string;
  I: string;
  C: string;
  UI: string;
};

export type ReportData = {
  policyAccepted: boolean;
  intellectualPropertyAccepted: boolean;
  captcha: {
    key: string;
    value: string;
  };
  summary: {
    title: string;
    pgpKey: string;
    product: string;
  };
  profile: {
    name: string;
    mail: string;
    pgp: string;
  };
  details: {
    endpoint: string;
    part: string;
    partName: string;
    payload: string;
    env: string;
    report: string;
  };
  attachments: Attachment[];
  cvss: Cvss;
};

export type CvssMeta = {
  vector: string;
  score: number;
};

export type Submission = {
  report: {
    title: string;
    product: string;
    cvss: Cvss;
    cvss_score: number;
    pgp_data: string;
    hash_algorithm: string;
    digest_hex: string;
  };
};

export type SubmissionLog = {
  date?: Date;
  icon?: string;
  title?: string;
  message?: string;
  details?: string;
  links?: SubmissionLogLink[];
};

export type SubmissionLogLink = {
  label: string;
  url: string;
  download?: string;
  suffix?: string;
};
