type FlattenablePrimitive = string | number | boolean;
type FlattenableEntry<T> = T | Flattenable<T> | FlattenableEntry<T>[];
type Flattenable<T> = { [key: string]: FlattenableEntry<T> } | FlattenableEntry<T>[];
type Flattened<T> = { [key: string]: T };
const flattenKeys = <T extends FlattenablePrimitive>(
  object: Flattenable<T>,
  glue: string = '.',
  root: string = ''
): Flattened<T> => {
  return Object.entries(object).reduce((f, [key, value]) => {
    const entryKey = `${root}${key}`;
    if (typeof value == 'object') {
      f = Object.assign(f, flattenKeys(value, glue, `${entryKey}${glue}`));
    } else {
      f[entryKey] = value;
    }
    return f;
  }, {} as Flattened<T>);
};

export { flattenKeys };
