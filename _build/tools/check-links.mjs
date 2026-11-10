// Usage: node check-links.mjs <projectRoot>
// Verifies that every internal link (page HTML, footer, menus, Helpful Info data) resolves to a
// route with content, and that every Therapy Services menu topic has a page file.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
const pagesDir = join(root, 'src/data/pages');
const keys = new Set(readdirSync(pagesDir).map((f) => f.replace('.json', '')));
const ref = JSON.parse(readFileSync(join(root, 'src/data/reference.json'), 'utf8'));
const { therapyMenu, allTopicSlugs } = await import(pathToFileURL(join(root, 'src/data/therapyMenu.js')).href);

const STATIC = { '/': 'home', '/contact': 'contact', '/faq': 'faq', '/locations': 'locations', '/online-therapy': 'online-therapy', '/practitioners': 'practitioners', '/topics': 'topics', '/blog': 'blog', '/therapy-services': 'therapy-services' };
const categoryIds = new Set(therapyMenu.map((c) => c.id));

function resolves(href) {
  const [path, hash] = href.split('#');
  const p = path.replace(/\/+$/, '') || '/';
  if (p === '/therapy-services' && hash) return categoryIds.has(hash);
  if (STATIC[p]) return keys.has(STATIC[p]);
  if (p === '/helpful-info') return true;
  let m;
  if ((m = p.match(/^\/helpful-info\/([^/]+)$/))) return Boolean(ref.helpfulInfoPages[m[1]]);
  if ((m = p.match(/^\/blog\/([^/]+)$/))) return keys.has(`blog__${m[1]}`);
  if ((m = p.match(/^\/therapy-services\/([^/]+)$/))) return keys.has(`therapy-services__${m[1]}`);
  return false;
}

const sources = [];
for (const k of keys) sources.push([k, JSON.parse(readFileSync(join(pagesDir, `${k}.json`), 'utf8')).html]);
sources.push(['footer', ref.footerHtml]);
const links = [];
for (const [where, html] of sources) for (const m of html.matchAll(/href="(\/[^"]*)"/g)) links.push([where, m[1]]);
for (const c of therapyMenu) {
  links.push(['menu', `/therapy-services#${c.id}`]);
  for (const l of [...c.links, ...(c.subgroup?.links ?? [])]) links.push(['menu', l.to]);
}
for (const [, to] of ref.topLinks) links.push(['top-nav', to]);
for (const g of ref.helpfulInfoGroups) for (const [, to] of g.links) links.push(['helpful-info-menu', to]);
for (const g of ref.legacyTherapyMenu) for (const [, to] of g.links) links.push(['home-services', to]);

const broken = links.filter(([, href]) => !/\.\w{2,4}$/.test(href) && !resolves(href));
const missingTopics = allTopicSlugs().filter((s) => !keys.has(`therapy-services__${s}`));
console.log(`${links.length} internal links checked, ${new Set(links.map((l) => l[1])).size} unique targets`);
console.log(broken.length ? `BROKEN:\n${broken.map(([w, h]) => `  ${h}  (in ${w})`).join('\n')}` : 'No broken internal links.');
console.log(missingTopics.length ? `Menu topics without a page: ${missingTopics.join(', ')}` : `All ${allTopicSlugs().length} menu topics have a page.`);
