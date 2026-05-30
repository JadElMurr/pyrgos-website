import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '../data/pyrgosData';

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero with rooftop render */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/palmiras/palmiras-roof-garden.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />

        <div className="relative max-w-3xl mx-auto text-center text-white">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8 drop-shadow">
            {siteConfig.shortName}
          </h1>

          <p className="text-xl sm:text-2xl font-light leading-relaxed mb-6 drop-shadow">
            {siteConfig.tagline}
          </p>

          <p className="text-base sm:text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow">
            We develop thoughtfully designed buildings that set new standards for residential
            living in Athens. Our commitment to craftsmanship and clarity ensures every project
            reflects our core values and vision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="group inline-flex items-center justify-center space-x-2 bg-white text-blue-900 px-8 py-4 hover:bg-gray-100 transition-all hover:scale-105"
            >
              <span className="font-semibold">View Projects</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-900 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
