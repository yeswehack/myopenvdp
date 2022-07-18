declare class MarkdownIt {
  constructor();
  render(value: string): string;
}
declare module 'markdown-it' {
  export = MarkdownIt;
}
