// Usage: node extract-bundle-data.mjs <index.pretty.js> <hero.pretty.js> <out.json>
// Pulls the plain-data constants out of the beautified Base44 bundle so the site
// uses the reference wording verbatim: legacy therapy menu (Rx), top links (zx),
// Helpful Info groups (Bx) and pages (Vx), homepage service-card meta (Mw),
// therapy hero images (Iw), page hero images (Ne) and the footer HTML (Xw).
import { readFileSync, writeFileSync } from 'node:fs';

const [, , indexPath, heroPath, outPath] = process.argv;
const idx = readFileSync(indexPath, 'utf8');
const hero = readFileSync(heroPath, 'utf8');

// Slice from `marker` up to the first `terminator` after it, then evaluate the expression.
function grab(src, marker, terminator, prelude = '') {
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`marker not found: ${marker}`);
  const end = src.indexOf(terminator, start);
  const expr = src.slice(start + marker.length, end).trim().replace(/,\s*$/, '');
  return new Function(`${prelude}; return (${expr});`)();
}

const wp = 'const jw = `https://michellebarrattpsychology.com.au/wp-content/uploads`, Fw = jw, $ = jw';

const data = {
  legacyTherapyMenu: grab(idx, 'Rx = ', '\n    zx = '),
  topLinks: grab(idx, 'zx = ', '\n    Bx = '),
  helpfulInfoGroups: grab(idx, 'Bx = ', ';\nBx.flatMap'),
  helpfulInfoPages: grab(idx, 'var Vx = ', '\n    Hx = '),
  homeServiceMeta: grab(idx, 'Mw = ', ';\n\nfunction Nw', wp),
  therapyHeroImages: grab(idx, 'Iw = ', ';\n\nfunction Lw', wp),
  pageHeroImages: grab(hero, 'Ne = ', ';\n\nfunction Pe', wp),
  footerHtml: grab(idx, 'var Xw = {\n    html: ', '\n};\n\nfunction Zw'),
};

writeFileSync(outPath, JSON.stringify(data, null, 2));
for (const [k, v] of Object.entries(data)) {
  console.log(k.padEnd(20), Array.isArray(v) ? `${v.length} items` : typeof v === 'string' ? `${v.length} chars` : `${Object.keys(v).length} keys`);
}
