// Practitioner profile pages (/practitioners/:slug).
// - Card facts (title, photo, specialty badge, location, days, ages, format, notes) repeat the
//   practitioner cards on /practitioners (src/data/pages/practitioners.json).
// - Profile text is copied from each practitioner's page on the original website
//   (michellebarrattpsychology.com.au/<slug>/) into practitionerProfiles.json as blocks:
//   { h } section heading, { p } paragraph, { list } bullet list.
// - `booking` is the practitioner's public Halaxy portal. Michelle Barratt deliberately has none:
//   her Halaxy portal is for existing patients only and must not appear on the public site.
import profiles from './practitionerProfiles.json';

const WP = 'https://michellebarrattpsychology.com.au/wp-content/uploads';

const details = (location, days, ages, format) => [
  ['Location', location],
  ['Days Available', days],
  ['Works With Ages', ages],
  ['Meeting Format', format],
];

const practitionerList = [
  {
    slug: 'michelle-barratt',
    name: 'Michelle Barratt',
    title: 'Clinical Psychologist',
    photo: `${WP}/2025/05/barrat.jpg`,
    badges: ['Christian Counselling'],
    details: details('Toowong & Online', 'Mon, Tue & Thurs', '15+', 'Face to Face / Online'),
    note: 'Waitlist – Contact us to book Michelle',
    booking: null,
  },
  {
    slug: 'timothy-rach',
    name: 'Timothy Rach',
    title: 'Clinical Registrar - Psychologist',
    photo: `${WP}/2026/04/Rach.jpg`,
    badges: [],
    details: details('Toowong & Online', 'Tue, Thur, & Fri', '15+', 'Face to Face / Online'),
    booking: 'https://www.halaxy.com/book/psychologist/timothy-rach/1774421/257110',
  },
  {
    slug: 'rachel-cleary',
    name: 'Rachel Cleary',
    title: 'Senior Psychologist',
    photo: `${WP}/2025/05/DSC02464.jpg`,
    badges: ['Christian Counselling'],
    details: details('Toowong & Online', 'Tue & Thurs', '15+', 'Face to Face / Online'),
    bookingNote: 'NOTE: Please select a ‘General Psychologist’ service when selecting fees on the booking page.',
    booking: 'https://www.halaxy.com/book/psychologist/rachel-cleary/537201/257110',
  },
  {
    slug: 'eddie-mtakwa',
    name: 'Eddie Mtakwa',
    title: 'Senior Psychologist',
    photo: `${WP}/2026/08/Eddie-Mktawa-1-e1788162070284.png`,
    badges: ['Christian Counselling'],
    details: details('Toowong & Online', 'Mon-Wed (Toowong) Thurs (Online)', '12+', 'Face-to-Face / Online'),
    booking: 'https://www.halaxy.com/book/psychologist/mr-edward-mtakwa/1802211/257110',
  },
  {
    slug: 'kimberly-king',
    name: 'Kimberly King',
    title: 'Counsellor',
    photo: `${WP}/2026/07/Kimberly-King-Counselling.webp`,
    badges: ['Christian Counselling'],
    details: details('Toowong & Online', 'Mon & Wed evenings (Online), Thurs (Toowong)', '10+', 'Face-to-Face / Online'),
    booking: 'https://www.halaxy.com/book/counsellor/kimberly-king/1788185/257110',
  },
  {
    slug: 'pamela-bray-formas',
    name: 'Pamela Bray-Formas',
    title: 'Senior Psychologist',
    photo: `${WP}/2025/09/pamela.jpg`,
    badges: [],
    details: details('Manly West & Online', 'Wed & Thurs', '6+', 'Face-to-Face / Online'),
    booking: 'https://www.halaxy.com/book/psychologist/ms-pamela-bray-formas/535631/1336459',
  },
  {
    slug: 'jennifer-cook',
    name: 'Jennifer Cook',
    title: 'Senior Psychologist',
    photo: `${WP}/2025/05/Jennifer2.jpg`,
    badges: [],
    details: details('Manly-West & Online', 'Mon, Wed & Fri', '15+', 'Face to Face / Online'),
    booking: 'https://www.halaxy.com/book/psychologist/jennifer-cook/1259051/1336459',
  },
  {
    slug: 'grant-harvey',
    name: 'Grant Harvey',
    title: 'Mental Health Social Worker',
    photo: `${WP}/2026/07/grant-harvey-psychologist.jpg`,
    badges: ['Christian Counselling'],
    details: details('Online', 'Wednesdays', 'All', 'Online'),
    booking: 'https://www.halaxy.com/book/social-worker/grant-harvey/1784473/257110',
  },
];

export const practitioners = Object.fromEntries(
  practitionerList.map((p) => [p.slug, { ...p, profile: profiles[p.slug] }]),
);

export const practitionerPath = (slug) => `/practitioners/${slug}`;

export const HALAXY_LOGO = 'https://cdn.halaxy.com/h/images/logo.png';
