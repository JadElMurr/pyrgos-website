import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, ArrowRight, Bed, Bath, Maximize, Car, Sun, Trees, Building as BuildingIcon, Expand } from 'lucide-react';
import { buildings, apartments as allApartments, type Building, type Apartment } from '../data/pyrgosData';
import Reveal from '../components/Reveal';
import Lightbox from '../components/Lightbox';

type Spec = { icon: React.ElementType; label: string; value: string };

export default function ApartmentDetail() {
  const { slug: buildingSlug, apartmentSlug } = useParams<{ slug: string; apartmentSlug: string }>();
  const [active, setActive] = useState(0);
  const [lb, setLb] = useState<{ imgs: string[]; idx: number } | null>(null);

  const building: Building | null = useMemo(
    () => buildings.find((b) => b.slug === buildingSlug) || null,
    [buildingSlug]
  );
  const apartment: Apartment | null = useMemo(
    () => allApartments.find((a) => a.buildingSlug === buildingSlug && a.slug === apartmentSlug) || null,
    [buildingSlug, apartmentSlug]
  );

  if (!building || !apartment) {
    return (
      <div className="pt-32 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-soft text-lg mb-6">Apartment not found</p>
          <Link to="/projects" className="text-ink border-b border-bronze pb-1">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const sold = apartment.status === 'sold';
  const images = apartment.images;
  const plans = apartment.floorPlans ?? [];

  const specs: Spec[] = [
    apartment.sizeInteriorSqm != null && { icon: Maximize, label: 'Interior', value: `${apartment.sizeInteriorSqm} m²` },
    apartment.balconiesSqm != null && { icon: Sun, label: 'Balconies', value: `${apartment.balconiesSqm} m²` },
    apartment.gardenSqm != null && { icon: Trees, label: 'Private garden', value: `${apartment.gardenSqm} m²` },
    apartment.beds != null && { icon: Bed, label: 'Bedrooms', value: `${apartment.beds}` },
    apartment.baths != null && { icon: Bath, label: 'Bathrooms', value: `${apartment.baths}` },
    apartment.parking != null && { icon: Car, label: 'Parking', value: `${apartment.parking}` },
    apartment.floorLabel ? { icon: BuildingIcon, label: 'Floor', value: apartment.floorLabel } : null,
  ].filter(Boolean) as Spec[];

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm">
          <Link to="/projects" className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" /> Projects
          </Link>
          <Link to={`/projects/${building.slug}`} className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" /> {building.title}
          </Link>
        </div>

        {/* Gallery */}
        <Reveal>
          <button onClick={() => setLb({ imgs: images, idx: active })} className="group relative w-full aspect-[16/10] md:aspect-[16/8] overflow-hidden block">
            <img src={images[active]} alt={apartment.title} className={`w-full h-full object-cover ${sold ? 'grayscale-[25%]' : ''}`} />
            {sold && <span className="absolute top-5 left-5 bg-ink text-ivory text-xs tracking-luxe uppercase px-4 py-2">Sold</span>}
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-ink/70 text-ivory text-xs tracking-wide px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand className="h-4 w-4" /> View gallery
            </span>
          </button>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-[4/3] overflow-hidden transition-all ${active === i ? 'ring-2 ring-bronze' : 'opacity-60 hover:opacity-100'}`}>
                <img src={img} alt={`${apartment.title} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Title + specs */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-3">{building.title} · {building.location}</p>
              <div className="flex flex-wrap items-baseline gap-4 mb-6">
                <h1 className="font-display font-light text-5xl sm:text-6xl tracking-tightest text-ink">{apartment.title}</h1>
                {sold && <span className="bg-ink text-ivory text-xs tracking-luxe uppercase px-3 py-1.5">Sold</span>}
              </div>
              <p className="font-display text-3xl text-ink mb-8">{apartment.priceText}</p>
              {apartment.description && (
                <p className="text-ink-soft text-lg leading-relaxed font-light mb-10">{apartment.description}</p>
              )}

              {/* Specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-line border border-line">
                {specs.map((s) => (
                  <div key={s.label} className="bg-paper p-5">
                    <s.icon className="h-5 w-5 text-bronze mb-3" />
                    <p className="text-ink-mute text-xs uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-ink font-medium">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              {apartment.features.length > 0 && (
                <div className="mt-10">
                  <p className="eyebrow mb-4">Features</p>
                  <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-8">
                    {apartment.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-ink-soft">
                        <span className="mt-2 h-1 w-1 rounded-full bg-bronze flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>

          {/* Inquire card */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={120}>
              <div className="lg:sticky lg:top-28 border border-line bg-paper p-8">
                <p className="eyebrow mb-2">{sold ? 'Status' : 'Price'}</p>
                <p className="font-display text-3xl text-ink mb-6">{apartment.priceText}</p>
                <div className="space-y-3 text-sm border-t border-line pt-6 mb-8">
                  <div className="flex justify-between"><span className="text-ink-mute">Residence</span><span className="text-ink">{building.title}</span></div>
                  <div className="flex justify-between"><span className="text-ink-mute">Location</span><span className="text-ink">{building.location}, Athens</span></div>
                  {apartment.floorLabel && <div className="flex justify-between"><span className="text-ink-mute">Floor</span><span className="text-ink">{apartment.floorLabel}</span></div>}
                </div>
                <Link to="/contact" className="w-full inline-flex items-center justify-center gap-2 bg-ink text-ivory py-3.5 hover:bg-bronze transition-colors tracking-wide">
                  {sold ? 'Enquire about similar' : 'Inquire Now'} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Floor plans */}
        {plans.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <p className="eyebrow mb-3">Floor Plan{plans.length > 1 ? 's' : ''}</p>
              <h2 className="font-display font-light text-3xl tracking-tight text-ink mb-8">Layout</h2>
              <div className={`grid gap-6 ${plans.length > 1 ? 'md:grid-cols-2' : ''}`}>
                {plans.map((p, i) => (
                  <button key={i} onClick={() => setLb({ imgs: plans, idx: i })} className="group block bg-paper border border-line p-4 hover:border-bronze transition-colors">
                    <img src={p} alt={`${apartment.title} floor plan ${i + 1}`} className="w-full h-auto" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="bg-ink mt-28">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-20 text-center">
          <Reveal>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-ivory tracking-tight mb-5">
              {sold ? 'Interested in a similar residence?' : 'Interested in this residence?'}
            </h2>
            <p className="text-ivory/70 font-light max-w-xl mx-auto mb-8">
              Contact our team to learn more, request the full brochure, or schedule a viewing.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-3 bg-ivory text-ink px-8 py-4 hover:bg-bronze hover:text-ivory transition-colors tracking-wide">
              Contact Us <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {lb && <Lightbox images={lb.imgs} index={lb.idx} onClose={() => setLb(null)} onIndex={(i) => setLb({ ...lb, idx: i })} />}
    </div>
  );
}
