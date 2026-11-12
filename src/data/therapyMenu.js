// Therapy Services navigation: the client's seven-category structure.
// Used by the desktop mega-menu, mobile menu, Therapy Services index, page eyebrows
// and "More in" links, and by _build/tools/build-topics.mjs. Plain ESM (no JSX) so Node can import it.
//
// A topic that appears in several categories points at one canonical page (same slug).
// `primary` on a category marks which category a shared page belongs to for eyebrows/"More in".

const t = (label, slug) => ({ label, slug, to: `/therapy-services/${slug}` });

export const therapyMenu = [
  {
    id: 'children-and-adolescent-therapy',
    title: 'Children & Adolescent Therapy',
    blurb: 'Support for younger clients, from childhood anxiety through to adolescent mental health.',
    links: [
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
      t('Stress Management Therapy', 'managing-stress'),
      t('Trauma Therapy', 'trauma'),
    ],
    subgroup: {
      title: 'Wellbeing Therapy',
      links: [
        t('Diabetes Mental Health Support', 'diabetes'),
        t("Parkinson's", 'parkinsons'),
        t('Pregnancy & Birth Trauma', 'pregnancy-birth-trauma'),
      ],
    },
  },
  {
    id: 'relationships-and-family-therapy',
    title: 'Relationships & Family Therapy',
    blurb: 'Support for couples and families, including parenting, separation and conflict.',
    links: [
      t('Couples Therapy', 'couples'),
      t('Family Therapy', 'family-therapy'),
      t('Conflict Management', 'conflict-management'),
      t('Domestic Violence Therapy/Support', 'domestic-violence'),
      t('Separation & Divorce Support', 'divorce-separation'),
      t('Parenting Skills Therapy', 'parenting-skills-therapy'),
    ],
  },
  {
    id: 'trauma-and-ptsd-therapy',
    title: 'Trauma & PTSD Therapy',
    links: [
      t('PTSD', 'ptsd'),
      t('Pregnancy & Birth Trauma', 'pregnancy-birth-trauma'),
      t('Grief & Loss', 'grief-loss'),
      t('Child & Adolescent Trauma', 'child-adolescent-trauma'),
    ],
  },
  {
    id: 'complex-clinical-therapy',
    title: 'Complex Clinical Therapy',
    blurb: 'Focused work with complex presentations, including personality and mood disorders.',
    links: [
      t('ADHD Therapy', 'adhd-therapy-assessment'),
      t('Autism Therapy', 'autism-therapy'),
      t('Bipolar Disorder', 'bipolar-disorder'),
      t('Borderline Personality Disorder', 'borderline-personality-disorder'),
      t('Eating Disorders', 'eating-disorders'),
      t('Narcissistic Personality Disorder', 'narcissistic-personality-disorder'),
    ],
  },
  {
    id: 'interventions-and-approaches',
    title: 'Interventions & Approaches',
    links: [
      t('Cognitive Behavioural Therapy (CBT)', 'cbt'),
      t('Dialectical Behaviour Therapy (DBT)', 'dbt'),
      t('EMDR', 'emdr'),
      t('Acceptance and Commitment Therapy (ACT)', 'acceptance-commitment-therapy'),
      t('Christian Therapy', 'christian-counselling'),
      t('Psychodynamic Therapy', 'psychodynamic-therapy'),
      t('Schema Therapy', 'schema-therapy'),
    ],
  },
  {
    id: 'other-services-and-care-hub',
    title: 'Other Services & Care Hub',
    links: [
      t('Assessments', 'assessments'),
      t('NDIS', 'ndis'),
      t('WorkCover', 'workcover'),
      t('Salvation Army Veterans', 'salvation-army-veterans'),
    ],
  },
];

// Desktop mega-menu: eight categories in the client's order, with Wellbeing Therapy shown as its
// own category (it stays a subgroup of Individual & Adult Therapy elsewhere on the site).
const byId = (id) => therapyMenu.find((c) => c.id === id);
const individual = byId('individual-and-adult-therapy');
export const megaMenuCategories = [
  byId('children-and-adolescent-therapy'),
  { ...individual, subgroup: undefined },
  byId('relationships-and-family-therapy'),
  byId('complex-clinical-therapy'),
  byId('interventions-and-approaches'),
  byId('trauma-and-ptsd-therapy'),
  { id: 'wellbeing-therapy', title: individual.subgroup.title, links: individual.subgroup.links },
  byId('other-services-and-care-hub'),
];

// Reference pages that are no longer listed in the menu keep their route; this is
// the category they now sit under for their eyebrow and "More in" links.
const unlistedPages = {
  'child-adolescent-therapy': 'children-and-adolescent-therapy',
  'personality-disorders': 'complex-clinical-therapy',
  'interventions': 'interventions-and-approaches',
};

export const categoryHref = (category) => `/therapy-services#${category.id}`;

export function allLinks(category) {
  return [...category.links, ...(category.subgroup?.links ?? [])];
}

// slug -> the first category that lists it (its primary home)
export function primaryCategory(slug) {
  const byId = unlistedPages[slug];
  if (byId) return therapyMenu.find((c) => c.id === byId);
  return therapyMenu.find((c) => allLinks(c).some((l) => l.slug === slug)) ?? null;
}

// Unique topic slugs across the menu (canonical pages)
export function allTopicSlugs() {
  return [...new Set(therapyMenu.flatMap((c) => allLinks(c).map((l) => l.slug)))];
}
