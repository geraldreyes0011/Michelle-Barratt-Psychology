import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin, Menu, Phone, X } from './Icons.jsx';
import { LOGO, PHONE, helpfulInfoGroups, img, topLinks } from '../data/site.js';
import { therapyMenu } from '../data/therapyMenu.js';

export const cn = (...c) => c.filter(Boolean).join(' ');

// Dropdown links are listed A-Z by displayed name; group order is set explicitly below.
const az = (a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0);
// Fees, Funding & Referrals lives under Helpful Info in the menus (its pages and URLs are unchanged).
const FEES_GROUP = 'Fees, Funding & Referrals';
const feesGroup = therapyMenu.flatMap((c) => c.subgroups ?? []).find((g) => g.title === FEES_GROUP);
// Topics and Blogs sit in Client Resources instead of the top bar.
const movedToClientResources = [['All Topics', '/topics'], ['Blogs', '/blog']];
const movedTopLinks = new Set(movedToClientResources.map(([, to]) => to));
const navTopLinks = topLinks.filter(([, to]) => !movedTopLinks.has(to));

const helpfulInfoOrder = ['Policies', 'Client Resources', FEES_GROUP, 'Mental Health Information'];
const helpfulInfoMenu = [
  ...helpfulInfoGroups.map((g) => (g.title === 'Client Resources' ? { ...g, links: [...g.links, ...movedToClientResources] } : g)),
  ...(feesGroup ? [{ title: FEES_GROUP, links: feesGroup.links.map((l) => [l.label, l.to]) }] : []),
]
  .map((g) => ({ ...g, links: [...g.links].sort((x, y) => az(x[0], y[0])) }))
  .sort((x, y) => helpfulInfoOrder.indexOf(x.title) - helpfulInfoOrder.indexOf(y.title));

// Navigation order set by the client (menus only; the Therapy Services page keeps its own order).
const therapyMenuOrder = [
  'children-and-adolescent-therapy',
  'individual-and-adult-therapy',
  'relationships-and-family-therapy',
  'trauma-and-ptsd-therapy',
  'complex-clinical-therapy',
  'types-of-therapy',
];
const navTherapyMenu = [...therapyMenu]
  .sort((a, b) => therapyMenuOrder.indexOf(a.id) - therapyMenuOrder.indexOf(b.id))
  .map((c) => ({ ...c, subgroups: (c.subgroups ?? []).filter((g) => g.title !== FEES_GROUP) }));

// Hover/click dropdown with fade + 4px rise (reference: opacity/translate-y, 200ms).
function Dropdown({ label, children, panelClass = '', onDoubleClick }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const ref = useRef(null);
  const panelRef = useRef(null);
  // A short grace period before closing, so a diagonal move from the trigger to the panel
  // (which briefly leaves both) does not close and reopen it.
  const closeTimer = useRef(null);
  const cancelClose = () => clearTimeout(closeTimer.current);
  useEffect(() => cancelClose, []);
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
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={() => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 200); }}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onDoubleClick={onDoubleClick && (() => { cancelClose(); setOpen(false); onDoubleClick(); })}
        className={cn('nav-anim inline-flex items-center gap-1.5 text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.1em] 2xl:tracking-[0.14em] transition-colors py-2 whitespace-nowrap', open ? 'text-sun' : 'text-plum')}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div
        ref={panelRef}
        style={shift ? { marginLeft: shift } : undefined}
        className={cn('absolute left-0 top-full pt-3 z-50 transition-all duration-200', open ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-1 invisible', panelClass)}
      >
        {/* Following a link closes the panel; expand/collapse buttons inside it do not. */}
        <div className="brand-dropdown bg-white border border-lilac rounded shadow-xl p-5" onClick={(e) => { if (e.target.closest('a')) setOpen(false); }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const megaLinkClass = 'text-[14px] leading-snug text-ink/85 hover:text-rose transition-colors';

// Therapy Services mega-menu: six category headings in one row of columns (Types of Therapy in
// its own column). Hovering a heading reveals its services in a nested dropdown beneath it; on
// touch screens and keyboards the heading toggles it. Secondary categories inside a dropdown expand
// and collapse on click/tap/Enter. Services open their own page in a new tab.
// Styles: .mega-grid / .mega-heading / .mega-flyout / .mega-sub in additions.css.
function MegaLinks({ links }) {
  // The page being viewed is marked so its link shows the highlighted (active) state.
  const { pathname } = useLocation();
  return (
    <ul className="mega-list">
      {links.map((l) => (
        <li key={l.label}><Link to={l.to} target="_blank" rel="noopener" className={cn('dd-item', megaLinkClass, !l.hash && l.to === pathname && 'is-current')}>{l.label}</Link></li>
      ))}
    </ul>
  );
}

// A secondary category inside a category dropdown. With a mouse, resting on it for a moment opens
// its list (it stays open while the pointer moves into the list, so nothing jumps or disappears);
// click / tap / Enter toggles it. Lists close when their category dropdown changes or closes.
function MegaSubgroup({ id, group, open, onToggle, onHoverOpen }) {
  const intent = useRef(null);
  const hoverOpenedAt = useRef(0);
  useEffect(() => () => clearTimeout(intent.current), []);
  // A click that lands just after hover opened the list confirms it rather than closing it again.
  const onClick = () => {
    clearTimeout(intent.current);
    if (open && Date.now() - hoverOpenedAt.current < 700) { hoverOpenedAt.current = 0; return; }
    onToggle();
  };
  return (
    <div
      className="mega-subgroup"
      onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !open) intent.current = setTimeout(() => { hoverOpenedAt.current = Date.now(); onHoverOpen(); }, 120); }}
      onPointerLeave={() => clearTimeout(intent.current)}
    >
      <button type="button" className="mega-sub-toggle" aria-expanded={open} aria-controls={id} onClick={onClick}>
        <span>{group.title}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div id={id} className={cn('mega-sub', open && 'is-open')}>
        <div><div className="mega-sub-list"><MegaLinks links={group.links} /></div></div>
      </div>
    </div>
  );
}

function TherapyMegaMenu() {
  const [openId, setOpenId] = useState(null);
  const [openSubs, setOpenSubs] = useState(() => new Set());
  // Short grace period before closing, so brushing past a gap does not flicker the list.
  const timer = useRef(null);
  const cancel = () => clearTimeout(timer.current);
  useEffect(() => cancel, []);
  // Switching category starts its secondary categories collapsed.
  const show = (id) => setOpenId((cur) => { if (cur !== id) setOpenSubs(new Set()); return id; });
  const toggleSub = (key) => setOpenSubs((cur) => { const next = new Set(cur); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  const openSub = (key) => setOpenSubs((cur) => (cur.has(key) ? cur : new Set(cur).add(key)));
  return (
    <div className="mega-grid">
      {navTherapyMenu.map((c, i) => {
        const open = openId === c.id;
        const listId = `mega-${c.id}`;
        return (
          <div
            key={c.id}
            className={cn('relative', i >= navTherapyMenu.length - 2 && 'mega-end')}
            onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; cancel(); show(c.id); }}
            onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; cancel(); timer.current = setTimeout(() => setOpenId((id) => (id === c.id ? null : id)), 150); }}
          >
            <button
              type="button"
              className="mega-heading flex w-full items-start justify-between gap-2 py-1 text-left font-heading text-lg font-semibold leading-tight text-[#C32D70]"
              aria-expanded={open}
              aria-controls={listId}
              onClick={(e) => { cancel(); if (e.nativeEvent.pointerType === 'mouse' || !open) show(c.id); else setOpenId(null); }}
            >
              <span>{c.title}</span>
              <ChevronDown className={cn('mt-1 h-3.5 w-3.5 shrink-0 transition-transform duration-200', open && 'rotate-180')} />
            </button>
            <div id={listId} className={cn('mega-flyout', open && 'is-open')}>
              {c.links.length > 0 && <MegaLinks links={c.links} />}
              {(c.subgroups ?? []).map((g) => {
                const key = `${c.id}:${g.title}`;
                return <MegaSubgroup key={key} id={`mega-${c.id}-${g.title.toLowerCase().replace(/[^a-z]+/g, '-')}`} group={g} open={openSubs.has(key)} onToggle={() => toggleSub(key)} onHoverOpen={() => openSub(key)} />;
              })}
            </div>
          </div>
        );
      })}
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

// Nested tap-to-expand group inside the mobile menu (therapy categories and their secondary categories).
function MobileGroup({ title, level = 1, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={level === 1 ? 'pt-2' : 'pt-1 pl-3 border-l border-lilac'}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn('w-full flex items-center justify-between gap-3 text-left', level === 1 ? 'py-1.5 font-heading text-lg text-[#C32D70]' : 'py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-rose')}
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-1">{children}</div>}
    </div>
  );
}

function MobileNav({ onNavigate }) {
  return (
    <nav id="mobile-nav" aria-label="Mobile" className="min-[1440px]:hidden bg-soft border-t border-lilac max-h-[calc(100vh-7rem)] overflow-y-auto px-5 pb-6">
      <MobileSection label="Therapy Services">
        {navTherapyMenu.map((c) => (
          <MobileGroup key={c.id} title={c.title}>
            {c.links.map((l) => <Link key={l.label} to={l.to} onClick={onNavigate} className={mobileLink}>{l.label}</Link>)}
            {(c.subgroups ?? []).map((g) => (
              <MobileGroup key={g.title} title={g.title} level={2}>
                {g.links.map((l) => <Link key={l.label} to={l.to} onClick={onNavigate} className={mobileLink}>{l.label}</Link>)}
              </MobileGroup>
            ))}
          </MobileGroup>
        ))}
        <Link to="/therapy-services" onClick={onNavigate} className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-rose">All Therapy Services</Link>
      </MobileSection>
      {navTopLinks.map(([label, to]) => (
        <Link key={to} to={to} onClick={onNavigate} className={cn(mobileTop, 'border-b border-lilac')}>{label}</Link>
      ))}
      <MobileSection label="Helpful Info">
        {helpfulInfoMenu.map((g) => (
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

// Top-level items: the current page's item is yellow; hover yellow comes from .nav-anim (additions.css).
const topLinkClass = ({ isActive }) => cn('nav-anim text-[11px] 2xl:text-[12px] font-semibold uppercase tracking-[0.1em] 2xl:tracking-[0.14em] transition-colors py-2 whitespace-nowrap', isActive ? 'text-sun' : 'text-plum');

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 bg-soft border-b border-lilac">
      <div className="bg-plum text-white text-[12px] tracking-wide">
        <div className="relative mx-auto max-w-[1800px] px-6 lg:px-10 h-9 flex items-center justify-between">
          <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-sun" /> Toowong · Manly-West · Online<span className="brand-branch" aria-hidden="true" /></span>
          <a href={PHONE.href} className="flex items-center gap-2 hover:underline"><Phone className="h-3.5 w-3.5 text-sun" /> {PHONE.label}</a>
        </div>
      </div>
      <div className="header-row mx-auto max-w-[1800px] px-5 lg:px-8 2xl:px-10 flex items-center justify-between gap-6 2xl:gap-10">
        <Link to="/" onClick={close} aria-label="Michelle Barratt Psychology home" className="flex items-center gap-3 shrink-0">
          <img src={img(LOGO)} alt="" width="100" height="100" className="brand-logo object-contain" />
          <span className="text-center">
            <span className="brand-dark brand-name block font-heading font-semibold leading-[1.15]">
              <span className="brand-pink">M</span>ichelle <span className="brand-pink">B</span>arratt<br className="sm:hidden" /> <span className="brand-pink">P</span>sychology
            </span>
            <span className="brand-dark brand-subtitle block font-heading uppercase">
              &amp; Administration Services – <span className="brand-pink brand-mbp">MBP</span>
            </span>
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden min-[1440px]:flex items-center gap-4 2xl:gap-7">
          {/* Double-click goes straight to the Therapy Services overview page. */}
          <Dropdown label="Therapy Services" panelClass="mega-panel" onDoubleClick={() => navigate('/therapy-services')}>
            <TherapyMegaMenu />
            <div className="mt-4 pt-4 border-t border-lilac">
              <Link to="/therapy-services" className="dropdown-label inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]">
                All Therapy Services
              </Link>
            </div>
          </Dropdown>
          {navTopLinks.map(([label, to]) => <NavLink key={to} to={to} className={topLinkClass}>{label}</NavLink>)}
          <Dropdown label="Helpful Info" panelClass="right-0 left-auto helpful-panel">
            <div className="helpful-grid">
              {helpfulInfoMenu.map((g) => (
                <div key={g.title}>
                  <p className={cn('dropdown-label text-[12px] font-semibold uppercase tracking-[0.14em] mb-2', g.links.some(([, to]) => to === pathname) && 'is-current')}>{g.title}</p>
                  <ul className="divide-y divide-lilac">
                    {g.links.map(([label, to]) => (
                      <li key={to}><Link to={to} className={cn('dd-item block py-2.5 text-[14px] leading-snug text-ink/85 hover:text-plum transition-colors', to === pathname && 'is-current')}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-lilac">
              <Link to="/helpful-info" className="dropdown-label inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]">All Helpful Info</Link>
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
