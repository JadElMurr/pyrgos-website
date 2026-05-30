import { Link } from 'react-router';
import { ArrowRight, ArrowDown, MapPin } from 'lucide-react';
import { siteConfig, buildings } from '../data/pyrgosData';
import Reveal from '../components/Reveal';
import ImageFrame from '../components/ImageFrame';

export default function Home() {
  const featured = buildings[0];
  const live = buildings.filter((b) => b.status !== 'upcoming');
  const upcoming = buildings.filter((b) => b.status === 'upcoming');

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/images/palmiras/building-corner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/75" />

        <div className="relative max-w-8xl mx-auto w-full px-5 sm:px-8 lg:px-12 pb-24 pt-32">
          <Reveal>
            <p className="text-ivory/80 text-xs uppercase tracking-luxe mb-6">
              {siteConfig.companyName} · Athens
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-display font-light text-ivory text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tightest max-w-4xl">
              Residences shaped by light and clarity.
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="text-ivory/80 text-lg sm:text-xl font-light max-w-xl mt-8 leading-relaxed">
              {siteConfig.tagline}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center gap-3 bg-ivory text-ink px-8 py-4 hover:bg-bronze hover:text-ivory transition-colors"
              >
                <span className="tracking-wide">View Projects</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-ivory/50 text-ivory hover:bg-ivory/10 transition-colors tracking-wide"
              >
                Arrange a Viewing
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-8 right-8 text-ivory/60 hidden sm:block animate-pulse">
          <ArrowDown className="h-5 w-5" />
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-28 sm:py-36">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Our approach</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={100}>
              <p className="font-display font-light text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-ink">
                We develop a small number of buildings with disproportionate care — favouring
                proportion, daylight, and craftsmanship over volume.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="text-ink-soft text-lg leading-relaxed mt-8 max-w-2xl font-light">
                Every Pyrgos project is conceived as a calm, light-filled place to live, with a clear
                relationship between interior and exterior space. Clean form, honest materials, and
                considered detailing — that is the whole of it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT */}
      <section className="bg-paper border-y border-line">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal className="order-2 lg:order-1">
              <p className="eyebrow mb-4">Featured Development · {featured.location}</p>
              <h2 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink mb-6">
                {featured.title}
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed font-light mb-8">
                {featured.description}
              </p>
              <Link
                to={`/projects/${featured.slug}`}
                className="group inline-flex items-center gap-3 text-ink border-b border-bronze pb-1 hover:gap-4 transition-all"
              >
                <span className="tracking-wide">Explore the building</span>
                <ArrowRight className="h-4 w-4 text-bronze" />
              </Link>
            </Reveal>
            <Reveal delay={150} className="order-1 lg:order-2">
              <div className="aspect-[4/5] overflow-hidden">
                <ImageFrame src={featured.images[0]} alt={featured.title} className="w-full h-full" imgClassName="hover:scale-[1.03] transition-transform duration-[1.2s]" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DEVELOPMENTS */}
      <section className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
        <Reveal>
          <div className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="eyebrow mb-4">The Portfolio</p>
              <h2 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink">Developments across greater Athens</h2>
            </div>
            <Link to="/projects" className="hidden sm:inline-flex items-center gap-2 text-ink border-b border-bronze pb-1 hover:gap-3 transition-all whitespace-nowrap">
              <span className="tracking-wide">All projects</span><ArrowRight className="h-4 w-4 text-bronze" />
            </Link>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-8">
          {live.map((b, i) => (
            <Reveal key={b.id} delay={i * 120}>
              <Link to={`/projects/${b.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden mb-5">
                  <ImageFrame src={b.images[0]} alt={b.title} className="w-full h-full" imgClassName="group-hover:scale-[1.03] transition-transform duration-[1.2s]" />
                </div>
                <div className="flex items-center gap-2 text-bronze text-sm mb-2">
                  <MapPin className="h-4 w-4" /><span className="tracking-wide">{b.location}</span>
                </div>
                <h3 className="font-display text-3xl text-ink mb-1.5 group-hover:text-bronze transition-colors">{b.title}</h3>
                <p className="text-ink-soft">{b.startingPriceText}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        {upcoming.length > 0 && (
          <Reveal>
            <p className="text-ink-mute text-sm mt-10 pt-8 border-t border-line">
              Also in development —{' '}
              {upcoming.map((b, i) => (
                <span key={b.id} className="text-ink-soft">
                  {b.title}, {b.location}{i < upcoming.length - 1 ? ' · ' : ''}
                </span>
              ))}
              .
            </p>
          </Reveal>
        )}
      </section>

      {/* LOCATION */}
      <section className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <ImageFrame src={featured.locationImage ?? featured.images[0]} alt="Glyfada, Athens" className="aspect-[5/4]" />
          </Reveal>
          <Reveal delay={150}>
            <p className="eyebrow mb-4">The Location</p>
            <h2 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink mb-6">
              Glyfada, the Athenian Riviera
            </h2>
            <p className="text-ink-soft text-lg leading-relaxed font-light">
              {featured.locationDescription}
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-24 text-center">
          <Reveal>
            <h2 className="font-display font-light text-4xl sm:text-5xl text-ivory tracking-tight mb-6">
              Arrange a private viewing
            </h2>
            <p className="text-ivory/70 text-lg font-light max-w-xl mx-auto mb-10">
              Speak with our team about availability, specifications, and the buying process.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-ivory text-ink px-8 py-4 hover:bg-bronze hover:text-ivory transition-colors tracking-wide"
            >
              Get in touch <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
