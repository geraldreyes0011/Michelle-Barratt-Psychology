// Usage: node _build/tools/build-service-pages.mjs [slug ...] [--dry]
// Builds Therapy Services pages from the reviewed source documents (Google Docs "reviewed by Mary",
// exported to PDF and converted to _build/source-data/reviewed-docs/<slug>.svc), using the layout of
// the ADHD Therapy - Children & Adolescents page:
//   hero (title, Contact Us / See Practitioners) -> sections with "On This Page" contents under the first
//   -> photos beside chosen sections -> boxes for card runs -> centred closing "Contact Us" section
//   -> references -> related topics + standard closing call to action.
// Writes src/data/pages/therapy-services__<slug>.json (generated:false, so build-topics keeps it).
//
// .svc format: "@title", "@meta-title", "@meta-description", "## id | eyebrow | heading | toc label",
// paragraphs, "- " bullets, "### Title" + one paragraph (box), "#### Title" (sub-heading),
// "Contact Us" (button), "@references" + "- " entries.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const srcDir = join(root, '_build/source-data/reviewed-docs');
const pagesDir = join(root, 'src/data/pages');
const { primaryCategory } = await import(pathToFileURL(join(root, 'src/data/therapyMenu.js')).href);
const { PAGES } = await import(pathToFileURL(join(srcDir, 'pages.mjs')).href);

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const BTN = 'inline-flex items-center justify-center min-h-12 px-7 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300';
const CONTACT_BTN = `<a class="${BTN} btn-black-yellow " href="/contact">Contact Us</a>`;
const CHEVRON_RIGHT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg>';
const CHEVRON_DOWN = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-chevron" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>';

// Inline text: escaped, with the practice phone number and "online contact form" linked, and crisis
// notices in the site's crisis style.
function inline(text) {
  let h = esc(text);
  h = h.replace(/\(07\) 3185 0040/g, '<a class="text-ocean underline underline-offset-4 font-medium" href="tel:0731850040">(07) 3185 0040</a>');
  h = h.replace(/online contact form/g, '<a class="text-ocean underline underline-offset-4 font-medium" href="/contact">online contact form</a>');
  return h;
}
const isCrisis = (t) => /^\(If (you|you or your teenager) are ever in immediate danger/.test(t);
const pHtml = (t) => (isCrisis(t)
  ? `<p class="max-w-3xl text-[17px] leading-[1.75] text-ink/90 mb-5"><span class="crisis-note">${inline(t)}</span></p>`
  : `<p class="max-w-3xl text-[17px] leading-[1.75] text-ink/90 mb-5">${inline(t)}</p>`);
const ulHtml = (items) => `<ul class="max-w-3xl space-y-2.5 my-6">${items.map((i) => `<li class="flex gap-3 text-[17px] leading-relaxed text-ink/90"><span class="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true"></span><span>${inline(i)}</span></li>`).join('')}</ul>`;
const cardsHtml = (cards) => `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-8 support-cards">${cards.map((c) => `<div class="bg-white/70 rounded border border-lilac p-6"><span class="block h-2.5 w-2.5 rounded-full bg-ocean mb-4" aria-hidden="true"></span><h3 class="text-xl font-semibold mb-2">${esc(c.title)}</h3><p class="text-[15px] leading-relaxed text-ink/85">${inline(c.text)}</p></div>`).join('')}</div>`;
const h3Html = (t) => `<h3 class="text-2xl font-semibold mt-8 mb-3">${esc(t)}</h3>`;
const h2Html = (s) => `<div class="mb-10 max-w-3xl">${s.eyebrow ? `<p class="text-[12px] font-semibold uppercase tracking-[0.2em] mb-2.5 text-rose">${esc(s.eyebrow)}</p>` : ''}<h2 class="text-3xl md:text-4xl font-semibold">${esc(s.heading)}</h2><div class="h-[3px] w-14 bg-sun mt-5" aria-hidden="true"></div></div>`;
const buttonHtml = () => `<div class="mt-6 flex flex-wrap gap-3">${CONTACT_BTN}</div>`;
const tocHtml = (sections) => `<nav class="toc" aria-labelledby="toc-title"><button type="button" class="toc-toggle" data-toc-toggle aria-expanded="false" aria-controls="toc-list"><span id="toc-title" class="toc-title">On This Page</span>${CHEVRON_DOWN}</button><ol id="toc-list" class="toc-list">${sections.map((s) => `<li><a class="toc-link" href="#${s.id}"><span class="toc-dot h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true"></span><span>${esc(s.toc)}</span></a></li>`).join('')}</ol></nav>`;
const photoHtml = ([src, alt, pos]) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" class="photo-fill-img w-full object-cover rounded-lg border border-lilac"${pos ? ` style="object-position:${pos}"` : ''}/>`;

function heroHtml(title, eyebrow) {
  return '<section class="bg-gradient-to-br from-plum to-rose text-white"><div class="mx-auto max-w-7xl px-5 py-14 md:py-20"><div>'
    + '<nav aria-label="Breadcrumb" class="mb-6"><ol class="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-white/75">'
    + `<li><a class="hover:text-white" href="/">Home</a></li><li aria-hidden="true">${CHEVRON_RIGHT}</li>`
    + `<li><a class="hover:text-white" href="/therapy-services">Therapy Services</a></li><li aria-hidden="true">${CHEVRON_RIGHT}</li>`
    + `<li class="text-white" aria-current="page">${esc(title)}</li></ol></nav>`
    + `<p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 mb-3">${esc(eyebrow)}</p>`
    + `<h1 class="text-white text-[32px] md:text-[44px] font-semibold leading-[1.08] max-w-3xl">${esc(title)}</h1>`
    + '<div class="h-[3px] w-16 bg-sun my-5" aria-hidden="true"></div>'
    + `<div class="mt-6 flex flex-wrap gap-3">${CONTACT_BTN}<a class="${BTN} border border-white/70 text-white hover:bg-white/10 " href="/practitioners">See Practitioners</a></div>`
    + '</div></div></section>';
}

// The closing call to action shared by every Therapy Services page (from the ADHD reference page).
const ctaHtml = (() => {
  const { html } = JSON.parse(readFileSync(join(pagesDir, 'therapy-services__adhd-therapy-children.json'), 'utf8'));
  const i = html.indexOf('<section class="bg-blush">');
  return html.slice(i, html.indexOf('</section>', i) + 10);
})();

// ---------------------------------------------------------------- parse
function parse(text) {
  const meta = {};
  const sections = [];
  const refs = [];
  let inRefs = false;
  for (const line of text.split(/\r?\n/)) {
    const l = line.trim();
    if (!l) continue;
    const m = /^@([a-z-]+)\s*(.*)$/.exec(l);
    if (m) {
      if (m[1] === 'references') inRefs = true;
      else if (m[1] !== 'intro') meta[m[1]] = m[2];
      continue;
    }
    if (inRefs) { refs.push(l.replace(/^- /, '')); continue; }
    if (l.startsWith('## ')) {
      const [id, eyebrow, heading, toc] = l.slice(3).split('|').map((s) => s.trim());
      // Contents entries show the section heading only (as on the Child & Adolescent Therapy page).
      sections.push({ id, eyebrow, heading, toc: heading, items: [] });
      continue;
    }
    sections.at(-1).items.push(l);
  }
  return { meta, sections, refs };
}

// Items -> blocks: p, ul, cards, h3, button.
function blocksOf(items) {
  const out = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it === 'Contact Us') { out.push({ t: 'button' }); continue; }
    if (it.startsWith('- ')) {
      const list = [];
      while (items[i]?.startsWith('- ')) list.push(items[i++].slice(2));
      i--;
      // "Label: description" bullets (e.g. Why Clients Choose MBP) are boxes, as on the ADHD page
      const labelled = list.map((x) => /^([A-Z][^:]{2,70}):\s+(.+)$/.exec(x));
      if (list.length >= 3 && labelled.every(Boolean)) out.push({ t: 'cards', cards: labelled.map((x) => ({ title: x[1], text: x[2] })) });
      else out.push({ t: 'ul', items: list });
      continue;
    }
    if (it.startsWith('### ')) {
      const cards = [];
      while (items[i]?.startsWith('### ')) { cards.push({ title: items[i].slice(4), text: items[i + 1] }); i += 2; }
      i--;
      out.push({ t: 'cards', cards });
      continue;
    }
    if (it.startsWith('#### ')) { out.push({ t: 'h3', text: it.slice(5) }); continue; }
    out.push({ t: 'p', text: it });
  }
  return out;
}
const textLen = (b) => (b.t === 'p' ? b.text.length : b.t === 'ul' ? b.items.join(' ').length : 0);
const render = (b) => (b.t === 'p' ? pHtml(b.text) : b.t === 'ul' ? ulHtml(b.items) : b.t === 'cards' ? cardsHtml(b.cards) : b.t === 'h3' ? h3Html(b.text) : buttonHtml());

// Text beside a photo: the whole section up to its first boxes or sub-heading, as on the Child &
// Adolescent Therapy page (a section's text is never split between beside-photo and full width).
function splitLead(blocks) {
  for (let k = 1; k < blocks.length; k++) {
    if (blocks[k].t === 'cards' || blocks[k].t === 'h3' || blocks[k].t === 'button') return [blocks.slice(0, k), blocks.slice(k)];
  }
  return [blocks, []];
}

// ---------------------------------------------------------------- build
function build(slug, cfg, { dry }) {
  const file = join(srcDir, `${cfg.source ?? slug}.svc`);
  const { meta, sections, refs } = parse(readFileSync(file, 'utf8'));
  const title = cfg.title ?? meta.title;
  const category = primaryCategory(slug);
  if (!category) throw new Error(`${slug}: not in the Therapy Services menu`);
  // Photo keys are section ids or unambiguous prefixes of them.
  const photos = {};
  for (const [key, photo] of Object.entries(cfg.photos ?? {})) {
    const hits = sections.filter((s) => s.id === key || s.id.startsWith(key));
    if (hits.length !== 1) throw new Error(`${slug}: photo key "${key}" matches ${hits.length} sections`);
    photos[hits[0].id] = photo;
  }
  const last = sections.at(-1);

  const body = sections.map((s, n) => {
    let blocks = blocksOf(s.items);
    if (s === last && !blocks.some((b) => b.t === 'button')) blocks.push({ t: 'button' });
    const photo = photos[s.id];
    let inner;
    let rest = blocks;
    if (photo) {
      let lead;
      [lead, rest] = splitLead(blocks);
      inner = `<div class="grid gap-10 photo-fill"><div class="min-w-0 photo-fill-text">${h2Html(s)}${lead.map(render).join('')}</div>${photoHtml(photo)}</div>`;
    } else inner = h2Html(s);
    const toc = n === 0 ? tocHtml(sections) : '';
    const cls = `${n % 2 ? 'bg-soft' : 'bg-white'}${s === last ? ' svc-contact' : ''}`;
    if (dry) console.log(`  ${s.id.padEnd(62)} lead=${String(blocks.slice(0, blocks.findIndex((b) => b.t === 'cards' || b.t === 'h3') >>> 0).reduce((a, b) => a + textLen(b), 0)).padStart(5)} ${photo ? 'PHOTO' : ''}`);
    return `<section id="${s.id}" class="${cls} "><div class="mx-auto max-w-7xl px-5 py-14 md:py-20 ">${inner}${rest.map(render).join('')}${toc}</div></section>`;
  }).join('');

  const refsHtml = refs.length
    ? `<section id="references" class="${sections.length % 2 ? 'bg-soft' : 'bg-white'} "><div class="mx-auto max-w-7xl px-5 py-14 md:py-20 "><p class="text-[12px] font-semibold uppercase tracking-[0.2em] mb-2.5 text-rose">References</p><ul class="max-w-3xl space-y-2.5 my-6">${refs.map((r) => `<li class="flex gap-3 text-[15px] leading-relaxed text-ink/85"><span class="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true"></span><span>${esc(r)}</span></li>`).join('')}</ul></div></section>`
    : '';

  const html = `<!--$-->${heroHtml(title, category.title)}${body}${refsHtml}<div data-mbp="related"></div>${ctaHtml}<!--/$-->`;
  const first = sections[0].items.find((x) => !/^[-#@]/.test(x)) ?? '';
  const description = meta['meta-description'] || (first.length > 160 ? `${first.slice(0, first.lastIndexOf(' ', 158))}…` : first);
  const page = { generated: false, title: meta['meta-title'] || `${title} | Michelle Barratt Psychology`, description, html };
  if (!dry) writeFileSync(join(pagesDir, `therapy-services__${slug}.json`), `${JSON.stringify(page, null, 2)}\n`);
  return { slug, title, sections: sections.length, photos: Object.keys(photos).length, refs: refs.length, html: html.length };
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const only = args.filter((a) => !a.startsWith('--'));

// Hero photos for pages that define one (others keep theirs from reference.json / build-topics).
if (!dry) {
  const heroFile = join(root, 'src/data/generatedHeroImages.json');
  const heroes = JSON.parse(readFileSync(heroFile, 'utf8'));
  for (const [slug, cfg] of Object.entries(PAGES)) if (cfg.hero) heroes[`/therapy-services/${slug}`] = cfg.hero;
  writeFileSync(heroFile, JSON.stringify(heroes, null, 2));
}
for (const [slug, cfg] of Object.entries(PAGES)) {
  if (only.length && !only.includes(slug)) continue;
  if (!existsSync(join(srcDir, `${cfg.source ?? slug}.svc`))) throw new Error(`${slug}: missing source`);
  if (dry) console.log(slug);
  const r = build(slug, cfg, { dry });
  if (!dry) console.log(`${r.slug.padEnd(32)} sections=${r.sections} photos=${r.photos} refs=${r.refs}  ${r.title}`);
}
