export function randomId(): string {
  const id = (Math.random() * 0xffffffff).toFixed(0);
  return `id-${id}`;
}

export const renderTemplate = (tpl: string, args: Record<string, string | number>): string =>
  tpl.replace(/\{\{([a-zA-Z]+)\}\}/g, (a, n) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    n in args ? args[n].toString() : ''
  );

type UnpackedArray<T> = T extends (infer U)[] ? U : never;
export function copy<T extends (U[] | Date | object | unknown), U = UnpackedArray<T>>(obj: T): T {
  return Array.isArray(obj)
    ? (obj as U[]).map(item => copy(item)) as T
    : obj instanceof Date
      ? new Date(obj.getTime()) as T
      : obj && typeof obj === 'object'
        ? Object.getOwnPropertyNames(obj).reduce((o: { [key: string]: unknown }, prop: string) => {
          const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
          if (descriptor) {
            Object.defineProperty(o, prop, descriptor);
            o[prop] = copy((obj as { [key: string]: unknown })[prop]) as T;
          }
          return o;
        }, Object.create(Object.getPrototypeOf(obj) as object) as { [key: string]: unknown }) as T
      : obj;
}
