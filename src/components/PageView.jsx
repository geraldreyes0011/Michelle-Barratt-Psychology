import { useLocation, useNavigate } from 'react-router-dom';
import { img, localiseImages, pageHero, therapyHeroImages } from '../data/site.js';
import {
  backgroundHero, compactSpacing, isCompactPath, recolour, servicesIndex, splitHero, therapyTopic,
} from '../lib/transforms.js';
import Faq from './Faq.jsx';
import ContactForm from './ContactForm.jsx';
import HomeServices from './HomeServices.jsx';
import RelatedTopics from './RelatedTopics.jsx';

// Interactive pieces embedded in page HTML as <div data-mbp="name"></div> (top-level only:
// each HTML part between widgets is rendered on its own, so a widget cannot sit inside a container).
const WIDGETS = {
  faq: Faq,
  'contact-form': ContactForm,
  services: HomeServices,
  related: RelatedTopics,
};

function HeroImage({ image }) {
  if (!image) return null;
  return (
    <div className="w-full">
      <img src={img(image.src)} alt={image.alt} fetchpriority="high" className="w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] object-cover rounded-lg shadow-2xl" />
    </div>
  );
}

// Renders reference-site page HTML: applies the reference transforms, then the requested updates,
// mounts widgets, and routes internal link clicks through the SPA router.
export default function PageView({ html, className }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const path = pathname.replace(/\/+$/, '') || '/';

  let source = html;
  const slug = path.match(/^\/therapy-services\/([^/]+)$/)?.[1];
  if (slug) source = therapyTopic(source, slug);
  if (path === '/therapy-services') source = servicesIndex(source);

  const heroImage = therapyHeroImages[path];
  const split = splitHero(source, heroImage?.src);
  const bgHero = split ? null : pageHero(path, source);
  const body = bgHero ? backgroundHero(source, bgHero) : source;
  const spacing = (h) => (isCompactPath(path) ? compactSpacing(h) : h);

  const render = (h) => recolour(localiseImages(h)).split(/<div data-mbp="([\w-]+)"><\/div>/).map((part, i) => {
    if (i % 2 === 0) return <div key={i} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: part }} />;
    const Widget = WIDGETS[part];
    return Widget ? <Widget key={i} /> : null;
  });

  const onClick = (e) => {
    // Expandable cards in page content (e.g. Online Therapy benefits): the button toggles its card.
    // Closing a card the pointer is still over also suppresses its hover preview until the pointer leaves.
    const toggle = e.target.closest?.('[data-expand]');
    if (toggle) {
      const card = toggle.closest('.expand-card');
      const open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      card.classList.toggle('is-dismissed', !open);
      toggle.setAttribute('aria-expanded', String(open));
      return;
    }
    const a = e.target.closest?.('a');
    const href = a?.getAttribute('href');
    if (!a || !href || !href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (/\.\w{2,4}$/.test(href)) return; // static files (PDFs, images)
    e.preventDefault();
    navigate(href);
  };

  return (
    <div
      className={className}
      onClick={onClick}
      onPointerOut={(e) => {
        const card = e.target.closest?.('.expand-card.is-dismissed');
        if (card && !card.contains(e.relatedTarget)) card.classList.remove('is-dismissed');
      }}
    >
      {split ? (
        <>
          <section className={recolour(split.sectionClass)}>
            <div className="mx-auto max-w-7xl px-5 py-8 md:py-10 grid gap-7 lg:gap-10 lg:grid-cols-[1.08fr_0.92fr] items-center">
              <div className="min-w-0">{render(split.innerHtml)}</div>
              <HeroImage image={heroImage} />
            </div>
          </section>
          {render(spacing(split.rest))}
        </>
      ) : render(spacing(body))}
    </div>
  );
}
