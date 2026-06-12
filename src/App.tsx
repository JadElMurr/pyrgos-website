import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import BuildingDetail from './pages/BuildingDetail';
import ApartmentDetail from './pages/ApartmentDetail';
import Contact from './pages/Contact';
import Residences from './pages/Residences';
import adminConfig from './admin/admin.config.json';

// The studio is code-split: visitors never download a byte of it.
const AdminPage = lazy(() => import('./admin/AdminPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="pt-40 pb-32 min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display font-light text-5xl sm:text-6xl tracking-tightest text-ink mb-6">Page not found</h1>
        <p className="text-ink-soft font-light mb-8">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-ink text-ivory px-7 py-3.5 hover:bg-bronze transition-colors tracking-wide">
          Return home
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-ivory flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/residences" element={<Residences />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<BuildingDetail />} />
            <Route path="/projects/:slug/apartments/:apartmentSlug" element={<ApartmentDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path={`/${adminConfig.adminPath}`} element={<Suspense fallback={null}><AdminPage /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
