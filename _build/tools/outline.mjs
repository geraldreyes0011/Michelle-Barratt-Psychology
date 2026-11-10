// Usage: node outline.mjs <page.json> [...]
// Prints the heading/paragraph/list/image outline of a page's HTML for review against its source.
import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

for (const file of process.argv.slice(2)) {
  const { html } = JSON.parse(readFileSync(file, 'utf8'));
  const $ = cheerio.load(html);
  console.log(`\n######## ${file.split(/[\\/]/).pop()}`);
  $('h1, h2, h3, p, li, img, a.inline-flex[target]').each((_, el) => {
    const tag = el.tagName.toUpperCase();
    if (tag === 'IMG') return console.log(`  IMG ${$(el).attr('src')}`);
    if (tag === 'P' && $(el).closest('li').length) return;
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    const links = $(el).find('a').map((_, a) => $(a).attr('href')).get();
    console.log(`  ${tag.padEnd(3)} ${t.slice(0, 110)}${t.length > 110 ? '…' : ''}${links.length ? `  [${links.join(', ')}]` : ''}${tag === 'A' ? ` -> ${$(el).attr('href')}` : ''}`);
  });
}
