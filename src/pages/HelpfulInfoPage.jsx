import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Phone } from '../components/Icons.jsx';
import { PhotoHero } from './HelpfulInfoIndex.jsx';
import NotFound from './NotFound.jsx';
import { PHONE, helpfulInfoGroups, helpfulInfoPages, pageHero } from '../data/site.js';
import { usePageMeta } from '../lib/usePageMeta.js';

function Directory({ current }) {
  return (
    <nav aria-label="Helpful Info directory" className="rounded-lg bg-white border border-lilac p-6">
      <p className="font-heading text-2xl font-semibold text-plum mb-4">Helpful Info</p>
      <div className="space-y-5">
        {helpfulInfoGroups.map((g) => (
          <div key={g.title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose mb-2">{g.title}</p>
            <ul className="space-y-1">
              {g.links.map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={to === current ? 'page' : undefined}
                    className={to === current ? 'block py-1 text-[14px] text-plum font-semibold' : 'block py-1 text-[14px] text-ink/80 hover:text-rose transition-colors'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default function HelpfulInfoPage() {
  const { slug } = useParams();
  const page = helpfulInfoPages[slug];
  usePageMeta(`${page?.title || 'Helpful Info'} | Michelle Barratt Psychology`, (page?.intro || '').slice(0, 160));
  if (!page) return <NotFound />;
  const path = `/helpful-info/${slug}`;

  return (
    <div>
      <PhotoHero image={pageHero(path)}>
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-white/75">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li><Link to="/helpful-info" className="hover:text-white">Helpful Info</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li className="text-white/90">{page.title}</li>
          </ol>
        </nav>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 mb-3">{page.eyebrow}</p>
        <h1 className="text-white text-[32px] md:text-[44px] font-semibold leading-[1.08] max-w-3xl">{page.title}</h1>
        <div className="h-[3px] w-16 bg-sun my-5" aria-hidden="true" />
        <p className="max-w-2xl text-[16px] md:text-[17px] text-white/95">{page.intro}</p>
      </PhotoHero>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          <article>
            {page.sections.map((s) => (
              <div key={s.heading} className="mb-8 last:mb-0">
                <h2 className="text-[24px] md:text-[28px] font-semibold leading-tight mb-3">{s.heading}</h2>
                {s.paragraphs?.map((p) => <p key={p.slice(0, 40)} className="text-[16px] leading-relaxed text-ink/85 mb-4">{p}</p>)}
                {s.list && (
                  <ul className="space-y-2.5 mt-4">
                    {s.list.map((item) => (
                      <li key={item.slice(0, 40)} className="flex gap-3 items-start text-[15px] leading-relaxed text-ink/85">
                        <Check className="h-5 w-5 text-ocean shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div className="mt-10 rounded-lg bg-blush p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="font-heading text-2xl font-semibold text-plum">Still have questions?</p>
                <p className="text-[15px] text-ink/80 mt-1">Our administration team can talk through anything on this page.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="inline-flex items-center justify-center min-h-12 px-6 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] bg-plum text-white hover:bg-[#1C302D] transition-colors duration-300">Contact Us</Link>
                <a href={PHONE.href} className="inline-flex items-center gap-2 min-h-12 px-6 rounded border border-plum/30 text-[13px] font-semibold uppercase tracking-[0.12em] text-plum hover:bg-white transition-colors">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {PHONE.label}
                </a>
              </div>
            </div>
          </article>
          <aside className="space-y-5 lg:sticky lg:top-28">
            <Directory current={path} />
            <Link to="/helpful-info" className="group inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-rose">
              All Helpful Info
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
