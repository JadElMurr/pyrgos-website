import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, BookOpen, Bed, Bath, Maximize, Expand } from 'lucide-react';
import { buildings, apartments as allApartments, type Building, type Apartment } from '../data/pyrgosData';
import Reveal from '../components/Reveal';
import Lightbox from '../components/Lightbox';
import BrochureViewer from '../components/BrochureViewer';

export default function BuildingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [brochure, setBrochure] = useState(false);

  const building: Building | null = useMemo(
    () => buildings.find((b) => b.slug === slug) || null,
    [slug]
  );
  const units: Apartment[] = useMemo(
    () => allApartments.filter((a) => a.buildingSlug === slug),
    [slug]
  );

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

  const images = building.images;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <Link to="/projects" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> <span className="tracking-wide text-sm">Projects</span>
        </Link>

        {/* Gallery */}
        <Reveal>
          <button
            onClick={() => setLightbox(true)}
            className="group relative w-full aspect-[16/10] md:aspect-[16/8] overflow-hidden block"
          >
            <img src={images[active]} alt={building.title} className="w-full h-full object-cover" />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-ink/70 text-ivory text-xs tracking-wide px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand className="h-4 w-4" /> View gallery
            </span>
          </button>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-[4/3] overflow-hidden transition-all ${active === i ? 'ring-2 ring-bronze' : 'opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`${building.title} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Title + intro */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-3">{building.location}, Athens</p>
              <h1 className="font-display font-light text-5xl sm:text-6xl tracking-tightest text-ink mb-6">
                {building.title}
              </h1>
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
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-bronze flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                {building.brochure && (
                  <button
                    onClick={() => setBrochure(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-ink text-ivory py-3.5 hover:bg-bronze transition-colors tracking-wide"
                  >
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
              Four apartments
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((u, i) => {
              const sold = u.status === 'sold';
              return (
                <Reveal key={u.id} delay={i * 80}>
                  <Link to={`/projects/${building.slug}/apartments/${u.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden mb-5">
                      <img src={u.images[0]} alt={u.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${sold ? 'grayscale-[35%]' : ''}`} />
                      {sold && (
                        <span className="absolute top-4 left-4 bg-ink text-ivory text-xs tracking-luxe uppercase px-3 py-1.5">Sold</span>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-display text-2xl text-ink group-hover:text-bronze transition-colors">{u.title}</h3>
                      <span className={`text-sm ${sold ? 'text-ink-mute' : 'text-ink-soft'}`}>{u.priceText}</span>
                    </div>
                    <p className="text-ink-mute text-sm mb-4">{u.floorLabel}</p>
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

        {/* Location */}
        {building.locationDescription && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-28">
            <Reveal>
              <div className="aspect-[5/4] overflow-hidden">
                <img src="/images/palmiras/glyfada-aerial.jpg" alt={`${building.location}, Athens`} className="w-full h-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow mb-4">The Location</p>
              <h2 className="font-display font-light text-4xl tracking-tight text-ink mb-6">{building.location}</h2>
              <p className="text-ink-soft text-lg leading-relaxed font-light">{building.locationDescription}</p>
            </Reveal>
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox images={images} index={active} onClose={() => setLightbox(false)} onIndex={setActive} />
      )}
      {brochure && building.brochure && (
        <BrochureViewer pdf={building.brochure.pdf} pages={building.brochure.pages} onClose={() => setBrochure(false)} />
      )}
    </div>
  );
}
