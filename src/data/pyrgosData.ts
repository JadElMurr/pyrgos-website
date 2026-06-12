// =============================================================================
//  PYRGOS — WEBSITE CONTENT LAYER
// -----------------------------------------------------------------------------
//  All editable content lives in  src/data/listings.json  and is managed
//  through the Pyrgos Studio admin panel (the /admin route on the live site).
//  This file only adds types and derived values (price labels, "From €…").
// =============================================================================
import listingsJson from './listings.json';

// ---- types ------------------------------------------------------------------
export type ApartmentStatus = 'available' | 'sold' | 'reserved';

export type Apartment = {
  id: string; buildingSlug: string; slug: string; title: string;
  status: ApartmentStatus; price?: number; priceText: string;
  unitType?: string;
  sizeInteriorSqm?: number; balconiesSqm?: number; gardenSqm?: number;
  beds?: number; baths?: number; parking?: string; floorLabel?: string;
  features: string[]; images: string[]; floorPlans?: string[]; description?: string;
};
export type RawApartment = Omit<Apartment, 'priceText'>;

export type Building = {
  id: string; slug: string; title: string; location: string;
  status?: 'available' | 'upcoming';
  address?: string; startingPriceText: string; description: string;
  locationDescription?: string; locationImage?: string; images: string[]; highlights: string[];
  interiorImages?: { src: string; caption: string }[];
  brochure?: { pdf: string; pages: number; dir: string };
};
export type RawBuilding = Omit<Building, 'startingPriceText'> & { startingPriceFrom?: number };

export type SitePhone = { label: string; display: string; href: string };
export type SiteConfig = {
  companyName: string; shortName: string; tagline: string; projectsHeadline: string;
  primaryDomain: string; secondaryDomain: string; email: string; whatsapp: string;
  address: string; locationShort: string; phones: SitePhone[];
};
export type ListingsData = {
  publishPrices: boolean; site: SiteConfig;
  buildings: RawBuilding[]; apartments: RawApartment[];
};

// ---- data -------------------------------------------------------------------
export const listings = listingsJson as unknown as ListingsData;
export const PUBLISH_PRICES = listings.publishPrices;
export const siteConfig = listings.site;

const eur = (n: number) => '\u20AC' + n.toLocaleString('en-US');
const priceLabel = (price?: number, status?: ApartmentStatus) => {
  if (status === 'sold') return 'Sold';
  if (PUBLISH_PRICES && price) return eur(price);
  return 'Price on request';
};

export const apartments: Apartment[] = listings.apartments.map((a) => ({
  ...a, priceText: priceLabel(a.price, a.status),
}));

// "From €…" derives automatically from the cheapest non-sold unit, unless a
// manual startingPriceFrom is set on the building in listings.json.
const startingFor = (b: RawBuilding): string => {
  if (b.status === 'upcoming') return 'Coming soon';
  const candidates = apartments.filter((a) => a.buildingSlug === b.slug && a.status !== 'sold' && a.price != null);
  const auto = candidates.length ? Math.min(...candidates.map((a) => a.price as number)) : undefined;
  const from = b.startingPriceFrom ?? auto;
  return PUBLISH_PRICES && from != null ? 'From ' + eur(from) : 'Price on request';
};
export const buildings: Building[] = listings.buildings.map((b) => ({ ...b, startingPriceText: startingFor(b) }));
