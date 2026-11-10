// Usage: node shoot.mjs <outDir> <width> <path> [path...]  (env: REF=1 also shoots the reference site)
// Screenshots pages of the local build (http://localhost:4173) and optionally the Base44 reference,
// using the installed Microsoft Edge. Special path "menu:/" opens the Therapy Services mega-menu,
// "mobilemenu:/" opens the mobile menu and the Therapy Services section.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [, , outDir, width, ...paths] = process.argv;
mkdirSync(outDir, { recursive: true });
const sites = { local: 'http://localhost:4173', ...(process.env.REF ? { ref: 'https://michelle-barratt-psychology1.base44.app' } : {}) };

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
for (const [site, base] of Object.entries(sites)) {
  for (const raw of paths) {
    const [mode, path] = raw.includes(':/') ? raw.split(':') : ['page', raw];
    await page.goto(base + path, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(600);
    const name = `${site}_${width}_${mode}_${path.replace(/[^a-z0-9]+/gi, '_') || 'home'}.png`;
    if (mode === 'menu') {
      await page.getByRole('button', { name: 'Therapy Services' }).first().hover();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${outDir}/${name}` });
    } else if (mode === 'mobilemenu') {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('button', { name: 'Therapy Services' }).click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
    } else {
      await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
    }
    console.log(name);
  }
}
await browser.close();
