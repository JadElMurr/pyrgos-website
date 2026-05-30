import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, BookOpen, Bed, Bath, Maximize } from 'lucide-react';
import { buildings, apartments as allApartments, type Building, type Apartment } from '../data/pyrgosData';
import Reveal from '../components/Reveal';
import Lightbox from '../components/Lightbox';
import ImageFrame from '../components/ImageFrame';
import Gallery from '../components/Gallery';
import BrochureViewer from '../components/BrochureViewer';

export default function BuildingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [lb, setLb] = useState<{ imgs: string[]; idx: number } | null>(null);
  const [brochure, setBrochure] = useState(false);

  const building: Building | null = useMemo(() => buildings.find((b) => b.slug === slug) || null, [slug]);
  const units: Apartment[] = useMemo(() => allApartments.filter((a) => a.buildingSlug === slug), [slug]);

  if (!building) {
    return (
      <div className="pt-32 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-soft text-lg mb-6">Building not found</p>
          <Link to="/projects" className="text-ink border-b border-bronze pb-1">Back to Projects</Link>
        </div>
      </div>
    );
  }

  if (building.status === 'upcoming' || building.images.length === 0) {
    return (
      <div className="pt-28 pb-24">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
          <Link to="/projects" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> <span className="tracking-wide text-sm">Projects</span>
          </Link>
          <Reveal>
            <p className="eyebrow mb-3">{building.address ?? `${building.location}, Athens`}</p>
            <div className="flex items-baseline gap-4 flex-wrap mb-6">
              <h1 className="font-display font-light text-5xl sm:text-6xl tracking-tightest text-ink">{building.title}</h1>
              <span className="text-bronze text-xs tracking-luxe uppercase border border-bronze/40 px-3 py-1.5">In development</span>
            </div>
            <p className="text-ink-soft text-lg leading-relaxed font-light max-w-2xl mb-10">{building.description}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-ink text-ivory px-7 py-3.5 hover:bg-bronze transition-colors tracking-wide">
              Register interest
            </Link>
          </Reveal>
        </div>
      </div>
    );
  }

  const images = building.images;
  const interiors = building.interiorImages ?? [];

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <Link to="/projects" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> <span className="tracking-wide text-sm">Projects</span>
        </Link>

        {/* Gallery */}
        <Reveal>
          <Gallery images={images} alt={building.title} aspectClass="aspect-[4/3]" />
        </Reveal>

        {/* Title + intro */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-3">{building.address ?? `${building.location}, Athens`}</p>
              <h1 className="font-display font-light text-5xl sm:text-6xl tracking-tightest text-ink mb-6">{building.title}</h1>
              <p className="text-ink-soft text-lg leading-relaxed font-light">{building.description}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={120}>
              <div className="border border-line p-8 bg-paper">
                <p className="eyebrow mb-2">Starting price</p>
                <p className="font-display text-3xl text-ink mb-6">{building.startingPriceText}</p>
                <ul className="space-y-2.5 mb-8">
                  {building.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-ink-soft text-sm">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-bronze flex-shrink-0" /><span>{h}</span>
                    </li>
                  ))}
                </ul>
                {building.brochure && (
                  <button onClick={() => setBrochure(true)} className="w-full inline-flex items-center justify-center gap-2 bg-ink text-ivory py-3.5 hover:bg-bronze transition-colors tracking-wide">
                    <BookOpen className="h-4 w-4" /> View Brochure
                  </button>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Residences */}
        <div className="mt-28">
          <Reveal>
            <p className="eyebrow mb-3">The Residences</p>
            <h2 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink mb-12">
              {units.length} {units.length === 1 ? 'apartment' : 'apartments'}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((u, i) => {
              const sold = u.status === 'sold';
              const reserved = u.status === 'reserved';
              const card = u.images[0] ?? u.floorPlans?.[0] ?? building.images[0];
              return (
                <Reveal key={u.id} delay={i * 60}>
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
                    <p className="text-ink-mute text-sm mb-4">{u.unitType ? `${u.unitType} · ` : ''}{u.floorLabel}</p>
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
        </div>

        {/* Indicative interiors */}
        {interiors.length > 0 && (
          <div className="mt-28">
            <Reveal>
              <p className="eyebrow mb-3">Interiors</p>
              <h2 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink mb-3">Inside the residences</h2>
              <p className="text-ink-mute text-sm mb-10 max-w-xl">Indicative interior renders, representative of the apartment styles in this building.</p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interiors.map((it, i) => (
                <Reveal key={it.src} delay={i * 60}>
                  <button onClick={() => setLb({ imgs: interiors.map((x) => x.src), idx: i })} className="group block w-full text-left">
                    <div className="aspect-[4/3] overflow-hidden mb-3">
                      <ImageFrame src={it.src} alt={it.caption} className="w-full h-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <p className="text-ink-soft text-sm">{it.caption}</p>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {building.locationDescription && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-28">
            <Reveal>
              <ImageFrame
                src={building.locationImage ?? building.images[0]}
                alt={`${building.location}, Athens`}
                className="aspect-[5/4]"
              />
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow mb-4">The Location</p>
              <h2 className="font-display font-light text-4xl tracking-tight text-ink mb-6">{building.location}</h2>
              <p className="text-ink-soft text-lg leading-relaxed font-light">{building.locationDescription}</p>
            </Reveal>
          </div>
        )}
      </div>

      {lb && <Lightbox images={lb.imgs} index={lb.idx} onClose={() => setLb(null)} onIndex={(i) => setLb({ ...lb, idx: i })} />}
      {brochure && building.brochure && (
        <BrochureViewer pdf={building.brochure.pdf} pages={building.brochure.pages} dir={building.brochure.dir} title={`${building.title} — Brochure`} onClose={() => setBrochure(false)} />
      )}
    </div>
  );
}
