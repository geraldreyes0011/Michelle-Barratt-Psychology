import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from '../components/Icons.jsx';
import { PHONE, helpfulInfoGroups, img, pageHero } from '../data/site.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export function PhotoHero({ image, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-plum text-white">
      {image && <img src={img(image.src)} alt={image.alt} fetchpriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />}
      <div className="absolute inset-0 bg-gradient-to-r from-plum/95 via-plum/90 to-plum/45" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-12 md:py-16">{children}</div>
    </section>
  );
}

export default function HelpfulInfoIndex() {
  usePageMeta(
    'Helpful Info | Michelle Barratt Psychology',
    'Policies, client resources and mental health information from Michelle Barratt Psychology — cancellation, privacy, referrals, crisis support and wellbeing resources.',
  );
  return (
    <div>
      <PhotoHero image={pageHero('/helpful-info')}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 mb-3">Resources</p>
        <h1 className="text-white text-[32px] md:text-[44px] font-semibold leading-[1.08] max-w-3xl">Helpful Info</h1>
        <div className="h-[3px] w-16 bg-sun my-5" aria-hidden="true" />
        <p className="max-w-2xl text-[16px] md:text-[17px] text-white/95">
          Everything you need before your first appointment, in one place: how the practice runs, practical answers about referrals and support, and readable information about mental health and wellbeing.
        </p>
      </PhotoHero>
      <section className="bg-soft">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {helpfulInfoGroups.map((g) => (
              <div key={g.title} className="rounded-lg bg-white border border-lilac p-6 flex flex-col">
                <h2 className="text-[22px] md:text-[24px] font-semibold leading-tight">{g.title}</h2>
                <div className="h-[3px] w-10 bg-sun mt-3 mb-4" aria-hidden="true" />
                <p className="text-[15px] text-ink/80 mb-4">{g.blurb}</p>
                <ul className="divide-y divide-lilac">
                  {g.links.map(([label, to]) => (
                    <li key={to}>
                      <Link to={to} className="group flex items-center justify-between gap-3 py-2.5 text-[15px] text-ink/85 hover:text-rose transition-colors">
                        <span>{label}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-rose transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg bg-gradient-to-br from-plum to-ink text-white p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="max-w-2xl">
              <p className="font-heading text-[26px] md:text-[30px] font-semibold text-white leading-tight">Not sure where to start?</p>
              <p className="text-[15px] md:text-[16px] text-white/90 mt-2">Our administration team can answer questions about appointments, referrals, fees or which practitioner might suit you.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center justify-center min-h-12 px-7 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] bg-white text-plum hover:bg-blush transition-colors duration-300">Contact Us</Link>
              <a href={PHONE.href} className="inline-flex items-center gap-2 min-h-12 px-6 rounded border border-white/70 text-[13px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/10 transition-colors">
                <Phone className="h-4 w-4" aria-hidden="true" /> {PHONE.label}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
