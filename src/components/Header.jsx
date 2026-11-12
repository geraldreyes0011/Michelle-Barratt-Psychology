import { useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, MapPin, Menu, Phone, X } from './Icons.jsx';
import { LOGO, PHONE, helpfulInfoGroups, img, topLinks } from '../data/site.js';
import { categoryHref, megaMenuColumns, therapyMenu } from '../data/therapyMenu.js';

export const cn = (...c) => c.filter(Boolean).join(' ');

// Hover/click dropdown with fade + 4px rise (reference: opacity/translate-y, 200ms).
function Dropdown({ label, children, panelClass = '' }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const ref = useRef(null);
  const panelRef = useRef(null);
  // Panels open from the button's left edge (reference); pull a wide panel back inside the viewport.
  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    const over = r.right - shift - (document.documentElement.clientWidth - 24);
    setShift(over > 0 ? -over : 0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className={cn('inline-flex items-center gap-1.5 text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.1em] 2xl:tracking-[0.14em] transition-colors py-2 whitespace-nowrap', open ? 'text-sun' : 'text-plum')}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div
        ref={panelRef}
        style={shift ? { marginLeft: shift } : undefined}
        className={cn('absolute left-0 top-full pt-3 z-50 transition-all duration-200', open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-1 invisible', panelClass)}
      >
        <div className="brand-dropdown bg-white border border-lilac rounded shadow-xl p-5" onClick={() => setOpen(false)}>
          {children}
        </div>
      </div>
    </div>
  );
}

const megaLinkClass = 'text-[14px] leading-snug text-ink/85 hover:text-rose transition-colors';

function MegaCategory({ category }) {
  return (
    <div>
      <Link to={categoryHref(category)} className="block font-heading text-lg font-semibold text-[#C32D70] leading-tight mb-2 hover:text-plum transition-colors">
        {category.title}
      </Link>
      <ul className="space-y-1.5">
        {category.links.map((l) => (
          <li key={l.to}><Link to={l.to} className={megaLinkClass}>{l.label}</Link></li>
        ))}
      </ul>
      {category.subgroup && (
        <div className="mt-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose mb-1.5">{category.subgroup.title}</p>
          <ul className="space-y-1.5 border-l border-lilac pl-3">
            {category.subgroup.links.map((l) => (
              <li key={l.to}><Link to={l.to} className={megaLinkClass}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const mobileTop = 'block py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-plum hover:text-rose';
const mobileLink = 'block py-1.5 text-[15px] text-ink/85 hover:text-rose';

function MobileSection({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-lilac">
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cn(mobileTop, 'w-full flex items-center justify-between')}>
        {label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-3 pl-3 space-y-1">{children}</div>}
    </div>
  );
}

function MobileNav({ onNavigate }) {
  return (
    <nav id="mobile-nav" aria-label="Mobile" className="min-[1440px]:hidden bg-soft border-t border-lilac max-h-[calc(100vh-7rem)] overflow-y-auto px-5 pb-6">
      <MobileSection label="Therapy Services">
        {therapyMenu.map((c) => (
          <div key={c.id} className="pt-2">
            <Link to={categoryHref(c)} onClick={onNavigate} className="block font-heading text-lg text-[#C32D70]">{c.title}</Link>
            {c.links.map((l) => <Link key={l.to} to={l.to} onClick={onNavigate} className={mobileLink}>{l.label}</Link>)}
            {c.subgroup && (
              <div className="pt-1 pl-3 border-l border-lilac">
                <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-rose">{c.subgroup.title}</p>
                {c.subgroup.links.map((l) => <Link key={l.to} to={l.to} onClick={onNavigate} className={mobileLink}>{l.label}</Link>)}
              </div>
            )}
          </div>
        ))}
        <Link to="/therapy-services" onClick={onNavigate} className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-rose">All Therapy Services</Link>
      </MobileSection>
      {topLinks.map(([label, to]) => (
        <Link key={to} to={to} onClick={onNavigate} className={cn(mobileTop, 'border-b border-lilac')}>{label}</Link>
      ))}
      <MobileSection label="Helpful Info">
        {helpfulInfoGroups.map((g) => (
          <div key={g.title} className="pt-2">
            <p className="font-heading text-lg text-plum">{g.title}</p>
            {g.links.map(([label, to]) => <Link key={to} to={to} onClick={onNavigate} className={mobileLink}>{label}</Link>)}
          </div>
        ))}
        <Link to="/helpful-info" onClick={onNavigate} className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-rose">All Helpful Info</Link>
      </MobileSection>
      <Link to="/practitioners" onClick={onNavigate} className="mt-5 inline-flex w-full items-center justify-center min-h-12 px-7 rounded text-[13px] font-semibold uppercase tracking-[0.12em] bg-rose text-white hover:bg-[#D84B83] transition-colors">
        Book Online
      </Link>
    </nav>
  );
}

// Top-level items: no hover colour; the current page's item is yellow.
const topLinkClass = ({ isActive }) => cn('text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.1em] 2xl:tracking-[0.14em] transition-colors py-2 whitespace-nowrap', isActive ? 'text-sun' : 'text-plum');

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);
  return (
    <header className="sticky top-0 z-50 bg-soft border-b border-lilac">
      <div className="bg-plum text-white text-[12px] tracking-wide">
        <div className="mx-auto max-w-[1800px] px-6 lg:px-10 h-9 flex items-center justify-between">
          <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-sun" /> Toowong · Manly-West · Online</span>
          <a href={PHONE.href} className="flex items-center gap-2 hover:underline"><Phone className="h-3.5 w-3.5 text-sun" /> {PHONE.label}</a>
        </div>
      </div>
      <div className="mx-auto max-w-[1800px] px-5 lg:px-8 2xl:px-10 h-20 flex items-center justify-between gap-6 2xl:gap-10">
        <Link to="/" onClick={close} aria-label="Michelle Barratt Psychology home" className="flex items-center gap-3 shrink-0">
          <img src={img(LOGO)} alt="" width="64" height="64" className="h-16 w-16 object-contain" />
          <span className="text-center">
            <span className="brand-dark block font-heading text-[18px] md:text-[20px] 2xl:text-[22px] font-semibold leading-[1.15]">
              <span className="brand-pink">M</span>ichelle <span className="brand-pink">B</span>arratt<br className="sm:hidden" /> <span className="brand-pink">P</span>sychology
            </span>
            <span className="brand-dark brand-subtitle block font-heading uppercase">
              &amp; Administration Services – <span className="brand-pink font-semibold">MBP</span>
            </span>
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden min-[1440px]:flex items-center gap-4 2xl:gap-7">
          <Dropdown label="Therapy Services" panelClass="mega-panel">
            <div className="grid grid-cols-5 gap-6">
              {megaMenuColumns.map((col, i) => (
                <div key={i} className="space-y-5">
                  {col.map((idx) => <MegaCategory key={therapyMenu[idx].id} category={therapyMenu[idx]} />)}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-lilac">
              <Link to="/therapy-services" className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-plum hover:text-rose transition-colors">
                All Therapy Services
              </Link>
            </div>
          </Dropdown>
          {topLinks.map(([label, to]) => <NavLink key={to} to={to} className={topLinkClass}>{label}</NavLink>)}
          <Dropdown label="Helpful Info" panelClass="right-0 left-auto w-[min(900px,calc(100vw-3rem))]">
            <div className="grid grid-cols-3 gap-7">
              {helpfulInfoGroups.map((g) => (
                <div key={g.title}>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-rose mb-2">{g.title}</p>
                  <ul className="divide-y divide-lilac">
                    {g.links.map(([label, to]) => (
                      <li key={to}><Link to={to} className="block py-2.5 text-[14px] leading-snug text-ink/85 hover:text-plum transition-colors">{label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-lilac">
              <Link to="/helpful-info" className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-plum hover:text-rose transition-colors">All Helpful Info</Link>
            </div>
          </Dropdown>
          <Link to="/practitioners" className="inline-flex items-center justify-center min-h-12 px-5 2xl:px-7 rounded whitespace-nowrap text-[12px] 2xl:text-[13px] font-semibold uppercase tracking-[0.12em] bg-rose text-white hover:bg-[#D84B83] transition-colors duration-300">
            Book Online
          </Link>
        </nav>
        <button
          type="button"
          className="min-[1440px]:hidden h-12 w-12 flex items-center justify-center text-plum"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && <MobileNav onNavigate={close} />}
    </header>
  );
}
