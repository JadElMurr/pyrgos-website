import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import Logo from './Logo';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-8 text-blue-900" />
            <span className="text-xl font-bold text-blue-900 tracking-wide">PYRGOS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-blue-900' : 'text-gray-700 hover:text-blue-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors ${
                isActive('/about') ? 'text-blue-900' : 'text-gray-700 hover:text-blue-900'
              }`}
            >
              About
            </Link>
            <Link
              to="/projects"
              className={`font-medium transition-colors ${
                isActive('/projects') ? 'text-blue-900' : 'text-gray-700 hover:text-blue-900'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/contact"
              className="bg-blue-900 text-white px-6 py-2 rounded-sm font-medium hover:bg-blue-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/projects"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
            >
              Projects
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full bg-blue-900 text-white px-4 py-2 rounded-sm font-medium hover:bg-blue-800 transition-colors text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
