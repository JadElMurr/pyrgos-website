import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Bed, Bath, Maximize } from 'lucide-react';
import { apartments as allApartments, buildings, type Apartment } from '../data/pyrgosData';
import Reveal from '../components/Reveal';
import ImageFrame from '../components/ImageFrame';

type StatusFilter = 'available' | 'all';
type BedsFilter = 'any' | '1' | '2' | '3';
type PriceFilter = 'any' | 'lt300' | '300to600' | 'gt600';
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'size-desc';

const selectCls =
  'w-full border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-bronze transition-colors appearance-none';

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-xs tracking-luxe uppercase text-ink-mute mb-1.5">{label}</span>
      <select className={selectCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function Residences() {
  const [status, setStatus] = useState<StatusFilter>('available');
  const [beds, setBeds] = useState<BedsFilter>('any');
  const [price, setPrice] = useState<PriceFilter>('any');
  const [bSlug, setBSlug] = useState<string>('any');
  const [sort, setSort] = useState<SortKey>('featured');

  const publishedBuildings = buildings.filter((b) => b.status !== 'upcoming');
  const byBuilding = useMemo(() => new Map(buildings.map((b) => [b.slug, b])), []);
  const pool = useMemo(
    () => allApartments.filter((a) => byBuilding.get(a.buildingSlug)?.status !== 'upcoming'),
    [byBuilding],
  );

  const results = useMemo(() => {
    let list = pool.filter((a) => {
      if (status === 'available' && a.status !== 'available') return false;
      if (bSlug !== 'any' && a.buildingSlug !== bSlug) return false;
      if (beds !== 'any') {
        if (a.beds == null) return false;
        if (beds === '3' ? a.beds < 3 : a.beds !== Number(beds)) return false;
      }
      if (price !== 'any') {
        if (a.price == null) return false;
        if (price === 'lt300' && a.price >= 300000) return false;
        if (price === '300to600' && (a.price < 300000 || a.price > 600000)) return false;
        if (price === 'gt600' && a.price <= 600000) return false;
      }
      return true;
    });
    const priceOf = (a: Apartment) => a.price ?? Number.MAX_SAFE_INTEGER;
    if (sort === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'price-desc') list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === 'size-desc') list = [...list].sort((a, b) => (b.sizeInteriorSqm ?? 0) - (a.sizeInteriorSqm ?? 0));
    return list;
  }, [pool, status, beds, price, bSlug, sort]);

  return (
    <div className="pt-32 sm:pt-36 pb-24">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Residences</p>
          <h1 className="font-display font-light text-5xl sm:text-6xl tracking-tightest text-ink mb-5">
            Every residence, in one place.
          </h1>
          <p className="text-ink-soft text-lg font-light leading-relaxed max-w-2xl mb-12">
            Browse all apartments across our developments — filter by availability, bedrooms, and budget
            to find the home that fits.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal delay={60}>
          <div className="border border-line bg-paper p-4 sm:p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <FilterSelect
              label="Availability" value={status} onChange={(v) => setStatus(v as StatusFilter)}
              options={[{ value: 'available', label: 'Available' }, { value: 'all', label: 'All residences' }]}
            />
            <FilterSelect
              label="Building" value={bSlug} onChange={setBSlug}
              options={[{ value: 'any', label: 'All buildings' }, ...publishedBuildings.map((b) => ({ value: b.slug, label: b.title }))]}
            />
            <FilterSelect
              label="Bedrooms" value={beds} onChange={(v) => setBeds(v as BedsFilter)}
              options={[
                { value: 'any', label: 'Any' }, { value: '1', label: '1 bedroom' },
                { value: '2', label: '2 bedrooms' }, { value: '3', label: '3+ bedrooms' },
              ]}
            />
            <FilterSelect
              label="Budget" value={price} onChange={(v) => setPrice(v as PriceFilter)}
              options={[
                { value: 'any', label: 'Any' }, { value: 'lt300', label: 'Under €300k' },
                { value: '300to600', label: '€300k – €600k' }, { value: 'gt600', label: 'Over €600k' },
              ]}
            />
            <FilterSelect
              label="Sort by" value={sort} onChange={(v) => setSort(v as SortKey)}
              options={[
                { value: 'featured', label: 'Featured' }, { value: 'price-asc', label: 'Price — low to high' },
                { value: 'price-desc', label: 'Price — high to low' }, { value: 'size-desc', label: 'Size — largest first' },
              ]}
            />
          </div>
        </Reveal>

        <p className="text-ink-mute text-sm mb-10">
          Showing {results.length} of {pool.length} residences
        </p>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {results.map((u, i) => {
              const building = byBuilding.get(u.buildingSlug);
              if (!building) return null;
              const sold = u.status === 'sold';
              const reserved = u.status === 'reserved';
              const card = u.images[0] ?? u.floorPlans?.[0] ?? building.images[0];
              return (
                <Reveal key={u.id} delay={Math.min(i, 5) * 60}>
                  <Link to={`/projects/${building.slug}/apartments/${u.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden mb-5">
                      <ImageFrame src={card} alt={u.title} className="w-full h-full" imgClassName={`transition-transform duration-700 group-hover:scale-105 ${sold ? 'grayscale-[35%]' : ''}`} />
                      {sold && <span className="absolute z-20 top-4 left-4 bg-ink text-ivory text-xs tracking-luxe uppercase px-3 py-1.5">Sold</span>}
                      {reserved && <span className="absolute z-20 top-4 left-4 bg-bronze text-ivory text-xs tracking-luxe uppercase px-3 py-1.5">Reserved</span>}
                    </div>
                    <div className="flex items-baseline justify-between mb-1.5 gap-3">
                      <h3 className="font-display text-2xl text-ink group-hover:text-bronze transition-colors">{u.title}</h3>
                      <span className={`text-sm whitespace-nowrap ${sold ? 'text-ink-mute' : 'text-ink-soft'}`}>{u.priceText}</span>
                    </div>
                    <p className="text-ink-mute text-sm mb-4">
                      {building.title}, {building.location}{u.unitType ? ` · ${u.unitType}` : ''}{u.floorLabel ? ` · ${u.floorLabel}` : ''}
                    </p>
                    <div className="flex items-center gap-5 text-ink-soft text-sm">
                      {u.beds != null && <span className="inline-flex items-center gap-1.5"><Bed className="h-4 w-4 text-bronze" />{u.beds}</span>}
                      {u.baths != null && <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-bronze" />{u.baths}</span>}
                      {u.sizeInteriorSqm != null && <span className="inline-flex items-center gap-1.5"><Maximize className="h-4 w-4 text-bronze" />{u.sizeInteriorSqm} m²</span>}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="border-t border-line pt-16 text-center">
            <p className="text-ink-soft font-light text-lg mb-3">No residences match those filters.</p>
            <button
              type="button"
              onClick={() => { setStatus('all'); setBeds('any'); setPrice('any'); setBSlug('any'); }}
              className="text-ink border-b border-bronze pb-0.5 hover:text-bronze transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
