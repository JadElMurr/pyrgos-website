import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/pyrgosData';
import Reveal from '../components/Reveal';

export default function Contact() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-4">Contact</p>
              <h1 className="font-display font-light text-5xl sm:text-6xl lg:text-7xl tracking-tightest text-ink mb-8">
                Let&rsquo;s talk.
              </h1>
              <p className="text-ink-soft text-lg leading-relaxed font-light max-w-md">
                For availability, specifications, or to arrange a private viewing, reach our team
                directly. Please mention the residence you&rsquo;re interested in so we can help faster.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={120}>
              <div className="space-y-px bg-line border border-line">
                <div className="bg-paper p-7 flex gap-5">
                  <MapPin className="h-6 w-6 text-bronze flex-shrink-0 mt-1" />
                  <div>
                    <p className="eyebrow mb-2">Office</p>
                    <p className="text-ink text-lg">{siteConfig.address}</p>
                  </div>
                </div>
                <div className="bg-paper p-7 flex gap-5">
                  <Phone className="h-6 w-6 text-bronze flex-shrink-0 mt-1" />
                  <div>
                    <p className="eyebrow mb-2">Phone</p>
                    {siteConfig.phones.map((p) => (
                      <a key={p.href} href={p.href} className="block text-ink text-lg hover:text-bronze transition-colors">
                        {p.label}: {p.display}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="bg-paper p-7 flex gap-5">
                  <Mail className="h-6 w-6 text-bronze flex-shrink-0 mt-1" />
                  <div>
                    <p className="eyebrow mb-2">Email</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-ink text-lg hover:text-bronze transition-colors break-all">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${siteConfig.email}?subject=Pyrgos%20Inquiry`}
                className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-ink text-ivory py-4 hover:bg-bronze transition-colors tracking-wide"
              >
                Email us <ArrowRight className="h-5 w-5" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
