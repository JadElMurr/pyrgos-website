import { Link } from 'react-router';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { siteConfig, buildings } from '../data/pyrgosData';
import Reveal from '../components/Reveal';

export default function Home() {
  const featured = buildings[0];

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
                <img
                  src="/images/palmiras/building-front.jpg"
                  alt={featured.title}
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1.2s]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="aspect-[5/4] overflow-hidden">
              <img src="/images/palmiras/glyfada-aerial.jpg" alt="Glyfada, Athens" className="w-full h-full object-cover" />
            </div>
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
