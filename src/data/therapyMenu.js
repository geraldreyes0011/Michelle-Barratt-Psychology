// Therapy Services navigation: the client's six-category structure.
// Used by the desktop mega-menu, mobile menu, Therapy Services index, page eyebrows
// and "More in" links, and by _build/tools/build-topics.mjs. Plain ESM (no JSX) so Node can import it.
//
// - A topic that appears in several categories points at one canonical page (same slug).
// - `subgroups` are secondary categories, each with its own expandable list.
// - Links with a `hash` point at a section of another page (e.g. Anorexia -> Eating Disorders);
//   they are menu entries only, not pages of their own.
// - Categories, links and subgroups are sorted A-Z by displayed name (client requirement);
//   direct links come first, then subgroups, so the two are never interleaved.

const t = (label, slug, hash) => ({ label, slug, hash, to: `/therapy-services/${slug}${hash ? `#${hash}` : ''}` });

const byName = (a, b) => {
  const x = (a.label ?? a.title).toLowerCase();
  const y = (b.label ?? b.title).toLowerCase();
  return x < y ? -1 : x > y ? 1 : 0;
};
const sortCategory = (c) => ({
  ...c,
  links: [...c.links].sort(byName),
  subgroups: (c.subgroups ?? []).map((g) => ({ ...g, links: [...g.links].sort(byName) })).sort(byName),
});

export const therapyMenu = [
  {
    id: 'children-and-adolescent-therapy',
    title: 'Children & Adolescent Therapy',
    blurb: 'Support for younger clients, from childhood anxiety through to adolescent mental health.',
    links: [
      t('Child & Adolescent Therapy', 'child-adolescent-therapy'),
      t('ADHD Therapy for Children', 'adhd-therapy-children'),
      t('Child Anxiety', 'child-anxiety'),
      t('Adolescent Anxiety & Depression', 'adolescent-anxiety-depression'),
      t("Building a Child's Self-Esteem", 'child-self-esteem'),
      t('Bullying', 'bullying'),
      t('Emotional Dysregulation', 'emotional-dysregulation'),
      t('Grief & Loss', 'grief-loss'),
      t('Child & Adolescent Trauma', 'child-adolescent-trauma'),
      t('Oppositional Defiant Disorder (ODD)', 'oppositional-defiant-disorder'),
      t('PTSD – Children and Teenagers', 'ptsd-children-teenagers'),
    ],
  },
  {
    id: 'individual-and-adult-therapy',
    title: 'Individual & Adult Therapy',
    blurb: 'Therapy for adults, including trauma, stress, burnout and emotional regulation.',
    links: [
      t('Anxiety & Depression', 'adult-therapy'),
      t('ADHD Therapy & Assessment', 'adhd-therapy-assessment'),
      t('Burnout', 'burnout'),
      t('Christian Therapy', 'christian-counselling'),
      t('Emotional Regulation Therapy', 'emotional-regulation'),
      t('Conflict Management', 'conflict-management'),
      t('Stress Management Therapy', 'managing-stress'),
      t('Trauma Therapy', 'trauma'),
    ],
    subgroups: [
      {
        title: 'Health and Wellbeing Therapy',
        links: [
          t('Diabetes Mental Health Support', 'diabetes'),
          t("Parkinson's", 'parkinsons'),
        ],
      },
    ],
  },
  {
    id: 'relationships-and-family-therapy',
    title: 'Relationships & Family Therapy',
    blurb: 'Support for couples and families, including parenting, separation and conflict.',
    links: [],
    subgroups: [
      {
        title: 'Couples Therapy',
        links: [
          t('Couples Therapy', 'couples'),
          t('Christian Couples Therapy', 'christian-couples-therapy'),
          t('Conflict Management', 'conflict-management'),
          t('Domestic Violence Therapy/Support', 'domestic-violence'),
          t('Separation & Divorce Support', 'divorce-separation'),
        ],
      },
      {
        title: 'Family Therapy',
        links: [t('Family Therapy', 'family-therapy')],
      },
      {
        title: 'Parenting Skills Therapy',
        links: [
          t('Parenting Skills Therapy', 'parenting-skills-therapy'),
          t('Surviving Your Teenager', 'surviving-your-teenager'),
          t('Setting Boundaries for Your Teenager', 'setting-boundaries-for-your-teenager'),
        ],
      },
    ],
  },
  {
    id: 'trauma-and-ptsd-therapy',
    title: 'Trauma & PTSD Therapy',
    links: [
      t('Trauma Therapy', 'trauma'),
      t('PTSD', 'ptsd'),
      t('Grief & Loss', 'grief-loss'),
      t('PTSD – Teenage', 'ptsd-teenage'),
    ],
  },
  {
    id: 'complex-clinical-therapy',
    title: 'Complex Clinical Therapy',
    blurb: 'Focused work with complex presentations, including personality and mood disorders.',
    links: [
      t('ADHD Therapy', 'adhd-therapy'),
      t('Autism Therapy', 'autism-therapy'),
      t('Bipolar Disorder', 'bipolar-disorder'),
      t('Eating Disorders', 'eating-disorders'),
      // Anorexia, Bulimia and Binge Eating have no pages of their own: the original site lists them
      // in the Eating Disorders page's "Common Eating Disorders" section (old URLs 301 there).
      t('Anorexia', 'eating-disorders', 'common-eating-disorders'),
      t('Bulimia', 'eating-disorders', 'common-eating-disorders'),
      t('Binge Eating', 'eating-disorders', 'common-eating-disorders'),
      t('Borderline Personality Disorder', 'borderline-personality-disorder'),
      t('Narcissistic Personality Disorder', 'narcissistic-personality-disorder'),
    ],
  },
  {
    id: 'types-of-therapy',
    title: 'Types of Therapy',
    links: [
      t('Interventions / Types of Therapy', 'interventions'),
      t('Cognitive Behavioural Therapy (CBT)', 'cbt'),
      t('Dialectical Behaviour Therapy (DBT)', 'dbt'),
      t('EMDR', 'emdr'),
      t('Acceptance and Commitment Therapy (ACT)', 'acceptance-commitment-therapy'),
      t('Christian Therapy', 'christian-counselling'),
      t('Psychodynamic Therapy', 'psychodynamic-therapy'),
      t('Schema Therapy', 'schema-therapy'),
      t('Assessments', 'assessments'),
    ],
    subgroups: [
      {
        title: 'Fees, Funding & Referrals',
        links: [
          t('Fees, Funding & Referrals', 'fees-funding-referrals'),
          t('NDIS', 'ndis'),
          t('WorkCover', 'workcover'),
          t('Salvation Army Veterans', 'salvation-army-veterans'),
          t('Medicare', 'fees-funding-referrals', 'medicare'),
          t('DVA', 'fees-funding-referrals', 'dva'),
        ],
      },
    ],
  },
].map(sortCategory).sort(byName);

// Pages that are not listed in the menu keep their route; this is the category they sit under
// for their eyebrow and "More in" links.
const unlistedPages = {
  'personality-disorders': 'complex-clinical-therapy',
  'pregnancy-birth-trauma': 'trauma-and-ptsd-therapy',
};

export const categoryHref = (category) => `/therapy-services#${category.id}`;

// Every link in a category: direct links, then each subgroup's links.
export function allLinks(category) {
  return [...category.links, ...(category.subgroups ?? []).flatMap((g) => g.links)];
}

// Pages only: links that open a page of their own (not a section of another page).
export const pageLinks = (category) => allLinks(category).filter((l) => !l.hash);

// slug -> the first category that lists it (its primary home)
export function primaryCategory(slug) {
  const byId = unlistedPages[slug];
  if (byId) return therapyMenu.find((c) => c.id === byId);
  return therapyMenu.find((c) => pageLinks(c).some((l) => l.slug === slug)) ?? null;
}

// Unique topic slugs across the menu (canonical pages)
export function allTopicSlugs() {
  return [...new Set(therapyMenu.flatMap((c) => pageLinks(c).map((l) => l.slug)))];
}
