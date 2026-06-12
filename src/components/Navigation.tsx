import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import logo from '../assets/pyrgos-logo.png';
import { siteConfig } from '../data/pyrgosData';

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/residences', label: 'Residences' },
  { to: '/about', label: 'About' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled && !open;
  const isActive = (p: string) => location.pathname === p;

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        transparent ? 'bg-transparent' : 'bg-ivory/90 backdrop-blur-md border-b border-line'
      }`}
    >
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            {transparent ? (
              <span className="font-display text-2xl tracking-tight text-ivory">{siteConfig.shortName}</span>
            ) : (
              <img src={logo} alt={siteConfig.companyName} className="h-12 w-auto" />
            )}
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm tracking-wide transition-colors ${
                  transparent
                    ? 'text-ivory/85 hover:text-ivory'
                    : isActive(l.to)
                    ? 'text-ink'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className={`text-sm tracking-wide px-6 py-2.5 transition-colors ${
                transparent
                  ? 'border border-ivory/60 text-ivory hover:bg-ivory hover:text-ink'
                  : 'bg-ink text-ivory hover:bg-bronze'
              }`}
            >
              Contact
            </Link>
          </div>

          <button
            className={`md:hidden p-2 ${transparent ? 'text-ivory' : 'text-ink'}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-ivory border-t border-line">
          <div className="px-6 py-5 space-y-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block text-ink-soft hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-ink text-ivory px-4 py-3 hover:bg-bronze transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
