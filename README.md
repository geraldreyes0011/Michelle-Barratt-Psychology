# Michelle Barratt Psychology website

A replica of the Base44 MBP site (https://michelle-barratt-psychology1.base44.app/) with the
seven-category Therapy Services menu, new topic pages and locally hosted, enhanced images.

## Run

```
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
npm run preview   # serve dist/ on http://localhost:4173
```

Deploy `dist/` to any static host. Every route is client-side, so the host must serve
`index.html` for unknown paths: `public/_redirects` covers Netlify, `vercel.json` covers Vercel.

## Contact form

The reference site posted enquiries to a Base44 server function, which this build cannot use.
Set `VITE_CONTACT_ENDPOINT` (in `.env` or the host's environment) to any URL that accepts a JSON
POST (Formspree, Web3Forms, a serverless function) to send enquiries directly. Without it the
form opens the visitor's email app with the message addressed to admin@michellebarrattpsychology.com.au.

## Where things live

| What | Where |
|---|---|
| Therapy Services menu (7 categories, Wellbeing subgroup, column layout) | `src/data/therapyMenu.js` |
| Page content, one file per page (`{ title, description, html }`) | `src/data/pages/*.json` |
| Reference menus, Helpful Info pages, footer, hero-image maps | `src/data/reference.json` |
| Local enhanced image map (remote URL → `/images/...`) | `src/data/imageMap.json` |
| Page renderer and the reference's HTML transforms | `src/components/PageView.jsx`, `src/lib/transforms.js` |
| Reference compiled CSS (verbatim) and the few added rules | `src/styles/reference.css`, `src/styles/additions.css` |

### Adding an article to a blank topic page

Blank topic pages are `src/data/pages/therapy-services__<slug>.json` with `"generated": true`.
Either paste the article HTML (using the same section/heading/list markup as other therapy pages)
in place of the `<!-- Page body intentionally empty ... -->` comment, or add the topic's source to
`MIGRATED` in `_build/tools/build-topics.mjs` and rerun it (see below).

## Build tooling (`_build/`)

Not part of the site. Source captures and the scripts that produced the data:

- `source-data/` – captured Base44 bundle and page chunks, original WordPress pages
- `tools/extract-bundle-data.mjs` – reference menus/Helpful Info/footer → `src/data/reference.json`
- `tools/convert-chunks.mjs` – Base44 page chunks → `src/data/pages/*.json`
- `tools/build-topics.mjs` – migrated and blank topic pages (+ `_build/topic-report.json`)
- `tools/collect-images.mjs`, `tools/enhance-images.mjs` – image download + Real-ESRGAN enhancement
- `tools/check-links.mjs`, `tools/check-classes.mjs`, `tools/shoot.mjs`, `tools/diff-shots.mjs` – verification

Run tools from `_build/tools` (they use its `node_modules`), e.g. `node build-topics.mjs ../..`.
