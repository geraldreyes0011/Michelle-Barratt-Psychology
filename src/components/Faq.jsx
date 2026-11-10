import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from './Icons.jsx';
import { cn } from './Header.jsx';

const link = 'text-ocean underline underline-offset-4 font-medium';

// Reference FAQ content (Base44 bundle `aw`).
const ITEMS = [
  { q: 'Do I Need a Referral to See a Psychologist?', a: 'No. You can book directly with a psychologist without a referral. However, if you wish to access Medicare rebates, you will generally require a Mental Health Treatment Plan from your GP.' },
  { q: 'Do You Offer Online Therapy Appointments?', a: 'Yes. Online Therapy appointments are available Australia-wide, allowing you to connect with an experienced psychologist from the comfort and privacy of your own home.' },
  {
    q: 'Can I Access Medicare Rebates?',
    a: <>In Australia, you can claim Medicare rebates for up to <strong>10 individual psychology sessions</strong> per calendar year (Jan 1 to Dec 31) under the <strong>Better Access</strong> initiative. [<a className={link} href="https://www.health.gov.au/our-work/better-access-initiative" target="_blank" rel="noopener noreferrer">1</a>]</>,
  },
  {
    q: 'Which Psychologist Is Right for Me?',
    a: <>Our administration team can discuss your needs and help connect you with a practitioner whose experience and areas of interest align with your goals. See our <a className={link} href="/practitioners">Practitioners</a> here.</>,
  },
  {
    q: 'How Much Do Psychologist Appointments Cost?',
    a: <>Fees vary depending on the practitioner and appointment type. Please email or call our team for advice or view the Book Online link on a practitioner’s profile to see current fee information. View more on our <a className={link} href="/practitioners">Practitioners</a></>,
  },
  { q: 'What Qualifications Should I Look For In A Psychologist?', a: 'Psychologists should be registered with the Psychology Board of Australia. Depending on your needs, you may also wish to consider a practitioner’s experience, areas of interest and therapeutic approach.' },
  { q: 'How Do I Know Whether I Need a Psychologist or Psychiatrist?', a: 'Psychologists provide assessment and therapy for a wide range of mental health concerns. Psychiatrists are medical doctors who can diagnose mental health conditions and prescribe medication. Depending on your circumstances, both professionals may play an important role in your care.' },
];

// Single, collapsible accordion with the reference's accordion-down/up height animation.
function Item({ item, index, open, onToggle }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(open);
  useLayoutEffect(() => {
    if (open) setMounted(true);
  }, [open]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.style.setProperty('--radix-accordion-content-height', `${el.scrollHeight}px`);
  });
  const id = `faq-${index}`;
  return (
    <div data-state={open ? 'open' : 'closed'} className="border-b border-plum/15 last:border-b-0">
      <h3 className="flex">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-controls={`${id}-content`}
          aria-expanded={open}
          data-state={open ? 'open' : 'closed'}
          onClick={onToggle}
          className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180 text-left font-heading text-lg md:text-[22px] font-medium leading-snug text-plum py-4 min-h-12 hover:no-underline hover:text-rose transition-colors"
        >
          {item.q}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </button>
      </h3>
      <div
        ref={ref}
        id={`${id}-content`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        data-state={open ? 'open' : 'closed'}
        hidden={!open && !mounted}
        onAnimationEnd={() => { if (!open) setMounted(false); }}
        className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      >
        <div className={cn('pb-4 pt-0', 'text-base text-ink/85 leading-relaxed')}>{item.a}</div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(null);
  return (
    <div className="w-full max-w-3xl mx-auto">
      {ITEMS.map((item, i) => (
        <Item key={item.q} item={item} index={i} open={open === i} onToggle={() => setOpen((o) => (o === i ? null : i))} />
      ))}
    </div>
  );
}
