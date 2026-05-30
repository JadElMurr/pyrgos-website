// =============================================================================
//  PYRGOS — WEBSITE CONTENT CONTROL PANEL
// -----------------------------------------------------------------------------
//  Everything a non-developer needs to change lives in THIS file.
//  Edit a value, save the file, and the website updates.
//  (To preview locally: run `npm run dev` and open the address it prints.)
//
//  Safe to edit:  text in 'quotes', numbers, true/false, image filenames.
//  Don't touch:   the words before the colons, the brackets [ ] { }, or commas.
// =============================================================================


// ---- 1. SHOW PRICES? --------------------------------------------------------
//  true  -> the euro prices below are shown on the site.
//  false -> every unit shows "Price on request" instead.
export const PUBLISH_PRICES = true;


// ---- 2. COMPANY & CONTACT DETAILS ------------------------------------------
//  These feed the header, footer, and Contact page everywhere at once.
export const siteConfig = {
  companyName: 'Pyrgos Real Estate',
  shortName: 'PYRGOS',
  tagline:
    'Delivering well-designed residential projects with meticulous attention to quality, planning, and execution.',

  // The main address people should reach. The other one redirects to it.
  primaryDomain: 'pyrgosgr.com',
  secondaryDomain: 'pyrgosdio.com',

  email: 'PyrgosDio@gmail.com',
  address: 'Koronis 4, Athens 11471, Greece',
  locationShort: 'Athens, Greece',

  // Add, remove, or edit phone lines freely.
  phones: [
    { label: 'Athens', display: '+30 698 610 8962', href: 'tel:+306986108962' },
    { label: 'Beirut', display: '+961 3 297 130', href: 'tel:+9613297130' },
  ],

  // Downloadable brochure per building (file lives in /public/brochures/).
  brochures: {
    'palmiras-16': '/brochures/palmiras-16.pdf',
  } as Record<string, string>,
};


// ---- helpers (no need to edit) ---------------------------------------------
const eur = (n: number) => '€' + n.toLocaleString('en-US');
const priceLabel = (price?: number, status?: ApartmentStatus) => {
  if (status === 'sold') return 'Sold';
  if (PUBLISH_PRICES && price) return eur(price);
  return 'Price on request';
};


// ---- types (no need to edit) -----------------------------------------------
export type ApartmentStatus = 'available' | 'sold' | 'reserved';

export type Apartment = {
  id: string;
  buildingSlug: string;
  slug: string;
  title: string;
  status: ApartmentStatus;
  price?: number;          // euro number; leave out if unknown
  priceText: string;       // auto-filled from price + status
  sizeInteriorSqm?: number;
  balconiesSqm?: number;
  gardenSqm?: number;
  beds?: number;
  baths?: number;
  floorLabel?: string;
  features: string[];
  images: string[];
  description?: string;
};

export type Building = {
  id: string;
  slug: string;
  title: string;
  location: 'Gazi' | 'Glyfada';
  startingPriceText: string;
  description: string;
  locationDescription?: string;
  images: string[];
  highlights: string[];
};


// ---- 3. BUILDINGS -----------------------------------------------------------
export const buildings: Building[] = [
  {
    id: 'bld_palmiras_16',
    slug: 'palmiras-16',
    title: 'Palmiras 16',
    location: 'Glyfada',
    startingPriceText: PUBLISH_PRICES ? 'From ' + eur(565000) : 'Price on request',
    description:
      'Palmiras 16 is a contemporary residential building defined by clarity of form, ' +
      'lightness, and a strong relationship between interior and exterior space. The clean ' +
      'white volume is shaped by a rhythmic stacking of floors and recessed balconies, with ' +
      'full-height glazing that draws natural light deep into warm, light-filled interiors. ' +
      'Transparent glass balustrades and integrated planters soften the geometry, while a ' +
      'rooftop garden with louvered shading crowns the building.',
    locationDescription:
      'Glyfada, along the southern coastline of Athens, is one of the city\u2019s most ' +
      'prestigious districts \u2014 renowned for its seaside lifestyle, upscale shopping ' +
      'streets, cafes, and international schools. Just minutes from the beaches of the ' +
      'Athenian Riviera, it balances refined urban living with coastal leisure, making it ' +
      'one of southern Athens\u2019 most sought-after addresses for both living and investment.',
    images: [
      '/images/palmiras/palmiras-exterior.jpg',
      '/images/palmiras/palmiras-exterior-day.jpg',
      '/images/palmiras/palmiras-roof-garden.jpg',
      '/images/palmiras/palmiras-garden-pool.jpg',
    ],
    highlights: [
      'New construction',
      '5-floor residential building',
      '4 apartments',
      '2\u20133 bedrooms, 1\u20132 bathrooms',
      'Interior areas approx. 75\u201399 sqm',
      'Private parking & storage',
      'Rooftop garden with Athens views',
      'Sustainable, high-luminosity design',
    ],
  },
];


// ---- 4. APARTMENTS ----------------------------------------------------------
//  To mark a unit sold: change   status: 'available'   to   status: 'sold'
//  To change a price:   edit the  price:  number.
const rawApartments: Omit<Apartment, 'priceText'>[] = [
  {
    id: 'apt_palmiras_d1',
    buildingSlug: 'palmiras-16',
    slug: 'duplex-d1',
    title: 'Duplex D1',
    status: 'available',
    price: 800000,
    sizeInteriorSqm: 77.2,
    balconiesSqm: 5.25,
    gardenSqm: 106.78,
    beds: 2,
    baths: 2,
    floorLabel: 'Ground & 1st floor',
    features: ['Duplex layout', 'Private garden', 'Parking & storage', 'Modern finishes'],
    images: [
      '/images/palmiras/d1-living.jpg',
      '/images/palmiras/d1-bedroom.jpg',
      '/images/palmiras/d1-kitchen.jpg',
      '/images/palmiras/d1-bathroom.jpg',
    ],
    description:
      'A ground-floor duplex opening onto a generous private garden. Two bedrooms and two ' +
      'bathrooms across two levels, with an open living-dining-kitchen space, full-height ' +
      'glazing, and warm contemporary finishes.',
  },
  {
    id: 'apt_palmiras_d2',
    buildingSlug: 'palmiras-16',
    slug: 'duplex-d2',
    title: 'Duplex D2',
    status: 'available',
    price: 780000,
    sizeInteriorSqm: 98.9,
    balconiesSqm: 37.05,
    beds: 3,
    baths: 2,
    floorLabel: '1st & 2nd floor',
    features: ['Duplex layout', 'Large balconies', 'Master en-suite', 'Parking & storage'],
    images: [
      '/images/palmiras/d2-living.jpg',
      '/images/palmiras/d2-bedroom.jpg',
      '/images/palmiras/d2-kitchen.jpg',
      '/images/palmiras/d2-bathroom.jpg',
    ],
    description:
      'The largest residence: a three-bedroom duplex with a master en-suite and generous ' +
      'wrap-around balconies. An airy double-height feel, premium materials, and abundant ' +
      'natural light throughout.',
  },
  {
    id: 'apt_palmiras_d3',
    buildingSlug: 'palmiras-16',
    slug: 'simplex-d3',
    title: 'Simplex D3',
    status: 'available',
    price: 565000,
    sizeInteriorSqm: 75.35,
    balconiesSqm: 18.87,
    beds: 2,
    baths: 1,
    floorLabel: '3rd floor',
    features: ['Single-level layout', 'Generous balconies', 'Bright interior', 'Parking & storage'],
    images: [
      '/images/palmiras/d3-d4-living.jpg',
      '/images/palmiras/d3-d4-bedroom.jpg',
      '/images/palmiras/d3-d4-kitchen.jpg',
      '/images/palmiras/d3-d4-bathroom.jpg',
    ],
    description:
      'A bright single-level two-bedroom residence with generous balconies and an efficient, ' +
      'open plan. Calm contemporary interiors with full-height glazing.',
  },
  {
    id: 'apt_palmiras_d4',
    buildingSlug: 'palmiras-16',
    slug: 'simplex-d4',
    title: 'Simplex D4',
    status: 'sold',
    price: 535000,
    sizeInteriorSqm: 76.96,
    balconiesSqm: 18.87,
    beds: 2,
    baths: 1,
    floorLabel: '4th floor',
    features: ['Single-level layout', 'Generous balconies', 'Elevated views', 'Parking & storage'],
    images: [
      '/images/palmiras/d3-d4-living.jpg',
      '/images/palmiras/d3-d4-bedroom.jpg',
      '/images/palmiras/d3-d4-kitchen.jpg',
      '/images/palmiras/d3-d4-bathroom.jpg',
    ],
    description:
      'A single-level two-bedroom residence on the fourth floor with elevated views and ' +
      'generous balconies.',
  },
];

export const apartments: Apartment[] = rawApartments.map((a) => ({
  ...a,
  priceText: priceLabel(a.price, a.status),
}));
