// Usage: node _build/tools/build-adhd-children.mjs
// Builds src/data/pages/therapy-services__adhd-therapy-children.json from the reviewed document
// (_build/source-data/reviewed-docs/adhd-therapy-children.txt), following the PDF's heading hierarchy:
//   "# id | Heading"         section heading (the PDF's large capitals, e.g. OUR APPROACH)     -> h2
//   "## [id |] Heading"      sub-heading (the PDF's second level)                              -> h3 (large)
//   "### [id |] Heading"     minor heading (e.g. Clinically informed support)                  -> h3 (small)
//   "#### Title" + one line  box (the PDF's bold item headings)                                -> card
//   "- item", "**paragraph", "[toc]", "[photo key]" (photo beside the heading(s) above it and the text
//   that follows, up to the next heading or boxes), "[contact id] text" (centred contact line + button)
// The hero, related topics and closing call to action are kept from the current page.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(root, '_build/source-data/reviewed-docs/adhd-therapy-children.txt');
const OUT = join(root, 'src/data/pages/therapy-services__adhd-therapy-children.json');
const WP = '/images/wp';
const ST = '/images/stock';
const PHOTOS = {
  understanding: [`${ST}/pexels-7352869.webp`, 'A boy concentrating on his homework at home'],
  'our-approach': [`${WP}/2026/03/vitaly-gariev-U8A4mHyO5HM-unsplash.webp`, 'A teenager talking with a practitioner in a calm counselling room'],
  'how-we-help': [`${WP}/2025/12/pexels-tima-miroshnichenko-5336930.webp`, 'Parents and their daughter meeting with a practitioner'],
  'for-parents': [`${WP}/2026/02/22810.webp`, 'A practitioner talking warmly with a young girl'],
  'practical-strategies': [`${WP}/2026/04/birlesim-ozel-egitim-rehabilitasyon-merkezi-sjSOXEV_kmY-unsplash.webp`, 'Adults supporting a child with an activity at a learning table'],
  'family-support': [`${WP}/2026/02/getty-images-NCXprZ_kcWQ-unsplash.webp`, 'A family relaxing together on the couch at home'],
  'supporting-parents': [`${ST}/pexels-5303547.webp`, 'A mother working through schoolwork with her young son at a desk'],
  'accessing-support': [`${ST}/pexels-8653978.webp`, 'A practitioner spending time with children during a play-based session'],
};

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const BTN = 'inline-flex items-center justify-center min-h-12 px-7 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300';
const CONTACT_BTN = `<a class="${BTN} btn-black-yellow " href="/contact">Contact Us</a>`;
const CHEVRON_DOWN = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-chevron" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>';
const P = (t, extra = '') => `<p class="max-w-3xl text-[17px] leading-[1.75] text-ink/90 mb-5${extra}">${esc(t)}</p>`;
const UL = (items) => `<ul class="max-w-3xl space-y-2.5 my-6">${items.map((i) => `<li class="flex gap-3 text-[17px] leading-relaxed text-ink/90"><span class="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true"></span><span>${esc(i)}</span></li>`).join('')}</ul>`;
const CARDS = (cards) => `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-8 support-cards">${cards.map((c) => `<div class="bg-white/70 rounded border border-lilac p-6"><span class="block h-2.5 w-2.5 rounded-full bg-ocean mb-4" aria-hidden="true"></span><h3 class="text-xl font-semibold mb-2">${esc(c.title)}</h3><p class="text-[15px] leading-relaxed text-ink/85">${esc(c.text)}</p></div>`).join('')}</div>`;
const H2 = (t) => `<div class="mb-10 max-w-3xl"><h2 class="text-3xl md:text-4xl font-semibold">${esc(t)}</h2><div class="h-[3px] w-14 bg-sun mt-5" aria-hidden="true"></div></div>`;
const idAttr = (id) => (id ? ` id="${id}"` : '');
const SUB = (t, id, first) => `<h3${idAttr(id)} class="svc-sub font-semibold ${first ? '' : 'mt-8 '}mb-3">${esc(t)}</h3>`;
const MINOR = (t, id) => `<h3${idAttr(id)} class="svc-minor font-semibold mt-8 mb-3">${esc(t)}</h3>`;
const TOC = (sections) => `<nav class="toc" aria-labelledby="toc-title"><button type="button" class="toc-toggle" data-toc-toggle aria-expanded="false" aria-controls="toc-list"><span id="toc-title" class="toc-title">On This Page</span>${CHEVRON_DOWN}</button><ol id="toc-list" class="toc-list">${sections.map((s) => `<li><a class="toc-link" href="#${s.id}"><span class="toc-dot h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true"></span><span>${esc(s.heading)}</span></a></li>`).join('')}</ol></nav>`;
const IMG = ([src, alt]) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" class="photo-fill-img w-full object-cover rounded-lg border border-lilac"/>`;
const CONTACT = (id, text) => `<div${idAttr(id)} class="mx-auto max-w-3xl text-center mt-10"><p class="text-[17px] leading-[1.75] text-ink/90 mb-5">${esc(text)}</p><div class="mt-6 flex flex-wrap justify-center gap-3">${CONTACT_BTN}</div></div>`;
const splitId = (s) => { const m = /^([a-z0-9-]+) \| (.+)$/.exec(s); return m ? [m[1], m[2]] : [null, s]; };

// ---------------------------------------------------------------- parse into sections of items
const meta = {};
const sections = [];
for (const raw of readFileSync(SRC, 'utf8').split(/\r?\n/)) {
  const l = raw.trim();
  if (!l) continue;
  const m = /^@([a-z-]+)\s+(.*)$/.exec(l);
  if (m) { meta[m[1]] = m[2]; continue; }
  if (l.startsWith('# ')) { const [id, heading] = splitId(l.slice(2)); sections.push({ id, heading, items: [] }); continue; }
  sections.at(-1).items.push(l);
}

// ---------------------------------------------------------------- render
const usedPhotos = new Set();
function renderSection(s) {
  const out = [];
  const items = s.items;
  let pendingHead = [H2(s.heading)]; // headings not yet written (a photo marker pulls them beside the photo)
  const flushHead = () => { out.push(...pendingHead); pendingHead = []; };
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.startsWith('## ')) {
      const [id, t] = splitId(it.slice(3));
      const first = pendingHead.length > 0;
      if (!items[i + 1]?.startsWith('[photo')) flushHead();
      pendingHead.push(SUB(t, id, first));
      if (!items[i + 1]?.startsWith('[photo')) flushHead();
      continue;
    }
    if (it.startsWith('[photo ')) {
      const key = it.slice(7, -1);
      const photo = PHOTOS[key];
      if (!photo) throw new Error(`unknown photo ${key}`);
      usedPhotos.add(key);
      // text beside the photo: following paragraphs, lists and minor headings up to the next sub-heading,
      // boxes, contents or contact block
      const lead = [];
      while (i + 1 < items.length && !/^(## |#### |\[toc\]|\[contact|\[photo)/.test(items[i + 1])) {
        const nx = items[++i];
        if (nx.startsWith('- ')) { const list = [nx.slice(2)]; while (items[i + 1]?.startsWith('- ')) list.push(items[++i].slice(2)); lead.push(UL(list)); } else if (nx.startsWith('### ')) { const [id, t] = splitId(nx.slice(4)); lead.push(MINOR(t, id)); } else if (nx.startsWith('**')) lead.push(P(nx.slice(2), ' font-semibold')); else lead.push(P(nx));
      }
      out.push(`<div class="grid gap-10 photo-fill"><div class="min-w-0 photo-fill-text">${pendingHead.join('')}${lead.join('')}</div>${IMG(photo)}</div>`);
      pendingHead = [];
      continue;
    }
    flushHead();
    if (it === '[toc]') { out.push(TOC(sections)); continue; }
    if (it.startsWith('[contact ')) { const m = /^\[contact ([a-z0-9-]+)\] (.+)$/.exec(it); out.push(CONTACT(m[1], m[2])); continue; }
    if (it.startsWith('### ')) { const [id, t] = splitId(it.slice(4)); out.push(MINOR(t, id)); continue; }
    if (it.startsWith('#### ')) {
      const cards = [];
      while (items[i]?.startsWith('#### ')) { cards.push({ title: items[i].slice(5), text: items[i + 1] }); i += 2; }
      i--;
      out.push(CARDS(cards));
      continue;
    }
    if (it.startsWith('- ')) { const list = []; while (items[i]?.startsWith('- ')) list.push(items[i++].slice(2)); i--; out.push(UL(list)); continue; }
    if (it.startsWith('**')) { out.push(P(it.slice(2), ' font-semibold')); continue; }
    out.push(P(it));
  }
  flushHead();
  return out.join('');
}

const current = JSON.parse(readFileSync(OUT, 'utf8'));
const hero = current.html.slice(0, current.html.indexOf('</section>') + 10);
const tail = current.html.slice(current.html.indexOf('<div data-mbp="related"></div>'));
const body = sections.map((s, n) => `<section id="${s.id}" class="${n % 2 ? 'bg-soft' : 'bg-white'} "><div class="mx-auto max-w-7xl px-5 py-14 md:py-20 ">${renderSection(s)}</div></section>`).join('');
for (const k of Object.keys(PHOTOS)) if (!usedPhotos.has(k)) throw new Error(`photo ${k} not placed`);
writeFileSync(OUT, JSON.stringify({ generated: false, title: meta['meta-title'], description: current.description, html: hero + body + tail }, null, 2));
console.log('sections', sections.length, 'photos', usedPhotos.size);
