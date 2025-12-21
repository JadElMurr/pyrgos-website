// src/data/pyrgosData.ts

export type Apartment = {
  id: string;
  buildingSlug: string;
  slug: string;
  title: string;
  priceText: string; // "Price on request"
  sizeInteriorSqm?: number;
  balconiesSqm?: number;
  beds?: number;
  baths?: number;
  floorLabel?: string;
  features: string[];
  images: string[]; // add later
  description?: string;
};

export type Building = {
  id: string;
  slug: string;
  title: string;
  location: 'Gazi' | 'Glyfada';
  startingPriceText: string; // "Price on request"
  description: string;
  images: string[]; // add later
  highlights: string[];
};

export const buildings: Building[] = [
  {
    id: 'bld_palmiras_16',
    slug: 'palmiras-16',
    title: 'Palmiras 16',
    location: 'Glyfada',
    startingPriceText: 'Price on request',
    description:
      'Palmiras 16 is a contemporary residential development in Glyfada, designed with clean architecture, recessed balconies, and a calm modern interior feel. Explore the building overview first, then browse the apartments individually.',
    images: [], // add later
    highlights: [
      '5-floor residential building',
      '5 apartments',
      '2–3 bedrooms',
      '1–2 bathrooms',
      'Interior areas approx. 65.57–98.90 sqm',
      'Parking space',
    ],
  },
];

export const apartments: Apartment[] = [
  {
    id: 'apt_palmiras_d1',
    buildingSlug: 'palmiras-16',
    slug: 'duplex-d1',
    title: 'Duplex D1',
    priceText: 'Price on request',
    sizeInteriorSqm: 77.2,
    balconiesSqm: 5.25,
    beds: 2,
    baths: 2,
    floorLabel: '5th Floor',
    features: ['Duplex layout', 'Balcony', 'Parking available', 'Modern finishes'],
    images: [],
  },
  {
    id: 'apt_palmiras_d2',
    buildingSlug: 'palmiras-16',
    slug: 'duplex-d2',
    title: 'Duplex D2',
    priceText: 'Price on request',
    sizeInteriorSqm: 98.9,
    balconiesSqm: 37.05,
    beds: 3,
    baths: 2,
    floorLabel: 'Duplex',
    features: ['Duplex layout', 'Large balconies', 'Parking available', 'Premium materials'],
    images: [],
  },
  {
    id: 'apt_palmiras_d3',
    buildingSlug: 'palmiras-16',
    slug: 'simplex-d3',
    title: 'Simplex D3',
    priceText: 'Price on request',
    sizeInteriorSqm: 65.75,
    balconiesSqm: 23.4,
    beds: 2,
    baths: 1,
    floorLabel: 'Simplex',
    features: ['Simplex layout', 'Generous balconies', 'Bright interior', 'Efficient plan'],
    images: [],
  },
  {
    id: 'apt_palmiras_d4',
    buildingSlug: 'palmiras-16',
    slug: 'simplex-d4',
    title: 'Simplex D4',
    priceText: 'Price on request',
    sizeInteriorSqm: 65.75,
    balconiesSqm: 23.4,
    beds: 2,
    baths: 1,
    floorLabel: 'Simplex',
    features: ['Simplex layout', 'Generous balconies', 'Modern feel', 'Comfort-focused design'],
    images: [],
  },
];
