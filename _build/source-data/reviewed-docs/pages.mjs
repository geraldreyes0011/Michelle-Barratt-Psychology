// Therapy Services pages built from the reviewed source documents by _build/tools/build-service-pages.mjs.
// slug -> { photos: { sectionIdOrPrefix: [src, alt, objectPosition?] }, hero?: { src, alt } }
// `hero` is the photo beside the page title (copied to src/data/generatedHeroImages.json and to
// MIGRATED in build-topics.mjs). Pages without `hero` keep their existing one.
// Section photos follow the ADHD page arrangement: beside the text they relate to. No photo is used on
// more than one Therapy Services page. /images/stock = Pexels (free licence), /images/wp = site photos.
// Source documents (Google Docs "reviewed by Mary", exported to PDF) -> <slug>.svc via _build/tools/doc2svc.mjs.
const WP = '/images/wp';
const ST = '/images/stock';

export const PAGES = {
  // ---------------------------------------------------------------- existing pages, rebuilt from the documents
  'adult-therapy': { photos: {
    'why-worry': [`${WP}/2025/11/getty-images-9ro-xtoqygg-unsplash.webp`, 'A man sitting with his head in his hands, feeling overwhelmed'],
    'finding-the-right-practitioner': [`${WP}/2026/04/vitaly-gariev-lVEteug2d30-unsplash.webp`, 'A woman talking with a counsellor'],
  } },
  burnout: { photos: {
    'how-chronic-exhaustion': [`${ST}/pexels-36713018.webp`, 'A tired young man at his desk, rubbing his eyes'],
    'why-pushing-harder': [`${WP}/2026/04/kateryna-hliznitsova-Z8JfO29qBYE-unsplash.webp`, 'An exhausted woman at her laptop beside a note reading "Resign"'],
  } },
  'child-anxiety': { photos: {
    'anxiety-can-look-different': [`${ST}/pexels-7447257.webp`, 'A young girl covering her ears while sitting between her parents'],
    'supporting-your-child-through-anxiety': [`${ST}/pexels-7447266.webp`, 'A psychologist using happy and sad face cards with a young girl'],
  } },
  'adolescent-anxiety-depression': { photos: {
    'helping-your-teenager-feel': [`${ST}/pexels-8550682.webp`, 'A father sitting beside his upset teenage son'],
    'finding-the-right-support': [`${WP}/2025/12/teenage-counselling-service.webp`, 'A teenage boy talking with a counsellor'],
  } },
  'child-self-esteem': { photos: {
    'helping-your-child-develop-a-stronger': [`${ST}/pexels-8798725.webp`, 'A mother and son sharing a high five over homework'],
  } },
  bullying: { photos: {
    'how-might-you-recognise': [`${ST}/pexels-6936470.webp`, 'A girl sitting alone in a classroom while classmates point at her'],
  } },
  'child-adolescent-trauma': { photos: {
    'trauma-can-look-different': [`${ST}/pexels-4934748.webp`, 'A father comforting his crying young son', '50% 40%'],
  } },
  'oppositional-defiant-disorder': { photos: {
    'looking-beneath-defiant': [`${ST}/pexels-7078729.webp`, 'A mother talking calmly with her young son'],
    'the-ripple-effect': [`${ST}/pexels-4260102.webp`, 'A father talking with his son at home'],
  } },
  'emotional-regulation': { photos: {
    'why-strong-emotions': [`${WP}/2026/05/nappy-lNG3LCtYiJQ-unsplash.webp`, 'A counsellor talking with a client'],
    'practical-evidence-based-support': [`${WP}/2026/09/what-trauma-counselling-in-brisbane-featured.webp`, 'A psychologist working through cards with a client'],
  } },
  'conflict-management': { photos: {
    'how-communication-habits': [`${WP}/2025/12/getty-images-HjsKw973XG0-unsplash-2.webp`, 'A couple talking through a disagreement with a counsellor'],
    'finding-the-right-support-pathway': [`${WP}/2026/01/getty-images-6ckWCKZNFTo-unsplash.webp`, 'A couple meeting with two counsellors'],
  } },
  'managing-stress': { photos: {
    'when-a-helpful-survival': [`${ST}/pexels-6615223.webp`, 'A man working late at his desk, looking exhausted'],
    'practical-evidence-based-support': [`${ST}/pexels-7699526.webp`, 'A psychologist taking notes while a client talks'],
  } },
  trauma: { photos: {
    'how-the-nervous-system': [`${WP}/2026/03/dwayne-joe-Dpu7Le1kT3U-unsplash.webp`, 'A man covering his face with his hands'],
    'how-past-experiences': [`${WP}/2026/06/kateryna-hliznitsova-SO70tQmfKks-unsplash-2.webp`, 'Two people holding hands in support'],
  } },
  diabetes: { photos: {
    'why-the-mental-load': [`${ST}/pexels-17947739.webp`, 'A person checking their glucose monitor reading on a phone app'],
    'compassionate-evidence-based': [`${WP}/2026/06/pexels-karola-g-6255607.webp`, 'Two women talking in a calm counselling room'],
  } },

  // ---------------------------------------------------------------- pages that had no content
  ptsd: {
    hero: { src: `${ST}/pexels-8560691.webp`, alt: 'A man talking with a psychologist about a difficult experience' },
    photos: {
      'why-the-threat-response': [`${ST}/pexels-32482920.webp`, 'A man by a window, deep in thought'],
      'navigating-connection': [`${ST}/pexels-8172572.webp`, 'A man standing alone at a window at home'],
    },
  },
  'adhd-therapy-assessment': {
    hero: { src: `${ST}/pexels-7693194.webp`, alt: 'A woman at her laptop surrounded by notes, feeling overloaded' },
    photos: {
      'moving-beyond-willpower': [`${ST}/pexels-12912123.webp`, 'A woman working at her laptop and notebook, looking stressed', '50% 30%'],
      'practical-everyday-strategies': [`${ST}/pexels-7581008.webp`, 'A man planning at his desk in front of a task board', '50% 40%'],
    },
  },
  'pregnancy-birth-trauma': {
    hero: { src: `${ST}/pexels-7282773.webp`, alt: 'A mother holding her newborn baby close' },
    photos: {
      'why-subjective-experience': [`${ST}/pexels-9841443.webp`, 'A new mother holding her baby, looking thoughtful'],
      'how-perinatal-trauma': [`${ST}/pexels-32447390.webp`, 'Parents holding their newborn together', '50% 35%'],
    },
  },
  'grief-loss': {
    hero: { src: `${ST}/pexels-8871437.webp`, alt: 'An older woman looking at a framed photograph' },
    photos: {
      'why-grief-moves': [`${ST}/pexels-15937479.webp`, 'Two people holding hands for comfort'],
      'navigating-loss-alongside': [`${ST}/pexels-8871551.webp`, 'An older couple looking at a framed photograph together'],
    },
  },
  'ptsd-teenage': {
    hero: { src: `${ST}/pexels-4100421.webp`, alt: 'A teenage boy talking with a counsellor' },
    photos: {
      'how-adolescent-brains': [`${ST}/pexels-6763595.webp`, 'A teenager in a hoodie sitting quietly at home'],
      'youth-friendly': [`${ST}/pexels-23496567.webp`, 'A teenager in a counselling session'],
    },
  },
  'emotional-dysregulation': {
    hero: { src: `${ST}/pexels-6624327.webp`, alt: 'A young boy overwhelmed by frustration' },
    photos: {
      'what-can-contribute': [`${ST}/pexels-7820626.webp`, 'An upset young child holding an adult\'s hand'],
      'for-parents': [`${ST}/pexels-6624311.webp`, 'A mother comforting her son on the couch', '50% 35%'],
    },
  },
  'grief-loss-children': {
    hero: { src: `${ST}/pexels-7302870.webp`, alt: 'A young child hugging his mother for comfort' },
    photos: {
      'grief-doesnt-always': [`${ST}/pexels-6624439.webp`, 'A mother holding her child close', '50% 35%'],
      'how-can-therapy-help': [`${ST}/pexels-6134904.webp`, 'A mother comforting her teenage daughter', '50% 35%'],
    },
  },
  parkinsons: {
    hero: { src: `${ST}/pexels-5790835.webp`, alt: 'An older couple sharing an affectionate moment' },
    photos: {
      'why-mood-and-anxiety': [`${ST}/pexels-8441852.webp`, 'Two people holding hands in support'],
      'navigating-changing-roles': [`${ST}/pexels-14866317.webp`, 'An older couple walking together, one using a walking aid', '50% 40%'],
    },
  },
};
