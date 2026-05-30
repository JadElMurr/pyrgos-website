import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import logo from '../assets/pyrgos-logo.png';
import { siteConfig } from '../data/pyrgosData';

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory/80">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <img src={logo} alt={siteConfig.companyName} className="h-20 w-auto mb-5 bg-ivory/95 rounded-md p-2.5" />
            <p className="text-ivory/65 leading-relaxed max-w-sm font-light">{siteConfig.tagline}</p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="eyebrow mb-5">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/projects" className="text-ivory/70 hover:text-ivory transition-colors">Projects</Link></li>
              <li><Link to="/about" className="text-ivory/70 hover:text-ivory transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-ivory/70 hover:text-ivory transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="eyebrow mb-5">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-bronze mt-0.5 flex-shrink-0" />
                <span className="text-ivory/70">{siteConfig.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-bronze mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  {siteConfig.phones.map((p) => (
                    <a key={p.href} href={p.href} className="text-ivory/70 hover:text-ivory transition-colors">
                      {p.label}: {p.display}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-bronze flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="text-ivory/70 hover:text-ivory transition-colors">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/15 mt-14 pt-8 text-xs tracking-wide text-ivory/40 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
          <p>Athens · Beirut</p>
        </div>
      </div>
    </footer>
  );
}
