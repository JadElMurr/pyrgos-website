// =============================================================================
//  PRERENDER — runs after `vite build` (see package.json).
// -----------------------------------------------------------------------------
//  Writes a physical index.html for every route with the right <title>,
//  description, canonical URL, Open Graph / Twitter tags and JSON-LD.
//  Netlify serves physical files before the SPA fallback, so shared links
//  (WhatsApp, iMessage, social) unfurl with each unit's photo and price,
//  and search engines read real metadata without executing JavaScript.
//  Also regenerates sitemap.xml straight from listings.json, so units added
//  through Pyrgos Studio enter the sitemap automatically on the next build.
// =============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://pyrgosgr.com';
const DIST = 'dist';

const listings = JSON.parse(readFileSync('src/data/listings.json', 'utf8'));
const { site, buildings, apartments, publishPrices } = listings;
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

// ---- helpers ------------------------------------------------------------------
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const truncate = (s, n = 158) => {
  const t = clean(s);
  return t.length <= n ? t : t.slice(0, n - 1).replace(/\s+\S*$/, '') + '\u2026';
};
const eur = (n) => '\u20AC' + n.toLocaleString('en-US');
const abs = (p) => (p && p.startsWith('http') ? p : SITE + (p || '/og-image.jpg'));
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

function render({ path, title, desc, image, jsonld = [] }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${SITE + path}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${SITE + path}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${abs(image)}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${abs(image)}$2`);
  if (jsonld.length) html = html.replace('<!--seo-->', jsonld.map(ld).join('\n    '));

  const dir = path === '/' ? DIST : join(DIST, path.replace(/^\//, ''));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

const addressFor = (b) => ({
  '@type': 'PostalAddress',
  streetAddress: b.address ?? b.title,
  addressLocality: `${b.location}, Athens`,
  addressCountry: 'GR',
});

// ---- routes ---------------------------------------------------------------------
const pages = [];

pages.push({
  path: '/',
  title: `${site.companyName} \u2014 Contemporary Residences in Athens`,
  desc: truncate(site.tagline + ' ' + site.projectsHeadline),
  image: '/og-image.jpg',
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.companyName,
      url: SITE + '/',
      logo: SITE + '/favicon.png',
      email: site.email,
      address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: 'Athens', addressCountry: 'GR' },
      contactPoint: site.phones.map((p) => ({ '@type': 'ContactPoint', telephone: p.display, contactType: 'sales', areaServed: ['GR', 'LB'] })),
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.companyName, url: SITE + '/' },
  ],
});

pages.push({
  path: '/projects',
  title: `Projects \u2014 ${site.companyName}`,
  desc: truncate(`${site.projectsHeadline} ${buildings.map((b) => b.title).join(', ')}.`),
  image: buildings[0]?.images[0],
});

const availableCount = apartments.filter((a) => a.status === 'available').length;
pages.push({
  path: '/residences',
  title: `Residences for Sale in Athens \u2014 ${site.companyName}`,
  desc: truncate(`Browse all ${apartments.length} residences across our Athens developments \u2014 ${availableCount} currently available. Filter by bedrooms, budget, and building.`),
  image: buildings[0]?.images[0],
});

pages.push({
  path: '/about',
  title: `About \u2014 ${site.companyName}`,
  desc: truncate(site.tagline),
  image: '/og-image.jpg',
});

pages.push({
  path: '/contact',
  title: `Contact \u2014 ${site.companyName}`,
  desc: truncate(`Speak with ${site.companyName}: ${site.phones.map((p) => `${p.label} ${p.display}`).join(' \u00b7 ')} \u00b7 ${site.email}`),
  image: '/og-image.jpg',
});

for (const b of buildings) {
  pages.push({
    path: `/projects/${b.slug}`,
    title: `${b.title} \u2014 ${b.location}, Athens | ${site.companyName}`,
    desc: truncate(b.description),
    image: b.images[0],
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'ApartmentComplex',
        name: b.title,
        url: `${SITE}/projects/${b.slug}`,
        description: truncate(b.description, 300),
        address: addressFor(b),
        ...(b.images.length ? { image: b.images.map(abs) } : {}),
      },
    ],
  });

  for (const a of apartments.filter((x) => x.buildingSlug === b.slug)) {
    const bits = [];
    if (a.status === 'sold') bits.push('Sold');
    else if (publishPrices && a.price != null) bits.push(eur(a.price));
    else bits.push('Price on request');
    if (a.beds != null) bits.push(`${a.beds} bed${a.beds > 1 ? 's' : ''}`);
    if (a.baths != null) bits.push(`${a.baths} bath${a.baths > 1 ? 's' : ''}`);
    if (a.sizeInteriorSqm != null) bits.push(`${a.sizeInteriorSqm} m\u00b2 interior`);

    const unitLd = {
      '@context': 'https://schema.org',
      '@type': 'Apartment',
      name: `${a.title} \u2014 ${b.title}`,
      url: `${SITE}/projects/${b.slug}/apartments/${a.slug}`,
      description: truncate(a.description ?? b.description, 300),
      address: addressFor(b),
    };
    if (a.sizeInteriorSqm != null) unitLd.floorSize = { '@type': 'QuantitativeValue', value: a.sizeInteriorSqm, unitCode: 'MTK' };
    if (a.beds != null) unitLd.numberOfBedrooms = a.beds;
    if (a.baths != null) unitLd.numberOfBathroomsTotal = a.baths;
    const imgs = (a.images.length ? a.images : a.floorPlans ?? []).map(abs);
    if (imgs.length) unitLd.image = imgs;
    if (publishPrices && a.price != null) {
      unitLd.offers = {
        '@type': 'Offer',
        price: a.price,
        priceCurrency: 'EUR',
        availability:
          a.status === 'sold'
            ? 'https://schema.org/SoldOut'
            : a.status === 'reserved'
              ? 'https://schema.org/LimitedAvailability'
              : 'https://schema.org/InStock',
        url: `${SITE}/projects/${b.slug}/apartments/${a.slug}`,
      };
    }

    pages.push({
      path: `/projects/${b.slug}/apartments/${a.slug}`,
      title: `${a.title} \u2014 ${b.title}, ${b.location} | ${site.companyName}`,
      desc: truncate(`${bits.join(' \u00b7 ')}. ${a.description ?? b.description ?? ''}`),
      image: a.images[0] ?? a.floorPlans?.[0] ?? b.images[0],
      jsonld: [unitLd],
    });
  }
}

for (const p of pages) render(p);

// ---- sitemap ----------------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages.map((p) => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

console.log(`prerender: ${pages.length} routes written, sitemap.xml regenerated (${pages.length} URLs)`);
