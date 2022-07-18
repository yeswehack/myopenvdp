/*
 * Export files list for /pages folder
 */

function kebabCase(str: string) {
  const result = str.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, (match) => '-' + match.toLowerCase());
  return str[0] === str[0].toUpperCase() ? result.substring(1) : result;
}

function slugify(str: string) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'));
}
export default Object.keys(import.meta.glob('../pages/*.vue'))
  .map((page) => page.slice('../pages/'.length).replace('.vue', ''))
  .filter((page) => !page.endsWith('IndexPage') && !page.endsWith('ErrorNotFound'))
  .map((page) => ({
    file: `../pages/${page}`,
    title: `${page}.vue`,
    path: slugify(kebabCase(page)),
  })) as { file: string; title: string; path: string }[];
