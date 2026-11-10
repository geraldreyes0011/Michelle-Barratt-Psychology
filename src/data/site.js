// Reference-site data (extracted verbatim from the Base44 bundle by _build/tools/extract-bundle-data.mjs)
// plus the hero images for generated topic pages and the local enhanced-image map.
import reference from './reference.json';
import generatedHeroImages from './generatedHeroImages.json';
import imageMap from './imageMap.json';

export const {
  legacyTherapyMenu, // original five-group menu; still drives the homepage "How Can Psychology Help?" cards
  topLinks,
  helpfulInfoGroups,
  helpfulInfoPages,
  homeServiceMeta,
  pageHeroImages,
  footerHtml,
} = reference;

export const therapyHeroImages = { ...reference.therapyHeroImages, ...generatedHeroImages };

export const LOGO = 'https://michellebarrattpsychology.com.au/wp-content/uploads/2019/08/logo.png';
export const PHONE = { href: 'tel:0731850040', label: '07 3185 0040' };
export const ADMIN_EMAIL = 'admin@michellebarrattpsychology.com.au';

// Remote original -> local enhanced copy (filled by _build/tools/enhance-images.mjs).
export const img = (src) => (src && imageMap[src]) || src;

export function localiseImages(html) {
  return html.replace(/(src|href)="(https:\/\/[^"]+\.(?:jpe?g|png|webp|gif))"/gi, (m, attr, url) => {
    const local = imageMap[url.replace(/&amp;/g, '&')];
    return local ? `${attr}="${local}"` : m;
  });
}

// Hero lookup used by non-therapy pages (reference heroImages chunk): fixed map, then a blog post's first image.
export function pageHero(path, html) {
  const hit = pageHeroImages[path];
  if (hit) return hit;
  if (path.startsWith('/blog/')) {
    const m = /<img[^>]*src="([^"]+)"/.exec(html || '');
    if (m) return { src: m[1], alt: '' };
  }
  return null;
}
