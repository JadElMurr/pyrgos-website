// =============================================================================
//  PYRGOS — WEBSITE CONTENT CONTROL PANEL
// -----------------------------------------------------------------------------
//  Everything a non-developer needs to change lives in THIS file.
//  Edit a value, save, and the website updates. (Preview: run `npm run dev`.)
//  Safe to edit: text in 'quotes', numbers, true/false, image filenames.
//  Don't touch: the words before the colons, the brackets [ ] { }, or commas.
// =============================================================================

// ---- 1. SHOW PRICES? --------------------------------------------------------
//  true  -> euro prices below are shown.   false -> "Price on request".
export const PUBLISH_PRICES = true;

// ---- 2. COMPANY & CONTACT DETAILS ------------------------------------------
export const siteConfig = {
  companyName: 'Pyrgos Real Estate',
  shortName: 'PYRGOS',
  tagline:
    'Thoughtfully designed residences, delivered with meticulous attention to quality, planning, and execution.',
  // Headline shown at the top of the Projects page — edit the wording freely:
  projectsHeadline: 'A focused portfolio across greater Athens.',
  primaryDomain: 'pyrgosgr.com',
  secondaryDomain: 'pyrgosdio.com',
  email: 'PyrgosDio@gmail.com',
  address: 'Koronis 4, Athens 11471, Greece',
  locationShort: 'Athens, Greece',
  phones: [
    { label: 'Athens', display: '+30 698 610 8962', href: 'tel:+306986108962' },
    { label: 'Beirut', display: '+961 3 297 130', href: 'tel:+9613297130' },
  ],
};

// ---- helpers (no need to edit) ---------------------------------------------
const eur = (n: number) => '\u20AC' + n.toLocaleString('en-US');
const priceLabel = (price?: number, status?: ApartmentStatus) => {
  if (status === 'sold') return 'Sold';
  if (PUBLISH_PRICES && price) return eur(price);
  return 'Price on request';
};

// ---- types (no need to edit) -----------------------------------------------
export type ApartmentStatus = 'available' | 'sold' | 'reserved';

export type Apartment = {
  id: string; buildingSlug: string; slug: string; title: string;
  status: ApartmentStatus; price?: number; priceText: string;
  unitType?: string;
  sizeInteriorSqm?: number; balconiesSqm?: number; gardenSqm?: number;
  beds?: number; baths?: number; parking?: string; floorLabel?: string;
  features: string[]; images: string[]; floorPlans?: string[]; description?: string;
};

export type Building = {
  id: string; slug: string; title: string; location: string;
  status?: 'available' | 'upcoming';
  address?: string; startingPriceText: string; description: string;
  locationDescription?: string; locationImage?: string; images: string[]; highlights: string[];
  interiorImages?: { src: string; caption: string }[];
  brochure?: { pdf: string; pages: number; dir: string };
};

// ---- 3. BUILDINGS -----------------------------------------------------------
export const buildings: Building[] = [
  {
    id: 'bld_palmiras_16',
    slug: 'palmiras-16',
    title: 'Palmiras 16',
    location: 'Glyfada',
    address: 'Palmiras 16, Glyfada, Athens',
    startingPriceText: PUBLISH_PRICES ? 'From ' + eur(565000) : 'Price on request',
    description:
      'Palmiras 16 is a contemporary residential building defined by clarity of form, ' +
      'lightness, and a strong relationship between interior and exterior space. A clean white ' +
      'volume is shaped by a rhythmic stacking of floors and recessed balconies, with ' +
      'full-height glazing that draws daylight deep into warm, light-filled interiors. ' +
      'Transparent glass balustrades and integrated planters soften the geometry, while a ' +
      'rooftop garden with louvered shading crowns the building.',
    locationDescription:
      'Glyfada, along the southern coastline of Athens, is one of the city\u2019s most ' +
      'prestigious districts \u2014 renowned for its seaside lifestyle, upscale shopping ' +
      'streets, cafes, and international schools. Minutes from the beaches of the Athenian ' +
      'Riviera, it balances refined urban living with coastal leisure.',
    locationImage: '/images/palmiras/glyfada-aerial.jpg',
    images: [
      '/images/palmiras/building-front.jpg',
      '/images/palmiras/building-corner.jpg',
      '/images/palmiras/building-rear.jpg',
      '/images/palmiras/palmiras-roof-garden.jpg',
    ],
    highlights: [
      'New construction', '5-floor residential building', '4 apartments',
      '2\u20133 bedrooms, 1\u20132 bathrooms', 'Private parking & storage',
      'Rooftop garden with Athens views', 'Sustainable, high-luminosity design',
    ],
    brochure: { pdf: '/brochures/palmiras-16.pdf', pages: 24, dir: '/images/brochure' },
  },
  {
    id: 'bld_gazi_residences',
    slug: 'gazi-residences',
    title: 'Gazi Residences',
    location: 'Gazi',
    address: '31 Ikarieon Street, Gazi, Athens 11854',
    startingPriceText: PUBLISH_PRICES ? 'From ' + eur(230000) : 'Price on request',
    description:
      'Gazi Residences is a contemporary 12-apartment development in the heart of Gazi, one of ' +
      'central Athens\u2019 most vibrant neighbourhoods. Behind a sculptural white textured ' +
      'fa\u00e7ade, the building offers a considered range of homes \u2014 from compact urban ' +
      'suites to two-level duplex lofts \u2014 each finished to a high standard with ' +
      'energy-efficient systems, hidden lighting, and a planted rooftop.',
    locationDescription:
      'Located at 31 Ikarieon Street, the building offers excellent connectivity: a five-minute ' +
      'walk from Kerameikos Metro \u2014 with direct links to the city centre and the airport \u2014 ' +
      'and fifteen minutes from Thiseio. The surrounding streets are rich with shops, ' +
      'supermarkets, pharmacies, and cafes, with easy access to central Athens and nearby ' +
      'business districts.',
    locationImage: '/images/gazi/gazi-map.jpg',
    images: [
      '/images/gazi/gazi-dusk.jpg',
      '/images/gazi/gazi-front.jpg',
      '/images/gazi/gazi-angle1.jpg',
      '/images/gazi/gazi-angle2.jpg',
    ],
    highlights: [
      'New construction, 7 floors', '12 apartments', 'Energy Class A',
      'Heat-pump heating & air conditioning', 'External & roof thermal insulation (10cm)',
      'Fibre internet & alarm pre-installation', 'Minimal kitchens with hidden appliances',
      'Floor-to-ceiling wardrobes', '5 min walk to Kerameikos Metro',
    ],
    brochure: { pdf: '/brochures/gazi-residences.pdf', pages: 37, dir: '/images/brochure-gazi' },
  },
  {
    // ---- UPCOMING: flip status to 'available' and fill in the details when ready ----
    id: 'bld_theokritou_17',
    slug: 'theokritou-17',
    title: 'Theokritou 17',
    location: 'Athens',
    status: 'upcoming',
    address: 'Theokritou 17, Athens',
    startingPriceText: 'Coming soon',
    description:
      'A new Pyrgos residence taking shape in central Athens. Details, pricing, and the full ' +
      'brochure will be published as the project advances.',
    images: [],
    highlights: [],
  },
];

// ---- 4. APARTMENTS ----------------------------------------------------------
//  Mark sold:  status: 'available'  ->  status: 'sold'  (or 'reserved')
//  Change price: edit the  price:  number.
const P = '/images/palmiras/';
const G = '/images/gazi/';
const rawApartments: Omit<Apartment, 'priceText'>[] = [
  // ---------- PALMIRAS 16 (Glyfada) ----------
  {
    id: 'apt_palmiras_d1', buildingSlug: 'palmiras-16', slug: 'duplex-d1', title: 'Duplex D1',
    status: 'available', price: 800000, unitType: 'Duplex',
    sizeInteriorSqm: 77.2, balconiesSqm: 5.25, gardenSqm: 106.78, beds: 2, baths: 2,
    parking: '1 spot included', floorLabel: 'Ground & 1st floor',
    features: ['Duplex layout', 'Private garden', 'Parking & storage', 'Full-height glazing'],
    images: [P + 'd1-living.jpg', P + 'd1-bedroom.jpg', P + 'd1-kitchen.jpg', P + 'd1-bathroom.jpg'],
    floorPlans: [P + 'd1-plan-lower.jpg', P + 'd1-plan-upper.jpg'],
    description:
      'A ground-floor duplex opening onto a generous private garden. Two bedrooms and two ' +
      'bathrooms across two levels, with an open living-dining-kitchen, full-height glazing, and warm finishes.',
  },
  {
    id: 'apt_palmiras_d2', buildingSlug: 'palmiras-16', slug: 'duplex-d2', title: 'Duplex D2',
    status: 'available', price: 780000, unitType: 'Duplex',
    sizeInteriorSqm: 98.9, balconiesSqm: 37.05, beds: 3, baths: 2,
    parking: '1 spot included', floorLabel: '1st & 2nd floor',
    features: ['Duplex layout', 'Generous balconies', 'Master en-suite', 'Parking & storage'],
    images: [P + 'd2-living.jpg', P + 'd2-bedroom.jpg', P + 'd2-bathroom.jpg'],
    floorPlans: [P + 'd2-plan-lower.jpg', P + 'd2-plan-upper.jpg'],
    description:
      'The largest residence: a three-bedroom duplex with a master en-suite and generous ' +
      'wrap-around balconies. An airy, light-filled volume with premium materials throughout.',
  },
  {
    id: 'apt_palmiras_d3', buildingSlug: 'palmiras-16', slug: 'simplex-d3', title: 'Simplex D3',
    status: 'available', price: 565000, unitType: 'Simplex',
    sizeInteriorSqm: 75.35, balconiesSqm: 18.87, beds: 2, baths: 1,
    parking: '1 spot included', floorLabel: '3rd floor',
    features: ['Single-level layout', 'Generous balconies', 'Bright open plan', 'Parking & storage'],
    images: [P + 'd3-d4-living.jpg', P + 'd3-d4-bedroom.jpg', P + 'd3-d4-kitchen.jpg', P + 'd3-d4-bathroom.jpg'],
    floorPlans: [P + 'd3-d4-plan.jpg'],
    description:
      'A bright single-level two-bedroom residence with generous balconies and an efficient, ' +
      'open plan. Calm contemporary interiors with full-height glazing.',
  },
  {
    id: 'apt_palmiras_d4', buildingSlug: 'palmiras-16', slug: 'simplex-d4', title: 'Simplex D4',
    status: 'sold', price: 535000, unitType: 'Simplex',
    sizeInteriorSqm: 76.96, balconiesSqm: 18.87, beds: 2, baths: 1,
    parking: '1 spot included', floorLabel: '4th floor',
    features: ['Single-level layout', 'Generous balconies', 'Elevated views', 'Parking & storage'],
    images: [P + 'd3-d4-living.jpg', P + 'd3-d4-bedroom.jpg', P + 'd3-d4-kitchen.jpg', P + 'd3-d4-bathroom.jpg'],
    floorPlans: [P + 'd3-d4-plan.jpg'],
    description:
      'A single-level two-bedroom residence on the fourth floor with elevated views and ' +
      'generous balconies. Shares the refined simplex layout of D3.',
  },

  // ---------- GAZI RESIDENCES (Gazi) ----------
  // (Interior renders are indicative and shown on the building page.)
  {
    id: 'apt_gazi_a1', buildingSlug: 'gazi-residences', slug: 'duplex-a1', title: 'A1 — Duplex Loft',
    status: 'available', price: 270000, unitType: 'Duplex',
    sizeInteriorSqm: 59, balconiesSqm: 9, beds: 1, baths: 2, parking: 'Optional (+\u20AC25,000)',
    floorLabel: '1st & 2nd floor',
    features: ['Two-level maisonette', 'Open-plan living & kitchen', 'Private balcony', 'Energy Class A'],
    images: [], floorPlans: [G + 'plan-a1.jpg'],
    description:
      'A 59 m\u00b2 duplex maisonette across two levels: an open-plan living, kitchen and dining area ' +
      'opening to a private balcony below, with a bedroom and bathroom on the upper floor.',
  },
  {
    id: 'apt_gazi_a2', buildingSlug: 'gazi-residences', slug: 'duplex-a2', title: 'A2 — Duplex Loft',
    status: 'available', price: 250000, unitType: 'Duplex',
    sizeInteriorSqm: 48, balconiesSqm: 8, beds: 1, baths: 2, parking: 'Optional (+\u20AC25,000)',
    floorLabel: '1st & 2nd floor',
    features: ['Two-level maisonette', 'Open-plan living & kitchen', 'Private balcony', 'Energy Class A'],
    images: [G + 'a2-living.jpg', G + 'a2-hallway.jpg', G + 'a2-balcony.jpg'], floorPlans: [G + 'plan-a2.jpg'],
    description:
      'A 48 m\u00b2 two-level duplex loft with an open living-kitchen-dining space and private balcony ' +
      'below, and a bedroom and bathroom on the upper floor.',
  },
  {
    id: 'apt_gazi_a3', buildingSlug: 'gazi-residences', slug: 'duplex-a3', title: 'A3 — Duplex Loft',
    status: 'available', price: 260000, unitType: 'Duplex',
    sizeInteriorSqm: 68, balconiesSqm: 13, beds: 1, baths: 2, parking: '1 spot included',
    floorLabel: '1st & 2nd floor',
    features: ['Two-level maisonette', 'Largest A-type loft', 'Private balcony', 'Parking included'],
    images: [G + 'a3-living.jpg', G + 'a3-kitchen.jpg', G + 'a3-bedroom.jpg', G + 'a3-balcony.jpg'], floorPlans: [G + 'plan-a3.jpg'],
    description:
      'The largest duplex loft at 68 m\u00b2, arranged over two levels with generous living space, a ' +
      'private balcony, and an upper-floor bedroom and bathroom. Parking spot included.',
  },
  {
    id: 'apt_gazi_c1', buildingSlug: 'gazi-residences', slug: 'suite-c1', title: 'C1 — Urban Suite',
    status: 'available', price: 230000, unitType: 'Simplex',
    sizeInteriorSqm: 43, balconiesSqm: 26, beds: 1, baths: 1, parking: 'Optional (+\u20AC25,000)',
    floorLabel: '3rd floor',
    features: ['Single-level layout', 'Wraparound 26 m\u00b2 balcony', 'Open-plan living', 'Energy Class A'],
    images: [G + 'c1-living.jpg', G + 'c1-bedroom.jpg', G + 'c1-balcony.jpg'], floorPlans: [G + 'plan-c1.jpg'],
    description:
      'A 43 m\u00b2 one-bedroom suite on the third floor with an open-plan layout and a wraparound ' +
      '26 m\u00b2 balcony running along both the living room and the bedroom.',
  },
  {
    id: 'apt_gazi_c2', buildingSlug: 'gazi-residences', slug: 'suite-c2', title: 'C2 — Urban Suite',
    status: 'available', price: 260000, unitType: 'Simplex',
    sizeInteriorSqm: 43, balconiesSqm: 13, beds: 1, baths: 1, parking: 'Optional (+\u20AC25,000)',
    floorLabel: '3rd floor',
    features: ['Single-level layout', 'Open-plan living & kitchen', 'Private balcony', 'Energy Class A'],
    images: [], floorPlans: [G + 'plan-c2.jpg'],
    description: 'A 43 m\u00b2 one-bedroom third-floor suite with an open-plan living-kitchen-dining area and private balcony.',
  },
  {
    id: 'apt_gazi_c3', buildingSlug: 'gazi-residences', slug: 'suite-c3', title: 'C3 — Urban Suite',
    status: 'reserved', price: 200000, unitType: 'Simplex',
    sizeInteriorSqm: 39, balconiesSqm: 8, beds: 1, baths: 1, parking: 'Optional (+\u20AC25,000)',
    floorLabel: '3rd floor',
    features: ['Single-level layout', 'Open-plan living', 'Private balcony', 'Energy Class A'],
    images: [G + 'c3-kitchen.jpg', G + 'c3-bedroom.jpg'], floorPlans: [G + 'plan-c3.jpg'],
    description: 'A 39 m\u00b2 one-bedroom third-floor suite with an efficient open-plan layout and a private balcony.',
  },
  {
    id: 'apt_gazi_d1', buildingSlug: 'gazi-residences', slug: 'suite-d1', title: 'D1 — Urban Suite',
    status: 'available', price: 420000, unitType: 'Simplex',
    sizeInteriorSqm: 85, balconiesSqm: 35, beds: 2, baths: 2, parking: '1 spot included',
    floorLabel: '4th floor',
    features: ['Largest suite', 'Two bedrooms, two baths', 'Expansive 35 m\u00b2 balcony', 'Parking included'],
    images: [G + 'd1-living.jpg', G + 'd1-balcony.jpg'], floorPlans: [G + 'plan-d1.jpg'],
    description:
      'An 85 m\u00b2 two-bedroom residence on the fourth floor \u2014 the building\u2019s largest suite \u2014 ' +
      'with two bathrooms, an open-plan living area, and an expansive 35 m\u00b2 balcony. Parking included.',
  },
  {
    id: 'apt_gazi_d2', buildingSlug: 'gazi-residences', slug: 'suite-d2', title: 'D2 — Urban Suite',
    status: 'reserved', price: 220000, unitType: 'Simplex',
    sizeInteriorSqm: 36, balconiesSqm: 8, beds: 1, baths: 1, parking: 'Optional (+\u20AC25,000)',
    floorLabel: '4th floor',
    features: ['Single-level layout', 'Open-plan living', 'Private balcony', 'Energy Class A'],
    images: [G + 'd2-kitchen.jpg', G + 'd2-bedroom.jpg'], floorPlans: [G + 'plan-d2.jpg'],
    description: 'A 36 m\u00b2 one-bedroom fourth-floor suite with an open-plan layout and a private balcony.',
  },
  {
    id: 'apt_gazi_e1', buildingSlug: 'gazi-residences', slug: 'suite-e1', title: 'E1 — Urban Suite',
    status: 'available', price: 420000, unitType: 'Simplex',
    sizeInteriorSqm: 66, balconiesSqm: 32, beds: 2, baths: 2, parking: '1 spot included',
    floorLabel: '5th floor',
    features: ['Two bedrooms, two baths', 'Generous 32 m\u00b2 balcony', 'Open-plan living', 'Parking included'],
    images: [G + 'e1-living.jpg', G + 'e1-bedroom.jpg'], floorPlans: [G + 'plan-e1.jpg'],
    description:
      'A 66 m\u00b2 two-bedroom fifth-floor residence with two bathrooms, open-plan living, and a ' +
      'generous 32 m\u00b2 balcony. Parking included.',
  },
  {
    id: 'apt_gazi_e2', buildingSlug: 'gazi-residences', slug: 'suite-e2', title: 'E2 — Urban Suite',
    status: 'reserved', price: 240000, unitType: 'Simplex',
    sizeInteriorSqm: 36, balconiesSqm: 8, beds: 1, baths: 1, parking: 'Optional (+\u20AC25,000)',
    floorLabel: '5th floor',
    features: ['Single-level layout', 'Open-plan living', 'Private balcony', 'Energy Class A'],
    images: [G + 'e2-kitchen.jpg', G + 'e2-bedroom.jpg'], floorPlans: [G + 'plan-e2.jpg'],
    description: 'A 36 m\u00b2 one-bedroom fifth-floor suite with an open-plan layout and a private balcony.',
  },
  {
    id: 'apt_gazi_f1', buildingSlug: 'gazi-residences', slug: 'suite-f1', title: 'F1 — Urban Suite',
    status: 'sold', price: 285000, unitType: 'Simplex',
    sizeInteriorSqm: 48, balconiesSqm: 43, beds: 2, baths: 1, parking: '1 spot included',
    floorLabel: '6th floor',
    features: ['Two bedrooms', 'Large 43 m\u00b2 terrace', 'Athens views', 'Parking included'],
    images: [], floorPlans: [G + 'plan-f1.jpg'],
    description:
      'A 48 m\u00b2 two-bedroom suite on the sixth floor with a large 43 m\u00b2 terrace and open Athens views. Parking included.',
  },
  {
    id: 'apt_gazi_h1', buildingSlug: 'gazi-residences', slug: 'suite-h1', title: 'H1 — Urban Suite',
    status: 'sold', price: 295000, unitType: 'Simplex',
    sizeInteriorSqm: 47, balconiesSqm: 9, beds: 1, baths: 1, parking: '1 spot included',
    floorLabel: '7th floor (top)',
    features: ['Top-floor suite', 'Private balcony', 'Open Athens views', 'Parking included'],
    images: [], floorPlans: [G + 'plan-h1.jpg'],
    description:
      'A 47 m\u00b2 one-bedroom suite on the seventh (top) floor with a private balcony and open Athens views. Parking included.',
  },
];

export const apartments: Apartment[] = rawApartments.map((a) => ({
  ...a, priceText: priceLabel(a.price, a.status),
}));
