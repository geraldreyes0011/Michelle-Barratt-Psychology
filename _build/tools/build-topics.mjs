// Usage: node build-topics.mjs <projectRoot>
// Generates src/data/pages/therapy-services__<slug>.json for every Therapy Services topic
// that has no page on the Base44 reference site:
//   - migrated topics: content extracted from the client's original WordPress page/section,
//     rendered with the same section/heading/list/card markup the reference pages use
//   - blank topics: hero + navigation only, no body copy (awaiting an approved article)
// Also writes _build/topic-report.json describing what was done for each page.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as cheerio from 'cheerio';

const root = process.argv[2];
const wpDir = join(root, '_build/source-data/wordpress-originals');
const pagesDir = join(root, 'src/data/pages');
const { therapyMenu, primaryCategory, allTopicSlugs } = await import(pathToFileURL(join(root, 'src/data/therapyMenu.js')).href);

const WP = 'https://michellebarrattpsychology.com.au';
const UP = `${WP}/wp-content/uploads`;

// ---------------------------------------------------------------- topic sources
// from/to: '#anchor-id' or heading text (exact, case-insensitive). `to` is exclusive.
const MIGRATED = {
  'adhd-therapy-children': {
    file: 'child-adolescent-therapy', from: '#adhd-therapy', to: '#teenage-anxiety',
    hero: { src: `${UP}/2023/03/pexels-andrea-piacquadio-3807738-min.jpg`, alt: 'ADHD therapy for children' },
    source: `${WP}/child-adolescent-therapy/#adhd-therapy`,
  },
  'child-self-esteem': {
    file: 'child-adolescent-therapy', from: '#child-self-esteem', to: '#bullying',
    hero: { src: `${UP}/2023/03/pexels-andrea-piacquadio-3807738-min.jpg`, alt: "Building a child's self-esteem" },
    source: `${WP}/child-adolescent-therapy/#child-self-esteem`,
  },
  bullying: {
    file: 'child-adolescent-therapy', from: '#bullying', to: 'Child Anxiety',
    hero: { src: `${UP}/2023/03/pexels-andrea-piacquadio-3807738-min.jpg`, alt: 'Support for children experiencing bullying' },
    source: `${WP}/child-adolescent-therapy/#bullying`,
    note: 'Brief linked #child-self-esteem for Bullying; the source page has a dedicated #bullying section, which was used.',
  },
  'child-adolescent-trauma': {
    file: 'trauma', from: 'Understanding trauma in children and young people', to: 'Recognising trauma responses in adults',
    hero: { src: `${UP}/2020/10/trauma.jpg`, alt: 'Child and adolescent trauma therapy' },
    source: `${WP}/trauma/`,
    note: 'Source is the general trauma page; only its children-and-young-people section was migrated (adult content stays on Trauma Therapy).',
  },
  'oppositional-defiant-disorder': {
    file: 'oppositional-defiant-disorder', from: 'h1', to: '#contact', introParagraphs: 2,
    hero: { src: `${UP}/2021/01/angry-kid.jpg`, alt: 'Oppositional defiant disorder support' },
    source: `${WP}/oppositional-defiant-disorder/`,
  },
  cbt: {
    file: 'interventions', from: '#cbt', to: '#dbt',
    hero: { src: `${UP}/2020/09/Interventions-1.jpg`, alt: 'Cognitive behavioural therapy' },
    source: `${WP}/interventions/#cbt`,
  },
  dbt: {
    file: 'interventions', from: '#dbt', to: '#bmt',
    hero: { src: `${UP}/2020/09/Interventions-1.jpg`, alt: 'Dialectical behaviour therapy' },
    source: `${WP}/interventions/#dbt`,
    note: 'Brief linked #cbt for DBT; the source page has a dedicated #dbt section, which was used.',
  },
  emdr: {
    file: 'interventions', from: '#emdr', to: '#play-therapy',
    // The live source repeats the Behaviour Modification text under this subheading (copy error).
    skipBodyOf: ['A Powerful Tool for Healing Trauma'],
    hero: { src: `${UP}/2020/09/Interventions-1.jpg`, alt: 'EMDR therapy' },
    source: `${WP}/interventions/#emdr`,
    note: 'Source section repeats the Behaviour Modification text under "A Powerful Tool for Healing Trauma" (copy error on the live site); that duplicate was left out.',
  },
  assessments: {
    file: 'assessment', from: 'h1', to: 'We Are Here to Help', introParagraphs: 1,
    title: 'Psychology Assessments and Reports',
    source: `${WP}/assessment/`,
  },
  ndis: {
    file: 'referrals', from: '#NDIS', to: '#DVA',
    hero: { src: `${UP}/2025/12/care-learning-9954699_1280.jpg`, alt: 'NDIS psychology support' },
    source: `${WP}/referrals/#NDIS`,
  },
};

// Topics with a supplied source that could not be accessed (Google Drive folders need sign-in).
const INACCESSIBLE = {
  'emotional-dysregulation': 'https://drive.google.com/drive/folders/19GwhBvpUvNaMy_shvTR9xtQdws0fgY_K',
  'grief-loss': 'https://drive.google.com/drive/folders/1lug7hN_7BO1Uga8-cstasbdsaK_VGXcO',
  'adhd-therapy-assessment': 'https://drive.google.com/drive/folders/1Ei1Nm9zr9dgPK0wV0o0YEkRz3PjI9tth',
  ptsd: 'https://drive.google.com/drive/folders/1-VSovjJeZN6EIbjZULndNhrFg4CeMqUN',
};

// Boilerplate that belongs to the WordPress page chrome, not the article.
const SKIP_TEXT = [
  /^Clinically informed Support$/i,
  /^Michelle Barratt Psychology provides a neutral, professional hub/i,
  /^Table of Contents$/i,
  /^Prefer to call\?$/i,
  /^Phone our administration team on/i,
  /^\*Your personal information will be handled/i,
  /^Clinical THERAPY$/i,
];
const SKIP_HEADING = [/^Contact Us on the (Email )?Form Below$/i, /^Email Us on the Form Below$/i, /^Learn More About /i];

// ---------------------------------------------------------------- markup (matches reference pages)
const CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right h-3 w-3"><path d="m9 18 6-6-6-6"></path></svg>';
const BTN = 'inline-flex items-center justify-center min-h-12 px-7 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function heroHtml({ title, eyebrow, intro }) {
  const introHtml = intro.length
    ? `<div class="max-w-2xl text-[16px] md:text-[17px] text-white/95 space-y-3">${intro.map((p) => `<p>${p}</p>`).join('')}</div>`
    : '';
  return `<section class="bg-gradient-to-br from-plum to-rose text-white"><div class="mx-auto max-w-7xl px-5 py-14 md:py-20"><div>`
    + `<nav aria-label="Breadcrumb" class="mb-6"><ol class="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-white/75">`
    + `<li><a class="hover:text-white" href="/">Home</a></li><li aria-hidden="true">${CHEVRON}</li>`
    + `<li><a class="hover:text-white" href="/therapy-services">Therapy Services</a></li><li aria-hidden="true">${CHEVRON}</li>`
    + `<li class="text-white" aria-current="page">${esc(title)}</li></ol></nav>`
    + `<p class="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 mb-3">${esc(eyebrow)}</p>`
    + `<h1 class="text-white text-[32px] md:text-[44px] font-semibold leading-[1.08] max-w-3xl">${esc(title)}</h1>`
    + `<div class="h-[3px] w-16 bg-sun my-5" aria-hidden="true"></div>${introHtml}`
    + `<div class="mt-6 flex flex-wrap gap-3"><a class="${BTN} bg-white text-plum hover:bg-blush " href="/contact">Contact Us</a>`
    + `<a class="${BTN} border border-white/70 text-white hover:bg-white/10 " href="/practitioners">See Practitioners</a></div>`
    + `</div></div></section>`;
}

const h2Html = (t) => `<div class="mb-10 max-w-3xl"><h2 class="text-3xl md:text-4xl font-semibold">${t}</h2><div class="h-[3px] w-14 bg-sun mt-5" aria-hidden="true"></div></div>`;
const pHtml = (t) => `<p class="max-w-3xl text-[17px] leading-[1.75] text-ink/90 mb-5">${t}</p>`;
const h3Html = (t) => `<h3 class="text-2xl font-semibold mt-8 mb-3">${t}</h3>`;
const ulHtml = (items) => `<ul class="max-w-3xl space-y-2.5 my-6">${items.map((i) => `<li class="flex gap-3 text-[17px] leading-relaxed text-ink/90"><span class="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true"></span><span>${i}</span></li>`).join('')}</ul>`;
const cardsHtml = (cards) => `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-8">${cards.map((c) => `<div class="bg-white/70 rounded border border-lilac p-6"><span class="block h-2.5 w-2.5 rounded-full bg-ocean mb-4" aria-hidden="true"></span><h3 class="text-xl font-semibold mb-2">${c.title}</h3><p class="text-[15px] leading-relaxed text-ink/85">${c.text}</p></div>`).join('')}</div>`;
const figureHtml = (src, alt) => `<figure class="my-9"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" class="w-full max-w-4xl aspect-[3/2] object-cover rounded border border-lilac"/></figure>`;
const buttonHtml = (href, label) => `<div class="my-6"><a class="${BTN} bg-plum text-white hover:bg-[#1C302D] " href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a></div>`;

// Shared closing block, taken verbatim from a reference therapy page.
const ctaHtml = (() => {
  const { html } = JSON.parse(readFileSync(join(pagesDir, 'therapy-services__burnout.json'), 'utf8'));
  const i = html.indexOf('<section class="bg-blush">');
  return html.slice(i, html.indexOf('</section>', i) + 10);
})();

// ---------------------------------------------------------------- extraction
function cleanInline($, el) {
  const $el = $(el).clone();
  $el.find('script, style, svg').remove();
  // Keep a, strong/b, em/i, br; unwrap everything else.
  $el.find('*').each((_, n) => {
    const tag = n.tagName.toLowerCase();
    if (!['a', 'strong', 'b', 'em', 'i', 'br'].includes(tag)) $(n).replaceWith($(n).contents());
  });
  $el.find('a').each((_, a) => {
    const href = rewriteHref($(a).attr('href') || '');
    const attrs = { href };
    if (/^https?:/.test(href)) Object.assign(attrs, { target: '_blank', rel: 'noopener noreferrer' });
    for (const k of Object.keys(a.attribs)) $(a).removeAttr(k);
    $(a).attr(attrs).addClass('text-ocean underline underline-offset-4 font-medium');
  });
  $el.find('b').each((_, b) => { b.tagName = 'strong'; });
  $el.find('i').each((_, i) => { i.tagName = 'em'; });
  $el.find('strong, em').each((_, n) => { for (const k of Object.keys(n.attribs)) $(n).removeAttr(k); });
  let html = $el.html().replace(/&nbsp;|&#xa0;|&#160;| /gi, ' ').replace(/\s+/g, ' ').trim();
  // Bare URLs written as text become links.
  if (/^https?:\/\/\S+$/.test(html)) html = `<a href="${html}" target="_blank" rel="noopener noreferrer" class="text-ocean underline underline-offset-4 font-medium break-all">${html}</a>`;
  return html;
}

function rewriteHref(href) {
  if (/michellebarrattpsychology\.com\.au\/michellebarrattpsychology\/?$/.test(href)) return '/practitioners';
  if (/^#contact/.test(href) || /michellebarrattpsychology\.com\.au\/[\w-]*contact[\w-]*\/?$/.test(href)) return '/contact';
  return href;
}

// Page-builder flattening fixes: runs of bold-only lines are lists, over-long "headings" are
// paragraphs, and "Lead: – a – b – c" / "Lead: 1. a 2. b 3. c" paragraphs are a lead plus a list.
function normaliseBlocks(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'h3' && b.bold) {
      let j = i;
      while (blocks[j]?.type === 'h3' && blocks[j].bold) j++;
      if (j - i >= 3) {
        let run = blocks.slice(i, j);
        if (run[0].text === run[0].text.toUpperCase()) { out.push(run[0]); run = run.slice(1); }
        out.push({ type: 'li-group', items: run.map((x) => x.html) });
        i = j - 1;
        continue;
      }
    }
    if (/^h[23]$/.test(b.type) && b.text.length > 140) { out.push({ type: 'p', html: b.html, text: b.text }); continue; }
    if (b.type === 'p') {
      const sep = '(?:\\s|<br\\s*\\/?>)+';
      const dash = b.html.split(new RegExp(`${sep}(?:[–-]|&#x2013;|&ndash;|&#8211;)\\s(?=[A-Z])`, 'i'));
      const num = b.html.split(new RegExp(`${sep}(?=\\d\\.\\s)`));
      const parts = (dash.length >= 4 ? dash : num.length >= 4 ? num : null)?.map((s) => s.replace(/(?:\s|<br\s*\/?>)+$/, ''));
      if (parts && /:(?:\s|<\/strong>)*$/.test(parts[0])) {
        out.push({ type: 'p', html: parts[0].trim(), text: parts[0] });
        out.push({ type: 'li-group', items: parts.slice(1).map((s) => s.trim()) });
        continue;
      }
    }
    out.push(b);
  }
  return out;
}

const textOf = ($, el) => $(el).text().replace(/\s+/g, ' ').trim();
const isBoldOnly = ($, el) => {
  const kids = $(el).contents().toArray().filter((n) => !(n.type === 'text' && !n.data.trim()));
  return kids.length === 1 && ['strong', 'b'].includes(kids[0].tagName?.toLowerCase()) && textOf($, el).length < 90;
};

function matches($, el, marker) {
  if (marker === 'h1') return el.tagName.toLowerCase() === 'h1';
  if (marker.startsWith('#')) return $(el).attr('id') === marker.slice(1);
  return /^h[1-6]$/i.test(el.tagName) && textOf($, el).toLowerCase() === marker.toLowerCase();
}

function extractBlocks(spec) {
  const $ = cheerio.load(readFileSync(join(wpDir, `${spec.file}.html`), 'utf8'));
  $('header, footer, nav, script, style, noscript, form, .elementor-toc, .elementor-location-header, .elementor-location-footer').remove();
  const blocks = [];
  const images = [];
  const links = [];
  let on = false;
  let skipping = false;
  for (const el of $('body').find('*').toArray()) {
    const tag = el.tagName.toLowerCase();
    if (!on) { if (matches($, el, spec.from)) on = true; else continue; }
    else if (matches($, el, spec.to)) break;

    if (/^h[1-6]$/.test(tag)) {
      const text = textOf($, el);
      if (!text) continue;
      skipping = (spec.skipBodyOf ?? []).includes(text);
      if (SKIP_TEXT.some((r) => r.test(text))) continue;
      if (SKIP_HEADING.some((r) => r.test(text))) { blocks.push({ type: 'skip-heading' }); continue; }
      const level = tag === 'h1' ? 1 : tag === 'h2' ? 2 : 3;
      blocks.push({ type: `h${level}`, html: cleanInline($, el), text });
      continue;
    }
    if (skipping) continue;
    if (tag === 'p') {
      if ($(el).closest('li').length) continue;
      const text = textOf($, el);
      if (!text || SKIP_TEXT.some((r) => r.test(text))) continue;
      if (isBoldOnly($, el)) { blocks.push({ type: 'h3', bold: true, html: cleanInline($, el).replace(/<\/?strong>/g, '').replace(/:\s*$/, ''), text }); continue; }
      const html = cleanInline($, el);
      // "• a• b• c" paragraphs are lists flattened by the page builder.
      if ((text.match(/•/g) || []).length >= 2) {
        blocks.push({ type: 'li-group', items: html.split('•').map((s) => s.trim()).filter(Boolean) });
        continue;
      }
      blocks.push({ type: 'p', html, text });
      for (const m of html.matchAll(/href="([^"]+)"/g)) links.push(m[1]);
      continue;
    }
    if (tag === 'li') {
      if ($(el).find('li').length || $(el).find('p').length > 1) continue;
      const text = textOf($, el);
      if (!text || SKIP_TEXT.some((r) => r.test(text))) continue;
      blocks.push({ type: 'li', html: cleanInline($, el) });
      continue;
    }
    if (tag === 'img') {
      const src = largestSrc($, el);
      if (!src || src.startsWith('data:') || images.includes(src)) continue;
      images.push(src);
      blocks.push({ type: 'img', src });
      continue;
    }
    if (tag === 'a' && /\.pdf($|\?)/i.test($(el).attr('href') || '') && !$(el).closest('p, li').length) {
      blocks.push({ type: 'button', href: $(el).attr('href'), label: textOf($, el) || 'Download PDF' });
      links.push($(el).attr('href'));
    }
  }
  if (!on) throw new Error(`${spec.file}: start marker not found: ${spec.from}`);
  return { blocks: normaliseBlocks(blocks), images, links };
}

function largestSrc($, el) {
  const srcset = $(el).attr('data-srcset') || $(el).attr('srcset');
  let src = $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('src');
  if (srcset) {
    const best = srcset.split(',').map((s) => s.trim().split(/\s+/)).map(([u, w]) => ({ u, w: parseInt(w) || 0 })).sort((a, b) => b.w - a.w)[0];
    if (best?.u) src = best.u;
  }
  // Prefer the original upload over a resized WordPress derivative.
  return src?.replace(/-\d+x\d+(\.\w+)$/, '$1').replace(/-scaled(\.\w+)$/, '-scaled$1');
}

// ---------------------------------------------------------------- render
function renderBody(blocks, { heroImageSrc, defaultAlt }) {
  const sections = [];
  let cur = null;
  const open = (heading) => { cur = { heading, parts: [] }; sections.push(cur); };

  // Group consecutive list items; group (h3, short p) runs of 3+ into cards.
  const items = [];
  for (const b of blocks) {
    if (b.type === 'li') {
      const last = items.at(-1);
      if (last?.type === 'ul') last.items.push(b.html); else items.push({ type: 'ul', items: [b.html] });
    } else if (b.type === 'li-group') items.push({ type: 'ul', items: b.items });
    else items.push(b);
  }

  for (let i = 0; i < items.length; i++) {
    const b = items[i];
    if (b.type === 'h1' || b.type === 'skip-heading') continue;
    if (b.type === 'h2') { open(b.html); continue; }
    if (!cur) open(null);
    if (b.type === 'h3') {
      // Card run: h3 followed by exactly one short paragraph, at least three in a row.
      const run = [];
      let j = i;
      while (items[j]?.type === 'h3' && items[j + 1]?.type === 'p' && items[j + 1].text.length < 260 && items[j + 2]?.type !== 'ul' && items[j + 2]?.type !== 'p') {
        run.push({ title: items[j].html, text: items[j + 1].html });
        j += 2;
      }
      if (run.length >= 3) { cur.parts.push(cardsHtml(run)); i = j - 1; continue; }
      // A sub-heading that only repeats its section heading adds nothing.
      if (cur.heading && b.text.toLowerCase().replace(/[?:]/g, '') === cur.heading.toLowerCase().replace(/<[^>]+>|[?:]/g, '')) continue;
      cur.parts.push(h3Html(b.html));
      continue;
    }
    if (b.type === 'p') cur.parts.push(pHtml(b.html));
    else if (b.type === 'ul') cur.parts.push(ulHtml(b.items));
    else if (b.type === 'img' && b.src !== heroImageSrc) cur.parts.push(figureHtml(b.src, defaultAlt));
    else if (b.type === 'button') cur.parts.push(buttonHtml(b.href, b.label));
  }

  return sections
    .filter((s) => s.parts.length)
    .map((s, n) => `<section class="${n % 2 ? 'bg-soft' : 'bg-white'} "><div class="mx-auto max-w-7xl px-5 py-14 md:py-20 ">${s.heading ? h2Html(s.heading) : ''}${s.parts.join('')}</div></section>`)
    .join('');
}

function labelFor(slug) {
  for (const c of therapyMenu) for (const l of [...c.links, ...(c.subgroup?.links ?? [])]) if (l.slug === slug) return l.label;
  return slug;
}

// ---------------------------------------------------------------- build
const report = [];
const heroImages = {};
for (const slug of allTopicSlugs()) {
  const out = join(pagesDir, `therapy-services__${slug}.json`);
  const ref = existsSync(out) && !JSON.parse(readFileSync(out, 'utf8')).generated;
  if (ref) { report.push({ slug, status: 'existing-page', note: 'Reference page kept; content unchanged.' }); continue; }

  const category = primaryCategory(slug);
  const label = labelFor(slug);
  const spec = MIGRATED[slug];
  let html;
  let entry;

  if (spec) {
    const { blocks, images, links } = extractBlocks(spec);
    const title = spec.title ?? label;
    const introCount = spec.introParagraphs ?? 0;
    const intro = [];
    const rest = [...blocks];
    if (introCount) {
      for (let k = 0; k < rest.length && intro.length < introCount; k++) {
        if (rest[k].type === 'p') { intro.push(rest[k].html); rest.splice(k, 1); k--; }
        else if (!['h1', 'img'].includes(rest[k].type)) break;
      }
    }
    if (spec.hero) heroImages[`/therapy-services/${slug}`] = spec.hero;
    html = `<!--$-->${heroHtml({ title, eyebrow: category.title, intro })}`
      + renderBody(rest, { heroImageSrc: spec.hero?.src, defaultAlt: title })
      + `<div data-mbp="related"></div>${ctaHtml}<!--/$-->`;
    entry = { slug, status: 'migrated', source: spec.source, images: [...new Set([spec.hero?.src, ...images].filter(Boolean))], links: [...new Set(links)], note: spec.note };
  } else {
    html = `<!--$-->${heroHtml({ title: label, eyebrow: category.title, intro: [] })}`
      + `<!-- Page body intentionally empty: awaiting the client's approved article. -->`
      + `<div data-mbp="related"></div>${ctaHtml}<!--/$-->`;
    entry = INACCESSIBLE[slug]
      ? { slug, status: 'blank-source-inaccessible', source: INACCESSIBLE[slug], note: 'Google Drive folder requires sign-in; nothing could be retrieved.' }
      : { slug, status: 'blank-no-source', note: 'No source supplied; page left blank.' };
  }

  // Meta description: the page's own first paragraph (blank pages get none).
  const firstP = html.match(/<p class="(?:max-w-3xl text-\[17px\][^"]*)">([\s\S]*?)<\/p>|<div class="max-w-2xl[^"]*"><p>([\s\S]*?)<\/p>/);
  const description = spec && firstP ? (firstP[1] ?? firstP[2]).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').slice(0, 160) : '';

  writeFileSync(out, JSON.stringify({
    generated: true,
    title: `${spec?.title ?? label} | Michelle Barratt Psychology`,
    description,
    html,
  }, null, 2));
  report.push(entry);
}

writeFileSync(join(root, 'src/data/generatedHeroImages.json'), JSON.stringify(heroImages, null, 2));
writeFileSync(join(root, '_build/topic-report.json'), JSON.stringify(report, null, 2));
for (const r of report) console.log(r.status.padEnd(26), r.slug, r.images ? `(${r.images.length} img, ${r.links.length} links)` : '');
