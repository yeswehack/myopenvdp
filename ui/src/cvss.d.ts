declare module 'cvss' {
  export interface CVSS {
    getScore(v: string | Record<string, string | undefined>): number;
    getRating(v: number): string;
  }
  const cvss: CVSS;
  export default cvss;
}
