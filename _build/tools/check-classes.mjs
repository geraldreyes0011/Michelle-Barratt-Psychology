// Usage: node check-classes.mjs <projectRoot>
// The site reuses the reference site's compiled Tailwind CSS verbatim, so any utility class
// used in our components or generated pages must already exist in it (or in additions.css).
// Lists every class that has no matching selector.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.argv[2];
const css = ['reference.css', 'additions.css']
  .map((f) => { try { return readFileSync(join(root, 'src/styles', f), 'utf8'); } catch { return ''; } })
  .join('\n');

// Tailwind selector escaping: \ before any char that is not [A-Za-z0-9_-]; a leading digit becomes \3N .
const escapeClass = (c) => c.replace(/[^A-Za-z0-9_-]/g, (ch) => `\\${ch}`).replace(/^(\d)/, (d) => `\\3${d} `);
const has = (c) => css.includes(`.${escapeClass(c)}`);

const ignore = new Set(['group', 'toaster', 'toast', 'active', 'lucide']);
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (['.jsx', '.js', '.json'].includes(extname(p))) files.push(p);
  }
})(join(root, 'src'));

const missing = new Map();
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const strings = [...src.matchAll(/class(?:Name)?=(?:\\?"|\{?`|')([^"`'\\]+)/g)].map((m) => m[1])
    .concat([...src.matchAll(/(?:cx|className:)\s*\(?\s*['`]([^'`]+)['`]/g)].map((m) => m[1]));
  for (const s of strings) {
    for (const c of s.split(/\s+/).filter(Boolean)) {
      if (ignore.has(c) || c.startsWith('lucide-') || c.includes('${')) continue;
      if (!has(c)) missing.set(c, (missing.get(c) ?? new Set()).add(f.replace(root, '')));
    }
  }
}
if (!missing.size) console.log('All classes present.');
for (const [c, fs] of [...missing].sort()) console.log(c.padEnd(48), [...fs].slice(0, 3).join(', '));
