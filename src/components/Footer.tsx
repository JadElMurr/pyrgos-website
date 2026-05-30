import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import logo from '../assets/pyrgos-logo.png';
import { siteConfig } from '../data/pyrgosData';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img
              src={logo}
              alt={siteConfig.companyName}
              className="h-20 w-auto mb-4 bg-white/95 rounded-md p-2"
            />
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{siteConfig.address}</span>
              </li>

              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  {siteConfig.phones.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {p.label}: {p.display}
                    </a>
                  ))}
                </div>
              </li>

              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
