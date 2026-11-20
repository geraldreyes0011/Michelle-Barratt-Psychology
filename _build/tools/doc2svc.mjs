// Converts a reviewed source document (pdftotext -layout output) into the section format used to build
// Therapy Services pages (same format as adhd-service.txt):
//   @meta-title / @meta-description / @title    page metadata (from the document's SEO block and H1)
//   ## id | eyebrow | heading | toc label        a section (ALL-CAPS heading -> eyebrow when a heading line follows)
//   paragraph lines, "- " bullets, "### Title" + one paragraph (card), "#### Title" (sub-heading), "[toc]"
//   @references followed by "- " lines
// Usage: node doc2svc.mjs <in.txt> <out.svc>
import fs from 'node:fs';

const [inFile, outFile, sizesFile] = process.argv.slice(2);
// Font size of each line in the PDF (from pdfjs/fonts.mjs --json): 11 = body, 13 = sub-heading,
// 17/23 = section heading. Used to tell headings from short body lines.
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const sizeOf = new Map();
if (sizesFile) for (const l of JSON.parse(fs.readFileSync(sizesFile, 'utf8'))) if (!sizeOf.has(norm(l.text))) sizeOf.set(norm(l.text), l.size);
const raw = fs.readFileSync(inFile, 'utf8').replace(/\f/g, '\n').replace(/\r/g, '');
let lines = raw.split('\n').map((l) => l.replace(/\s+$/, ''));

const isCaps = (s) => /[A-Z]/.test(s) && s === s.toUpperCase() && /^[A-Z0-9 '’"“”&()\-–,.?/:!]+$/.test(s.trim()) && s.trim().length > 2;
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s(\-–/"“])([a-z])/g, (m, a, b) => a + b.toUpperCase())
  .replace(/\b(And|Or|Of|The|A|An|To|For|In|On|With|At|By|From|As|Into|Vs)\b/g, (w, _x, i) => (i === 0 ? w : w.toLowerCase()))
  .replace(/\bMbp\b/g, 'MBP').replace(/\bAdhd\b/g, 'ADHD').replace(/\bPtsd\b/g, 'PTSD').replace(/\bOdd\b/g, 'ODD').replace(/\bGp\b/g, 'GP').replace(/\bNdis\b/g, 'NDIS')
  .replace(/'S\b/g, "'s").replace(/’S\b/g, '’s').replace(/^(.)/, (c) => c.toUpperCase())
  .replace(/(:\s+|–\s+|-\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase());
const isHeadingLike = (s) => {
  const t = s.trim();
  if (!t || t.length > 80 || /[.,;:]$/.test(t) || /^[a-z]/.test(t) || isCaps(t)) return false;
  const words = t.split(/\s+/);
  if (words.length > 12) return false;
  const small = /^(and|or|of|the|a|an|to|for|in|on|with|at|by|from|as|is|it|be|your|you|their|its|when|after|into|not|than|through|that|can|may|what|why|how)$/i;
  const caps = words.filter((w) => /^[A-Z0-9("'“]/.test(w)).length;
  return caps >= Math.ceil(words.filter((w) => !small.test(w)).length * 0.6) || (t.endsWith('?') && words.length <= 12);
};

// Dashes ("--" in the documents) are not used on the site: a pair around an aside becomes commas, a dash
// that introduces a new clause becomes a colon, anything else a comma.
function dashes(s) {
  s = s.replace(/\s*(?:--|—)\s*/g, '--');
  // paired: "x--aside--y" within one sentence
  s = s.replace(/--([^.?!]*?)--/g, (m, aside) => `, ${aside}, `);
  s = s.replace(/--(?=(it|this|that|they|you|we|there|these|those|he|she|i|and it|which is)\b)/gi, ': ');
  s = s.replace(/--/g, ', ');
  return s.replace(/ ,/g, ',').replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ');
}

// --- metadata
const text = lines.join('\n');
const grab = (label) => {
  const m = new RegExp(`${label}[^:]*:\\s*([\\s\\S]*?)\\n\\s*\\n`).exec(text);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
};
const metaTitle = grab('Suggested Meta Title');
const metaDescription = grab('Suggested Meta Description');

// --- body: from the H1 (first ALL-CAPS line after the SEO block) to "References"
let start = 0;
const seoEnd = lines.findIndex((l) => /Suggested Meta Description/i.test(l));
for (let i = seoEnd >= 0 ? seoEnd + 1 : 0; i < lines.length; i++) {
  if (lines[i].trim() && isCaps(lines[i].trim()) && lines[i].trim().split(/\s+/).length >= 2) { start = i; break; }
}
// Body ends at the reference list ("Reference:", "References :") or at an editorial note to the writer
// ("Note:", "Note for Michelle:"), which is not page content.
let end = lines.findIndex((l, i) => i > start && (/^\s*References?\s*:?\s*$/i.test(l) || /^\s*Note\b/i.test(l)));
if (end < 0) end = lines.length;
const hasRefs = /^\s*References?\s*:?\s*$/i.test(lines[end] ?? '');
let title = lines[start].trim();
let k = start + 1;
while (lines[k] && isCaps(lines[k].trim()) && !lines[k + 1]?.trim()) { title += ` ${lines[k].trim()}`; k++; }
while (lines[k] && isCaps(lines[k].trim()) && lines[k].trim().length < 40 && /[&\-–]$/.test(title)) { title += ` ${lines[k].trim()}`; k++; }
const body = lines.slice(k, end);
// References: a line that continues the previous one (open bracket, or starts lower case) is joined.
// A reference reads "Title - Publisher". A line continues the previous entry when no blank line
// separates them and one of the two lacks the " - " separator (a wrapped title or publisher).
const refs = [];
{
  let blank = true;
  for (const raw of hasRefs ? lines.slice(end + 1) : []) {
    const l = raw.trim();
    if (!l) { blank = true; continue; }
    if (/^Note\b/i.test(l)) break;
    const prev = refs.at(-1);
    if (prev && !blank && (!l.includes(' - ') || !prev.includes(' - '))) refs[refs.length - 1] = `${prev} ${l}`;
    else refs.push(l);
    blank = false;
  }
}

// --- blocks
const blocks = []; // {t:'caps'|'head'|'p'|'li', s}
let para = null;
let li = null;
// Wrapped lines join with a space, except a word hyphenated at the line end ("Australia-" + "wide").
const joinLines = (arr) => arr.reduce((a, l) => (/[A-Za-z]-$/.test(a) ? a + l : `${a} ${l}`));
const flush = () => {
  if (para) blocks.push({ t: 'p', s: joinLines(para) });
  if (li) blocks.push({ t: 'li', s: joinLines(li) });
  para = null; li = null;
};
for (let i = 0; i < body.length; i++) {
  const l = body[i];
  const t = l.trim();
  if (!t) {
    // a bullet's wrapped continuation can follow a blank line (deeper indent)
    if (li && /^ {8,}\S/.test(body[i + 1] ?? '') ) continue;
    flush();
    continue;
  }
  if (/^ {3,7}\S/.test(l)) { flush(); li = [t]; continue; }            // bullet
  if (/^ {8,}\S/.test(l) && li) { li.push(t); continue; }             // bullet continuation
  if (/^ {8,}\S/.test(l) && !li) { flush(); li = [t]; continue; }
  if (li) { flush(); }
  if (isCaps(t)) {
    // caps heading, possibly wrapped onto the next line
    flush();
    let h = t;
    while (body[i + 1]?.trim() && isCaps(body[i + 1].trim())) h += ` ${body[++i].trim()}`;
    blocks.push({ t: 'caps', s: h });
    continue;
  }
  const prev = para?.at(-1);
  const prevEnds = prev && /[.?!:"”)]$/.test(prev);
  const nextBlank = !body[i + 1]?.trim();
  const size = sizeOf.get(norm(t));
  if (size && size >= 17) {
    // a section heading (may wrap onto a second line of the same size)
    flush();
    let h = t;
    while (body[i + 1]?.trim() && sizeOf.get(norm(body[i + 1])) >= 17 && !isCaps(body[i + 1].trim())) h += ` ${body[++i].trim()}`;
    blocks.push({ t: 'sec', s: h });
    continue;
  }
  const headLike = size ? size >= 13 : isHeadingLike(t);
  if (headLike && (!para || prevEnds || size >= 13) && (size >= 13 || nextBlank || /^\S/.test(body[i + 1] ?? ''))) {
    // a short title-case line on its own: a heading (unless it is just a short sentence fragment)
    flush();
    let h = t;
    while (size >= 13 && body[i + 1]?.trim() && sizeOf.get(norm(body[i + 1])) === size && !/[.?!:]$/.test(h)) h += ` ${body[++i].trim()}`;
    blocks.push({ t: 'head', s: h });
    continue;
  }
  if (para && prevEnds && prev.length < 82) { flush(); }
  (para ??= []).push(t);
}
flush();

// Card runs: consecutive sub-headings, each with one paragraph (the last may carry a closing
// paragraph for the section), are boxes.
for (let i = 0; i < blocks.length; i++) {
  if (blocks[i].t !== 'head' || blocks[i - 1]?.t === 'caps') continue;
  const run = [];
  let j = i;
  while (blocks[j]?.t === 'head' && blocks[j + 1]?.t === 'p') {
    let n = 0;
    while (blocks[j + 1 + n]?.t === 'p') n++;
    run.push({ at: j, n });
    j += 1 + n;
  }
  if (run.length >= 2 && run.slice(0, -1).every((r) => r.n === 1)) for (const r of run) blocks[r.at].card = true;
  i = Math.max(i, j - 1);
}

// --- sections
const slug = (s) => s.toLowerCase().replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60).replace(/-$/, '');
const out = [];
out.push(`@title ${dashes(titleCase(title).replace(/\s+-\s+/g, ' - '))}`);
if (metaTitle) out.push(`@meta-title ${metaTitle}`);
if (metaDescription) out.push(`@meta-description ${metaDescription}`);
const ids = new Set();
const uid = (s) => { let id = slug(s) || 'section'; for (let n = 2; ids.has(id); n++) id = `${slug(s)}-${n}`; ids.add(id); return id; };
let first = true;
for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  if (b.t === 'caps' || b.t === 'sec' || (b.t === 'head' && first)) {
    let eyebrow = '';
    let heading;
    if (b.t === 'caps' && (blocks[i + 1]?.t === 'head' || blocks[i + 1]?.t === 'sec')) { eyebrow = titleCase(b.s); heading = blocks[++i].s; if (norm(eyebrow).toLowerCase() === norm(titleCase(title)).toLowerCase()) eyebrow = ''; }
    else heading = b.t === 'caps' ? titleCase(b.s) : b.s;
    heading = dashes(heading);
    out.push(`## ${uid(heading)} | ${eyebrow} | ${heading} | ${eyebrow ? `${eyebrow} – ${heading}` : heading}`);
    if (first) { out.push('@intro'); }
    first = false;
    continue;
  }
  if (b.t === 'head') {
    // run of sub-headings each followed by exactly one paragraph -> cards; otherwise sub-headings
    const one = !!b.card;
    out.push(`${one ? '###' : '####'} ${dashes(b.s)}`);
    continue;
  }
  if (b.t === 'li') { out.push(`- ${dashes(b.s)}`); continue; }
  out.push(dashes(b.s));
}
if (refs.length) { out.push('@references'); for (const r of refs) out.push(`- ${r}`); }
fs.writeFileSync(outFile, `${out.join('\n')}\n`);
console.log(outFile.split('/').pop(), blocks.length, 'blocks');
