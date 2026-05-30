import { Link } from 'react-router';
import { ArrowRight, MapPin } from 'lucide-react';
import { buildings, type Building } from '../data/pyrgosData';
import Reveal from '../components/Reveal';

function ProjectRow({ building, index }: { building: Building; index: number }) {
  const flip = index % 2 === 1;
  return (
    <Reveal>
      <Link to={`/projects/${building.slug}`} className="group block">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 border-t border-line">
          <div className={`overflow-hidden aspect-[4/3] ${flip ? 'lg:order-2' : ''}`}>
            <img
              src={building.images[0]}
              alt={building.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.2s]"
            />
          </div>
          <div className={flip ? 'lg:order-1' : ''}>
            <div className="flex items-center gap-2 text-bronze text-sm mb-3">
              <MapPin className="h-4 w-4" />
              <span className="tracking-wide">{building.location}</span>
            </div>
            <h3 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink mb-4 group-hover:text-bronze transition-colors">
              {building.title}
            </h3>
            <p className="text-ink-soft text-lg font-light leading-relaxed mb-6 max-w-xl">
              {building.description}
            </p>
            <p className="text-ink font-medium mb-6">{building.startingPriceText}</p>
            <span className="inline-flex items-center gap-3 text-ink border-b border-bronze pb-1 group-hover:gap-4 transition-all">
              <span className="tracking-wide">View building</span>
              <ArrowRight className="h-4 w-4 text-bronze" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Projects() {
  const glyfada = buildings.filter((b) => b.location === 'Glyfada');
  const gazi = buildings.filter((b) => b.location === 'Gazi');

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow mb-4">Developments</p>
          <h1 className="font-display font-light text-5xl sm:text-6xl lg:text-7xl tracking-tightest text-ink mb-16 max-w-3xl">
            A focused portfolio across Athens.
          </h1>
        </Reveal>

        {glyfada.map((b, i) => (
          <ProjectRow key={b.id} building={b} index={i} />
        ))}

        {/* Gazi — upcoming */}
        <Reveal>
          <div className="border-t border-line py-12 mt-4">
            <div className="flex items-center gap-2 text-ink-mute text-sm mb-3">
              <MapPin className="h-4 w-4" />
              <span className="tracking-wide">Gazi</span>
            </div>
            {gazi.length === 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <h3 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink-mute">
                  Gazi — in development
                </h3>
                <p className="text-ink-soft font-light max-w-md">
                  A new Pyrgos residence in central Athens. Brochure and availability to be
                  published shortly.
                </p>
              </div>
            ) : (
              gazi.map((b, i) => <ProjectRow key={b.id} building={b} index={i} />)
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
