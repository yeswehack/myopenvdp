export type Report = {
  title: string;
  product: string;
  cvss_score: number;
  cvss: {
    AV: string;
    AC: string;
    PR: string;
    S: string;
    A: string;
    I: string;
    C: string;
    UI: string;
  };
  pgp_data: string;
  hash_algorithm: string;
  digest_hex: string;
};
