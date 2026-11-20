// Therapy Services page layout, modelled on the ADHD Therapy - Children & Adolescents page:
//   - every content section gets a stable, unique id
//   - an "On This Page" contents list (bulleted, built from the page's own headings) sits at the
//     end of the first content section
//   - section photos sit beside the text they relate to (photo-fill layout, see servicePhotos.js);
//     the old stand-alone in-body figures they replace are removed
//   - card grids use the shared box style (support-cards)
//   - "Contact Us…" sections are centred and carry the standard Contact Us button
// Page text is never changed. Pages that already have contents (the ADHD page) are left as built.
import { servicePhotos } from '../data/servicePhotos.js';

export const CONTACT_BTN_CLASS = 'inline-flex items-center justify-center min-h-12 px-7 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 btn-black-yellow ';
export const CONTACT_BTN = `<a class="${CONTACT_BTN_CLASS}" href="/contact">Contact Us</a>`;

const SECTION_OPEN = /^<section(?: id="([^"]*)")? class="([^"]*)"><div class="mx-auto max-w-7xl px-5 py-14 md:py-20 ">/;
const HEADING = /^<div class="mb-10 max-w-3xl">[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<\/div><\/div>/;
const CONTACT_HEADING = /^(contact us|email us)\b/i;
// A section's text stays together beside its photo (as on the Child & Adolescent Therapy page); only a
// very long single block of text is cut, so the photo is not dwarfed.
const PHOTO_TEXT_LIMIT = 1600;

const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
const textLen = (s) => decode(s).replace(/\s+/g, ' ').length;
const norm = (s) => decode(s).toLowerCase().replace(/\s+/g, ' ');
const slugify = (s) => decode(s).toLowerCase().replace(/^\d+\.\s*/, '').replace(/&/g, ' and ').replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64).replace(/-+$/, '') || 'section';
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Top-level elements of an HTML fragment (same-name nesting is tracked).
function topLevel(html) {
  const out = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] !== '<') {
      const j = html.indexOf('<', i);
      const end = j === -1 ? html.length : j;
      if (html.slice(i, end).trim()) out.push(html.slice(i, end));
      i = end;
      continue;
    }
    if (html.startsWith('<!--', i)) { const e = html.indexOf('-->', i) + 3; out.push(html.slice(i, e)); i = e; continue; }
    const name = /^<([a-z0-9]+)/i.exec(html.slice(i))?.[1]?.toLowerCase();
    const openEnd = html.indexOf('>', i) + 1;
    if (!name || /^(img|br|hr|input)$/.test(name) || html[openEnd - 2] === '/') { out.push(html.slice(i, openEnd)); i = openEnd; continue; }
    const re = new RegExp(`<(/?)${name}\\b[^>]*>`, 'gi');
    re.lastIndex = i;
    let depth = 0;
    let m;
    let end = html.length;
    while ((m = re.exec(html))) {
      depth += m[1] ? -1 : 1;
      if (depth === 0) { end = m.index + m[0].length; break; }
    }
    out.push(html.slice(i, end));
    i = end;
  }
  return out;
}

const isCards = (b) => b.startsWith('<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-8');
const isH3 = (b) => b.startsWith('<h3');
const isIntroToList = (b) => b.startsWith('<p') && /:\s*(<\/strong>)?\s*<\/p>$/.test(b);

const CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toc-chevron" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>';
const tocHtml = (entries) => `<nav class="toc" aria-labelledby="toc-title"><button type="button" class="toc-toggle" data-toc-toggle aria-expanded="false" aria-controls="toc-list"><span id="toc-title" class="toc-title">On This Page</span>${CHEVRON}</button><ol id="toc-list" class="toc-list">${entries.map((e) => `<li><a class="toc-link" href="#${e.id}"><span class="toc-dot h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true"></span><span>${e.label}</span></a></li>`).join('')}</ol></nav>`;
const photoHtml = ([, src, alt, opts = {}]) => `<img src="${attr(src)}" alt="${attr(alt)}" loading="lazy" class="photo-fill-img w-full object-cover rounded-lg border border-lilac"${opts.pos ? ` style="object-position:${opts.pos}"` : ''}/>`;

// Text that sits beside the photo: the section up to its cards or first sub-heading (never splitting a
// list from its lead-in); only text beyond PHOTO_TEXT_LIMIT continues below.
function splitLead(blocks) {
  let acc = 0;
  for (let k = 0; k < blocks.length; k++) {
    const b = blocks[k];
    const prev = blocks[k - 1];
    if (k > 0 && (isCards(b) || isH3(b) || (acc >= PHOTO_TEXT_LIMIT && !isH3(prev) && !isIntroToList(prev)))) {
      return [blocks.slice(0, k), blocks.slice(k)];
    }
    acc += textLen(b);
  }
  return [blocks, []];
}

export function serviceLayout(html, slug) {
  if (!html || html.includes('class="toc"')) return html;
  const photos = servicePhotos[slug] ?? [];
  const used = new Set();
  const seen = {};
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const unique = (base) => {
    let id = base;
    for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
    ids.add(id);
    return id;
  };

  // Pass 1: parse content sections.
  const sections = [];
  const re = /<section\b[^>]*>[\s\S]*?<\/section>/g;
  let m;
  while ((m = re.exec(html))) {
    const open = SECTION_OPEN.exec(m[0]);
    if (!open || !m[0].endsWith('</div></section>')) continue;
    const inner = m[0].slice(open[0].length, -'</div></section>'.length);
    const head = HEADING.exec(inner);
    if (!head) continue;
    const body = topLevel(inner.slice(head[0].length)).filter((b) => !b.startsWith('<figure'));
    const label = head[1].replace(/<[^>]+>/g, '').replace(/:\s*$/, '').trim();
    const key = norm(head[1]);
    seen[key] = (seen[key] ?? 0) + 1;
    const contact = CONTACT_HEADING.test(decode(head[1]));
    sections.push({
      start: m.index, end: m.index + m[0].length, cls: open[2], heading: head[0], label, key, n: seen[key], contact,
      id: open[1] ? (ids.add(open[1]), open[1]) : null, body,
    });
  }
  if (!sections.length) return html;
  for (const s of sections) if (!s.id) s.id = unique(s.contact ? 'contact-us' : slugify(s.label));

  // Contents: the page's sections; single-section pages list their sub-headings instead.
  let entries = [];
  const labels = new Set();
  for (const s of sections) {
    if (!s.body.length) continue; // a heading with nothing under it (e.g. "Learn More About …")
    const label = s.contact ? 'Contact Us' : s.label;
    if (labels.has(label.toLowerCase())) continue;
    labels.add(label.toLowerCase());
    entries.push({ id: s.id, label });
  }
  let subTargets = null;
  if (entries.length < 3) {
    const subs = sections.flatMap((s) => s.body.map((b, k) => ({ s, k, b })).filter((x) => x.b.startsWith('<h3 class="text-2xl')));
    if (subs.length >= 3) {
      subTargets = subs;
      entries = subs.map((x) => {
        const id = unique(slugify(x.b));
        x.s.body[x.k] = x.b.replace('<h3 ', `<h3 id="${id}" `);
        return { id, label: x.b.replace(/<[^>]+>/g, '').replace(/:\s*$/, '').trim() };
      });
    } else entries = [];
  }

  // Pass 2: rebuild each section.
  const first = sections[0];
  let out = html;
  for (const s of [...sections].reverse()) {
    let body = s.body.map((b) => (isCards(b) ? b.replace('my-8"', 'my-8 support-cards"') : b));
    if (s.contact && !body.some((b) => b.includes('href="/contact"'))) body.push(`<div class="mt-6 flex flex-wrap gap-3">${CONTACT_BTN}</div>`);
    const photo = photos.find((p) => norm(p[0]) === s.key && (p[3]?.n ?? 1) === s.n);
    let inner;
    let lead = [];
    let rest = body;
    if (photo) {
      used.add(photo);
      [lead, rest] = splitLead(body);
      inner = `<div class="grid gap-10 photo-fill"><div class="min-w-0 photo-fill-text">${s.heading}${lead.join('')}</div>${photoHtml(photo)}</div>`;
    } else inner = s.heading;
    if (s === first && entries.length) {
      // Before the first listed sub-heading (so the list is not below its own targets), else at the end.
      const at = subTargets ? rest.findIndex((b) => b.startsWith('<h3 id=')) : -1;
      if (at >= 0) rest = [...rest.slice(0, at), tocHtml(entries), ...rest.slice(at)];
      else rest = [...rest, tocHtml(entries)];
    }
    const cls = s.contact ? `${s.cls.trim()} svc-contact ` : s.cls;
    const rebuilt = `<section id="${s.id}" class="${cls}"><div class="mx-auto max-w-7xl px-5 py-14 md:py-20 ">${inner}${rest.join('')}</div></section>`;
    out = out.slice(0, s.start) + rebuilt + out.slice(s.end);
  }
  if (import.meta.env?.DEV) for (const p of photos) if (!used.has(p)) console.warn(`[serviceLayout] ${slug}: no section "${p[0]}" for photo ${p[1]}`);
  return out;
}

// Any page: Contact Us buttons use the one standard design (black with brand-yellow text).
export function standardContactButtons(html) {
  return html.replace(/<a class="[^"]*\bmin-h-12\b[^"]*" href="\/contact">Contact Us<\/a>/g, CONTACT_BTN);
}
