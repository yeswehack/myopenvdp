const render = (tpl: string, args: Record<string, string | number>): string =>
  tpl.replace(/\{\{\s*([a-zA-Z\._]+)\s*\}\}/g, (_a, n) => (n in args ? args[n as string | number].toString() : ''));

export { render };
