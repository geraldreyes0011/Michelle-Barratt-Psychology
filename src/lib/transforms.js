// HTML transforms applied to page data before rendering.
// The first group is a straight port of the reference site's PageView (Base44 bundle: qw, Hw, Lw, Rw, Vw)
// so pages render exactly as they do there. The second group implements the requested updates.
import { localiseImages } from '../data/site.js';
import { primaryCategory, therapyMenu } from '../data/therapyMenu.js';

// ------------------------------------------------------------------ reference behaviour

// Palette correction the reference applies at render time (source data still holds old hexes).
const RECOLOUR = [
  ['#9d2a59', '#D84B83'],
  ['#095a6f', '#1C302D'],
  ['#3a1356', '#1C302D'],
  ['#b8336a', '#C32D70'],
  ['#4b1a6e', '#263C37'],
];
export function recolour(html) {
  if (!html) return html;
  let out = html;
  for (const [from, to] of RECOLOUR) out = out.replace(new RegExp(from, 'gi'), to);
  return out.replaceAll('from-plum to-rose', 'from-plum to-ink');
}

// Tighter vertical rhythm on therapy and online-therapy pages.
export const isCompactPath = (path) => /^\/(therapy-services|online-therapy)(\/|$)/.test(path);
export function compactSpacing(html) {
  return html.replaceAll('py-14 md:py-20', 'py-9 md:py-12').replaceAll('py-14 md:py-16', 'py-8 md:py-10').replaceAll('mb-10 max-w-3xl', 'mb-6 max-w-3xl');
}

// Split the first <section> (text-only hero with an <h1>) so it can be shown beside its image.
export function splitHero(html, heroSrc) {
  if (!heroSrc) return null;
  const start = html.indexOf('<section');
  if (start === -1) return null;
  const end = html.indexOf('</section>', start);
  if (end === -1) return null;
  const first = html.slice(start, end + 10);
  if (!/<h1[\s>]/.test(first) || /<img[\s>]/.test(first)) return null;
  const m = first.match(/^<section([^>]*)>\s*<div[^>]*>([\s\S]*)<\/div>\s*<\/section>$/);
  if (!m) return null;
  const cls = m[1].match(/class="([^"]*)"/);
  return {
    sectionClass: cls ? cls[1] : 'bg-gradient-to-br from-plum to-rose text-white',
    innerHtml: m[2],
    rest: dropImageOnlySection(html.slice(end + 10), heroSrc),
  };
}

// The hero image now sits in the hero, so remove the section that only repeated it.
function dropImageOnlySection(html, src) {
  const re = /<section[^>]*>((?:(?!<\/section>)[\s\S])*?)<\/section>/g;
  let m;
  while ((m = re.exec(html))) {
    const s = m[0];
    if (s.includes(`src="${src}"`) && !s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()) return html.replace(s, '');
  }
  return html;
}

const GRADIENT_HERO = '<section class="bg-gradient-to-br from-plum to-rose text-white">';
const attr = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Full-bleed photo behind the gradient hero (pages with an entry in the page-hero map).
export function backgroundHero(html, hero) {
  if (!html || !hero?.src) return html;
  const i = html.indexOf(GRADIENT_HERO);
  if (i === -1) return html;
  const before = html.slice(0, i);
  let after = html.slice(i + GRADIENT_HERO.length);
  const j = after.indexOf('<div class="mx-auto max-w-');
  if (j !== -1) after = `${after.slice(0, j)}<div class="relative ${after.slice(j + 12)}`;
  return `${before}<section class="relative isolate overflow-hidden bg-plum text-white"><img src="${attr(hero.src)}" alt="${attr(hero.alt)}" fetchpriority="high" class="absolute inset-0 h-full w-full object-cover object-center"/><div class="absolute inset-0 bg-gradient-to-r from-plum/95 via-plum/90 to-plum/45" aria-hidden="true"></div>${after}`;
}

// ------------------------------------------------------------------ requested updates

const EYEBROW = /(<p class="text-\[12px\] font-semibold uppercase tracking-\[0\.2em\] text-white\/85 mb-3">)([^<]*)(<\/p>)/;
const MORE_IN = /<section class="bg-lilac !py-14">(?:(?!<\/section>)[\s\S])*?More in (?:(?!<\/section>)[\s\S])*?<\/section>/;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Therapy topic pages: hero eyebrow names the page's category in the new structure, and the
// "More in …" links come from the new menu (rendered by the `related` widget).
export function therapyTopic(html, slug) {
  const category = primaryCategory(slug);
  if (!category) return html;
  let out = html.replace(EYEBROW, (_, a, _old, c) => `${a}${esc(category.title)}${c}`);
  out = MORE_IN.test(out) ? out.replace(MORE_IN, '<div data-mbp="related"></div>') : out;
  return out;
}

// Therapy Services index: the category directory is rebuilt from the new menu using the
// reference page's category card markup (alternating blush/lilac panels, numbered).
// Rendered as HTML in place because it sits inside the page's content container.
const ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-4 w-4 shrink-0 text-ocean transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
const topicLi = (l) => `<li><a class="group flex items-center justify-between gap-3 min-h-14 px-3 border-b border-lilac/80 text-[15px] font-medium text-ink transition-colors duration-200 hover:text-rose hover:bg-blush/50" href="${l.to}"><span>${esc(l.label)}</span>${ARROW}</a></li>`;

function categoryDirectoryHtml() {
  return `<div class="space-y-8">${therapyMenu.map((c, i) => {
    const count = c.links.length + (c.subgroup?.links.length ?? 0);
    const sub = c.subgroup
      ? `<li class="grid-row-full pt-6 pb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose">${esc(c.subgroup.title)}</li>${c.subgroup.links.map(topicLi).join('')}`
      : '';
    return `<article id="${c.id}" class="grid lg:grid-cols-[minmax(260px,320px)_1fr] rounded overflow-hidden border border-lilac bg-white">`
      + `<div class="${i % 2 ? 'bg-lilac' : 'bg-blush'} p-8 flex flex-col justify-between gap-6"><div>`
      + `<p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-ocean mb-4">${String(i + 1).padStart(2, '0')}</p>`
      + `<h2 class="text-3xl md:text-[34px] font-semibold leading-[1.1] text-plum">${esc(c.title)}</h2>`
      + `<div class="h-[3px] w-12 bg-sun mt-5" aria-hidden="true"></div>`
      + (c.blurb ? `<p class="mt-5 text-[15px] leading-relaxed text-ink/80">${esc(c.blurb)}</p>` : '')
      + `</div><p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-plum/60">${count}<!-- --> services</p></div>`
      + `<ul class="grid sm:grid-cols-2 gap-x-6 p-4 sm:p-6 content-start">${c.links.map(topicLi).join('')}${sub}</ul></article>`;
  }).join('')}</div>`;
}

export function servicesIndex(html) {
  const start = html.indexOf('<div class="space-y-8"><article');
  if (start === -1) return html;
  let depth = 0;
  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = start;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return `${html.slice(0, start)}${categoryDirectoryHtml()}${html.slice(m.index + m[0].length)}`;
  }
  return html;
}

export { localiseImages };
