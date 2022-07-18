export function randomId(): string {
  const id = (Math.random() * 0xffffffff).toFixed(0);
  return `id-${id}`;
}

export const renderTemplate = (tpl: string, args: Record<string, string | number>): string =>
  tpl.replace(/\{\{([a-zA-Z]+)\}\}/g, (a, n) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    n in args ? args[n].toString() : ''
  );
