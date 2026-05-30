import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/pyrgosData';
import Reveal from '../components/Reveal';
import ImageFrame from '../components/ImageFrame';

const values = [
  { title: 'Quality', body: 'Considered materials and finishes, specified to last and to feel good in daily use.' },
  { title: 'Clarity', body: 'Clean form and honest detailing — spaces that are calm, legible, and full of light.' },
  { title: 'Craftsmanship', body: 'Careful execution at every stage, working with architects and trades who share our standards.' },
  { title: 'Trust', body: 'Straightforward information and a transparent process, from first viewing to handover.' },
];

export default function About() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Intro */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-24">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-4">About</p>
              <h1 className="font-display font-light text-5xl sm:text-6xl lg:text-7xl tracking-tightest text-ink">
                {siteConfig.companyName}
              </h1>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={120}>
              <p className="font-display font-light text-2xl sm:text-3xl leading-[1.3] tracking-tight text-ink mb-8">
                We are a residential developer creating contemporary homes in Athens, with roots
                between Athens and Beirut.
              </p>
              <p className="text-ink-soft text-lg leading-relaxed font-light mb-6">
                Our approach is deliberately focused: we take on a small number of buildings and give
                each one disproportionate care. We believe a good home comes from proportion, daylight,
                and honest materials — not from excess.
              </p>
              <p className="text-ink-soft text-lg leading-relaxed font-light">
                Our developments span greater Athens — from Palmiras 16 in Glyfada, on the southern
                coast, to Gazi Residences in the heart of the city — each designed around the
                relationship between interior and exterior space, daylight, and honest materials.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Image */}
        <Reveal>
          <ImageFrame src="/images/palmiras/palmiras-roof-garden.jpg" alt="A Pyrgos residence in Athens" className="aspect-[16/9] mb-24" />
        </Reveal>

        {/* Values */}
        <Reveal>
          <p className="eyebrow mb-3">What we value</p>
          <h2 className="font-display font-light text-4xl sm:text-5xl tracking-tight text-ink mb-14">
            Principles that guide every project
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="bg-paper p-8 h-full">
                <p className="font-display text-2xl text-ink mb-3">{v.title}</p>
                <p className="text-ink-soft font-light leading-relaxed">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-line pt-14">
            <h2 className="font-display font-light text-3xl sm:text-4xl tracking-tight text-ink max-w-lg">
              See what we are building now.
            </h2>
            <Link to="/projects" className="inline-flex items-center gap-3 bg-ink text-ivory px-8 py-4 hover:bg-bronze transition-colors tracking-wide self-start">
              View Projects <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
