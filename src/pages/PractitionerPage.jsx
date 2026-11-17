import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Phone } from '../components/Icons.jsx';
import { PhotoHero } from './HelpfulInfoIndex.jsx';
import NotFound from './NotFound.jsx';
import { PHONE, img } from '../data/site.js';
import { HALAXY_LOGO, practitioners } from '../data/practitioners.js';
import { usePageMeta } from '../lib/usePageMeta.js';

// Individual practitioner profile (/practitioners/:slug). Layout and classes follow the Helpful Info
// detail page (photo hero, article + sticky sidebar); the sidebar card mirrors the practitioner cards.

const HERO = { src: 'https://michellebarrattpsychology.com.au/wp-content/uploads/2023/04/Michelle-Barratt-Psychology-Team-Photo-min.png', alt: 'The Michelle Barratt Psychology team' };
const btn = 'inline-flex items-center justify-center min-h-12 px-7 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300';
const bookBtn = `${btn} bg-rose text-white hover:bg-[#D84B83]`;

function BookingButton({ p, className = '' }) {
  if (!p.booking) return null;
  return (
    <a href={p.booking} target="_blank" rel="noopener noreferrer" className={`${bookBtn} ${className}`}>
      Book an Appointment
    </a>
  );
}

function ProfileCard({ p }) {
  return (
    <div className="bg-white rounded border border-lilac flex flex-col overflow-hidden">
      <div className="pt-6 flex justify-center">
        <span className="prac-photo prac-photo-lg">
          <img src={img(p.photo)} alt={`${p.name}, ${p.title}`} className="prac-photo-img" />
        </span>
      </div>
      <div className="p-5 flex flex-col items-center text-center gap-2.5">
        <div>
          <p className="font-heading text-2xl font-semibold leading-tight text-plum">{p.name}</p>
          <p className="text-[14px] text-ink/75 mt-0.5">{p.title}</p>
        </div>
        {p.badges.map((b) => (
          <span key={b} className="bg-blush text-plum text-[11px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full">{b}</span>
        ))}
        <div className="space-y-1 pt-0.5">
          {p.details.map(([label, value]) => (
            <div key={label} className="flex justify-center gap-1.5 text-[14px] leading-snug">
              <span className="font-semibold text-plum shrink-0">{label}:</span>
              <span className="text-ink/80">{value}</span>
            </div>
          ))}
        </div>
        {p.note && <p className="text-[14px] italic text-rose font-medium">{p.note}</p>}
        <div className="pt-3 space-y-3 self-stretch">
          {p.booking ? (
            <>
              <BookingButton p={p} className="w-full text-center" />
              {p.bookingNote && <p className="text-[13px] leading-snug text-ink/75">{p.bookingNote}</p>}
              <p className="flex items-center justify-center gap-2 text-[12px] text-ink/70">
                Online bookings via
                <img src={HALAXY_LOGO} alt="Halaxy" loading="lazy" className="halaxy-logo" />
              </p>
            </>
          ) : (
            <Link to="/contact" className={`${bookBtn} w-full text-center`}>Contact Us</Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.h) return <h2 key={i} className={`text-[24px] md:text-[28px] font-semibold leading-tight mb-3 ${i ? 'mt-10' : ''}`}>{b.h}</h2>;
    if (b.list) {
      return (
        <ul key={i} className={`profile-list mb-6 ${b.list.length > 8 ? 'profile-list-wide' : ''}`}>
          {b.list.map((item, j) => (
            <li key={j} className="flex gap-3 items-start text-[15px] leading-relaxed text-ink/85">
              <Check className="h-5 w-5 text-ocean shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p key={i} className="text-[16px] leading-relaxed text-ink/85 mb-4">{b.p}</p>;
  });
}

export default function PractitionerPage() {
  const { slug } = useParams();
  const p = practitioners[slug];
  const intro = p?.profile.find((b) => b.p)?.p || '';
  usePageMeta(`${p ? `${p.name} | ${p.title}` : 'Practitioners'} | Michelle Barratt Psychology`, intro.slice(0, 160));
  if (!p) return <NotFound />;

  return (
    <div>
      <PhotoHero image={HERO}>
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-white/75">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li><Link to="/practitioners" className="hover:text-white">Practitioners</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
            <li className="text-white/90">{p.name}</li>
          </ol>
        </nav>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85 mb-3">{p.title}</p>
        <h1 className="text-white text-[32px] md:text-[44px] font-semibold leading-[1.08] max-w-3xl">{p.name}</h1>
        <div className="h-[3px] w-16 bg-sun my-5" aria-hidden="true" />
        <div className="mt-6 flex flex-wrap gap-3">
          {p.booking
            ? <BookingButton p={p} />
            : <Link to="/contact" className={`${btn} bg-white text-plum hover:bg-blush`}>Contact Us</Link>}
          <Link to="/practitioners" className={`${btn} border border-white/70 text-white hover:bg-white/10`}>All Practitioners</Link>
        </div>
      </PhotoHero>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          <article>
            <Blocks blocks={p.profile} />
            <div className="mt-10 rounded-lg bg-blush p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="font-heading text-2xl font-semibold text-plum">Still have questions?</p>
                <p className="text-[15px] text-ink/80 mt-1">Our administration team can help with appointments, fees and choosing a practitioner.</p>
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
            <ProfileCard p={p} />
            <Link to="/practitioners" className="group inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-rose">
              All Practitioners
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <span className="profile-deco" aria-hidden="true" />
          </aside>
        </div>
      </section>
    </div>
  );
}
