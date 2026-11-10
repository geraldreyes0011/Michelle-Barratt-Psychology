// Usage: node collect-images.mjs <projectRoot>
// Lists every remote image the site uses (page HTML, footer, reference data maps, hero maps)
// and writes _build/images/manifest.json: [{ url, pages: [...] }].
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
const found = new Map();
const add = (url, where) => {
  if (!url || !/^https:\/\//.test(url) || !/\.(jpe?g|png|webp|gif)(\?|$)/i.test(url)) return;
  url = url.replace(/&amp;/g, '&');
  if (!found.has(url)) found.set(url, new Set());
  found.get(url).add(where);
};
const scan = (text, where) => {
  for (const m of text.matchAll(/https:\/\/[^"'\s)`]+?\.(?:jpe?g|png|webp|gif)/gi)) add(m[0], where);
};

const pagesDir = join(root, 'src/data/pages');
for (const f of readdirSync(pagesDir)) scan(readFileSync(join(pagesDir, f), 'utf8'), f.replace('.json', ''));
scan(readFileSync(join(root, 'src/data/reference.json'), 'utf8'), 'reference-data');
scan(readFileSync(join(root, 'src/data/generatedHeroImages.json'), 'utf8'), 'topic-heroes');
scan(readFileSync(join(root, 'src/data/site.js'), 'utf8'), 'site');

mkdirSync(join(root, '_build/images'), { recursive: true });
const list = [...found].map(([url, w]) => ({ url, pages: [...w].sort() })).sort((a, b) => a.url.localeCompare(b.url));
writeFileSync(join(root, '_build/images/manifest.json'), JSON.stringify(list, null, 2));
const hosts = {};
for (const { url } of list) hosts[new URL(url).host] = (hosts[new URL(url).host] ?? 0) + 1;
console.log(`${list.length} images`, hosts);
