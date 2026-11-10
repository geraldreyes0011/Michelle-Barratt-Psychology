import { Link } from 'react-router-dom';
import { ArrowRight } from './Icons.jsx';
import { homeServiceMeta, img, legacyTherapyMenu } from '../data/site.js';

// Homepage "How Can Psychology Help?" section. Kept exactly as on the reference site:
// it uses the original five service groups so the homepage is unchanged by the menu update.
function GroupCard({ group, meta, index }) {
  return (
    <article className="grid lg:grid-cols-[1.08fr_0.92fr] items-stretch rounded-lg overflow-hidden bg-gradient-to-br from-plum to-ink text-white">
      <div className="p-6 md:p-8 flex flex-col justify-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 mb-2">
          {String(index + 1).padStart(2, '0')} · {group.links.length} Services
        </p>
        <h3 className="text-white text-[26px] md:text-[32px] font-semibold leading-[1.1]">{group.title}</h3>
        <div className="h-[3px] w-14 bg-sun my-4" aria-hidden="true" />
        <p className="text-[15px] md:text-[16px] leading-relaxed text-white/90 max-w-xl">{meta.text}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {group.links.map(([label, to]) => (
            <li key={to}>
              <Link to={to} className="group inline-flex items-center gap-2 min-h-11 px-4 rounded border border-white/70 text-[12px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-white hover:text-plum transition-colors duration-200">
                <span>{label}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-3 md:p-4 flex">
        <img src={img(meta.img)} alt={meta.alt} className="w-full aspect-[4/3] lg:aspect-auto lg:h-full min-h-[240px] object-cover rounded" />
      </div>
    </article>
  );
}

export default function HomeServices() {
  return (
    <section className="bg-lilac">
      <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="mb-6 max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-2.5 text-rose">Support for life's challenges</p>
          <h2 className="text-[30px] md:text-[42px] font-semibold leading-[1.1]">How Can Psychology Help?</h2>
          <div className="h-[3px] w-14 bg-sun mt-4" aria-hidden="true" />
          <p className="mt-4 text-[16px] text-ink/85">Life presents different challenges at different stages. Our practitioners provide support across a broad range of psychological concerns.</p>
        </div>
        <div className="space-y-4">
          {legacyTherapyMenu.map((g, i) => <GroupCard key={g.title} group={g} meta={homeServiceMeta[g.title]} index={i} />)}
        </div>
        <div className="mt-7">
          <Link to="/therapy-services" className="inline-flex items-center justify-center min-h-12 px-7 rounded whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] bg-plum text-white hover:bg-[#1C302D] transition-colors duration-300">
            View All Therapy Services
          </Link>
        </div>
      </div>
    </section>
  );
}
