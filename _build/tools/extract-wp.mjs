// Usage: node extract-wp.mjs <input.html> <output.txt>
// Dumps the main content of a WordPress page as an outline:
// [#id] markers, H1-H6, paragraphs, list items and images (largest srcset candidate).
import { readFileSync, writeFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

const [, , input, output] = process.argv;
const $ = cheerio.load(readFileSync(input, 'utf8'));

$('header, footer, nav, script, style, noscript, .elementor-location-header, .elementor-location-footer, #wpadminbar').remove();

const root = $('main').length ? $('main') : $('body');
const lines = [];
const seenImg = new Set();

function largestSrc($img) {
  const srcset = $img.attr('srcset') || $img.attr('data-srcset');
  if (srcset) {
    const best = srcset.split(',').map(s => s.trim().split(/\s+/))
      .map(([u, w]) => ({ u, w: parseInt(w) || 0 }))
      .sort((a, b) => b.w - a.w)[0];
    if (best) return best.u;
  }
  return $img.attr('data-src') || $img.attr('data-lazy-src') || $img.attr('src');
}

root.find('*').each((_, el) => {
  const $el = $(el);
  const tag = el.tagName?.toLowerCase();
  const id = $el.attr('id');
  if (id && !/^(elementor|e-n-|wp-|tab-)/.test(id)) lines.push(`[#${id}]`);
  if (/^h[1-6]$/.test(tag)) {
    const t = $el.text().replace(/\s+/g, ' ').trim();
    if (t) lines.push(`${tag.toUpperCase()}: ${t}`);
  } else if (tag === 'p') {
    const t = $el.text().replace(/\s+/g, ' ').trim();
    if (t) lines.push(`P: ${t}`);
  } else if (tag === 'li' && !$el.find('li').length && !$el.closest('nav').length) {
    const t = $el.text().replace(/\s+/g, ' ').trim();
    if (t) lines.push(`LI: ${t}`);
  } else if (tag === 'img') {
    const src = largestSrc($el);
    if (src && !src.startsWith('data:') && !seenImg.has(src)) {
      seenImg.add(src);
      lines.push(`IMG: ${src} | alt="${$el.attr('alt') || ''}" | ${$el.attr('width') || '?'}x${$el.attr('height') || '?'}`);
    }
  } else if (tag === 'section' || tag === 'div') {
    const bg = ($el.attr('style') || '').match(/background-image:\s*url\(['"]?([^'")]+)/);
    if (bg && !seenImg.has(bg[1])) { seenImg.add(bg[1]); lines.push(`BGIMG: ${bg[1]}`); }
  }
});

// De-duplicate consecutive identical lines (nested builder wrappers repeat text)
const out = lines.filter((l, i) => l !== lines[i - 1]);
writeFileSync(output, out.join('\n'));
console.log(`${input} -> ${out.length} lines`);
