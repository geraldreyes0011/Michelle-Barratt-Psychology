// Section photos for Therapy Services pages (ADHD page layout: photo beside the section's text).
// Pages built from the reviewed documents (_build/tools/build-service-pages.mjs) set their photos in
// _build/source-data/reviewed-docs/pages.mjs instead.
// slug -> [[section heading as it appears in the page HTML, image path, alt text, options?]]
// options.n: which occurrence of a repeated heading; options.pos: CSS object-position for the crop.
// Images are stored locally: /images/wp (site photography) and /images/stock (Pexels, free licence).
const WP = '/images/wp';
const ST = '/images/stock';

export const servicePhotos = {
  'bipolar-disorder': [
    ['How can therapy help?', `${WP}/2026/07/vitaly-gariev-SktdARcCuys-unsplash.webp`, 'A counsellor listening to a client during a session'],
    ['Supporting a Loved One Living with Bipolar Disorder', `${ST}/pexels-8056994.webp`, 'A father comforting his adult daughter'],
  ],
  'borderline-personality-disorder': [
    ['How does MBP support therapy for Borderline Personality Disorder?', `${WP}/2025/12/kateryna-hliznitsova-ycIdYuLIPR4-unsplash-1.webp`, 'A woman talking openly in a counselling session'],
    ['BPD Therapy Brisbane', `${WP}/2026/01/andrej-lisakov-XWqvdxnhhTE-unsplash.webp`, 'A psychologist and client talking in a relaxed therapy room'],
  ],
  'child-adolescent-therapy': [
    ['Supporting Children, Teenagers, and Families', `${ST}/pexels-7447264.webp`, 'A psychologist talking with a young girl on a couch'],
    ['Understanding the Teenage Years', `${ST}/pexels-6957233.webp`, 'A mother and teenage daughter talking over breakfast'],
    ['Understanding Toddler Behaviour and Tantrums', `${ST}/pexels-7220922.webp`, 'Parents sitting on the floor playing with their toddler'],
  ],
  'christian-counselling': [
    ['What is Christian Counselling?', `${WP}/2026/07/curated-lifestyle-cuGX7yND9L0-unsplash.webp`, 'People reading the Bible together around a table'],
    ['Christian Therapy for Individuals', `${ST}/pexels-8815328.webp`, 'Two people holding hands in prayer'],
  ],
  'christian-couples-therapy': [
    ['Christian Couples Therapy', `${ST}/pexels-24822630.webp`, "A married couple's hands resting together on a Bible", { pos: '50% 65%' }],
  ],
  couples: [
    ['Relationship Counselling and Marriage Counselling', `${WP}/2026/05/85658.webp`, 'A couple holding hands during a counselling session'],
    ['Building a Stronger Relationship Together', `${WP}/2026/06/pexels-gustavo-fring-7447074.webp`, 'A young couple supporting each other during a therapy session'],
  ],
  'divorce-separation': [
    ['How can therapy help during separation?', `${WP}/2026/07/getty-images-mDmMlu8DL9E-unsplash.webp`, 'A couple sitting apart in a counselling session'],
    ['Putting children&#x27;s wellbeing first', `${ST}/pexels-7447263.webp`, "A psychologist sharing a child's drawing with the child's parents"],
  ],
  'domestic-violence': [
    ['How Therapy Can Help', `${WP}/2026/07/vitaly-gariev-udv5YRcNz7M-unsplash.webp`, 'A woman being supported by a counsellor'],
    ['The Impact of Family Violence on Children and Adolescents', `${ST}/pexels-20030981.webp`, 'A school counsellor talking with a young girl'],
  ],
  'eating-disorders': [
    ['Understanding the Emotional Impact', `${WP}/2026/05/getty-images-KUYyJYtvy3s-unsplash.webp`, 'A young woman sitting alone at a table, deep in thought'],
    ['A Multidisciplinary Approach to Recovery', `${WP}/2026/08/early-clues-of-eating-disorders-in-brisbane-parents-overlook-featured.webp`, 'A counsellor and a young woman working through cards at a table'],
  ],
  'family-therapy': [
    ['What is Family Therapy?', `${ST}/pexels-7447259.webp`, 'Parents and their daughter in a family therapy session'],
    ['Supporting Families Through Change', `${WP}/2020/10/family-therapy-5.webp`, 'Three generations of a family sharing a meal outdoors'],
  ],
  'fees-funding-referrals': [
    // The page's existing photo, moved beside the Medicare section.
    ['Mental Health Care Plan (MHCP) via a GP', `${WP}/2026/05/bpd-therapy-nMKIafJb.webp`, 'A calm, welcoming counselling room'],
  ],
  interventions: [
    ['Child &amp; Adolescent Therapy', `${WP}/2026/09/early-relationship-counselling-featured.webp`, 'A therapist using small figures and blocks with clients during a session'],
    ['Understanding Psychodynamic Therapy', `${ST}/pexels-7176033.webp`, 'A client lying on a couch while a therapist takes notes'],
  ],
  'narcissistic-personality-disorder': [
    ['What does NPD therapy focus on?', `${WP}/2026/01/getty-images-69LeqK0j1UY-unsplash.webp`, 'Two clients talking with a psychologist'],
    ['Supporting a Loved One Living with NPD', `${ST}/pexels-8841346.webp`, 'A mother and her adult son talking'],
  ],
  'parenting-skills-therapy': [
    ['Building your parenting toolkit', `${ST}/pexels-31152789.webp`, 'Parents playing with their young children on the living room floor'],
    ['What does parenting skills therapy focus on?', `${ST}/pexels-3819598.webp`, 'Parents sitting with their toddler at home'],
  ],
  'personality-disorders': [
    ['What does personality disorder therapy involve?', `${ST}/pexels-9064691.webp`, 'A psychologist with a clipboard listening to a client'],
    ['Supporting a Loved One Living with a Personality Disorder', `${ST}/pexels-8550086.webp`, 'A mother sitting with her upset adult son'],
  ],
  'psychodynamic-therapy': [
    ['What Psychodynamic Therapy Is and How It Works', `${WP}/2026/01/bipolar-disorder-treatment.webp`, 'A therapist talking with a client lying on a couch'],
    ['When Psychodynamic Therapy May Be Especially Helpful', `${WP}/2026/09/managing-trauma-triggers-during-featured.webp`, 'A psychologist and client talking in a bright Brisbane therapy room'],
  ],
  assessments: [
    ['1. Unlocking Insights: The Power of Psychological Assessments', `${ST}/pexels-5699456.webp`, 'A psychologist completing notes on a clipboard'],
  ],
  cbt: [['Cognitive Behavioural Therapy (CBT)', `${ST}/pexels-7176026.webp`, 'A psychologist taking notes during a session with a client']],
  dbt: [['Dialectical Behaviour Therapy (DBT)', `${ST}/pexels-5711177.webp`, 'Group members supporting one another during a skills group']],
  emdr: [['Understanding EMDR Therapy:', `${WP}/2025/11/curated-lifestyle-wUys-HwvCWk-unsplash-1.webp`, 'A woman reflecting quietly']],
  ndis: [['National Disability Insurance Scheme (NDIS)', `${ST}/pexels-8415495.webp`, 'A young man in a wheelchair with his support person']],
  'setting-boundaries-for-your-teenager': [['Setting Boundaries for Your Teenager', `${ST}/pexels-8550840.webp`, 'A mother and teenage son talking things through']],
  'surviving-your-teenager': [['Surviving Your Teenager', `${ST}/pexels-8489049.webp`, 'A mother and teenage daughter having a conversation']],
  workcover: [['WorkCover QLD', `${ST}/pexels-8961551.webp`, 'A worker helping an injured colleague on a building site']],
};
