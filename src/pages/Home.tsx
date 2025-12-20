import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div className="pt-16">
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/2 w-px h-full bg-blue-900" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-blue-900" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-12 sm:mb-16">
            <div className="p-4 sm:p-6">
              <Logo className="h-16 sm:h-20 w-16 sm:w-20 text-blue-900" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-8 sm:mb-10">
            PYRGOS
          </h1>

          {/* Primary Statement */}
          <p className="text-xl sm:text-2xl text-gray-700 font-light leading-relaxed mb-6 sm:mb-8">
            Delivering well-designed residential projects with meticulous attention to quality, planning, and execution.
          </p>

          {/* Supporting Paragraph */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12 sm:mb-16">
            We develop thoughtfully designed buildings that set new standards for residential living. Our commitment to craftsmanship and clarity ensures every project reflects our core values and vision.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="group inline-flex items-center justify-center space-x-2 bg-blue-900 text-white px-8 py-4 hover:bg-blue-800 transition-all hover:scale-105"
            >
              <span className="font-medium">View Projects</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-900 hover:border-blue-900 hover:text-blue-900 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
