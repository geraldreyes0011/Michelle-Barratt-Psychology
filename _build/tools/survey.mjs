// Usage: node survey.mjs <pagesDir>
// Per page: data-mbp widgets, hero eyebrow, "More in" category, internal links and image count.
import { readdirSync, readFileSync } from 'node:fs';

const dir = process.argv[2];
const links = new Set();
for (const f of readdirSync(dir).sort()) {
  const { html } = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) links.add(m[1]);
  if (f.startsWith('blog__')) continue;
  const widgets = [...html.matchAll(/data-mbp="([\w-]+)"/g)].map(x => x[1]);
  const eyebrow = (html.match(/text-white\/85 mb-3">([^<]+)/) || [])[1] || '-';
  const more = (html.match(/More in <!-- -->([^<]+)/) || [])[1] || '-';
  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].length;
  console.log(f.replace('.json', '').padEnd(46), `widgets=[${widgets}]`.padEnd(30), `eyebrow=${eyebrow}`.padEnd(42), `moreIn=${more}`.padEnd(40), `imgs=${imgs}`);
}
console.log('\nINTERNAL LINK TARGETS:\n' + [...links].sort().join('\n'));
