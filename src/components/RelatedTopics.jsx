import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from './Icons.jsx';
import { allLinks, primaryCategory } from '../data/therapyMenu.js';

// "More in <category>" links at the foot of a therapy page, from the new menu structure.
// Same markup as the reference block (after its compact-spacing transform).
export default function RelatedTopics() {
  const { slug } = useParams();
  const category = primaryCategory(slug);
  if (!category) return null;
  const seen = new Set([slug]);
  const links = allLinks(category).filter((l) => !seen.has(l.slug) && seen.add(l.slug));
  if (!links.length) return null;
  return (
    <section className="bg-lilac !py-14">
      <div className="mx-auto max-w-7xl px-5 py-9 md:py-12 ">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-rose mb-4">More in {category.title}</p>
        <ul className="flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.slug}>
              <Link to={l.to} className="inline-flex items-center gap-2 bg-white border border-lilac rounded px-4 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-ocean hover:text-ocean">
                {l.label}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
