import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { MapPin, Euro, ArrowLeft, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { buildings, apartments as allApartments, type Building, type Apartment } from '../data/pyrgosData';

export default function BuildingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const building: Building | null = useMemo(() => {
    if (!slug) return null;
    return buildings.find((b) => b.slug === slug) || null;
  }, [slug]);

  const apartments: Apartment[] = useMemo(() => {
    if (!slug) return [];
    return allApartments
      .filter((a) => a.buildingSlug === slug)
      .slice()
      // Keep stable order without relying on DB:
      // If later you want: sort by floor label or size, we can.
      ;
  }, [slug]);

  if (!slug) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">Building not found</p>
          <Link to="/projects" className="text-blue-900 font-semibold hover:text-blue-800">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">Building not found</p>
          <Link to="/projects" className="text-blue-900 font-semibold hover:text-blue-800">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const images =
    building.images && building.images.length > 0
      ? building.images
      : ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg'];

  return (
    <div className="pt-16">
      {/* Back Link */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-blue-900 font-semibold hover:gap-3 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Hero Image */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative h-96 md:h-[500px] overflow-hidden group bg-gray-200">
          <img
            src={images[currentImageIndex]}
            alt={`${building.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 mt-6">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-24 overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-blue-900' : 'opacity-60 hover:opacity-100'
                } transition-opacity`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Building Info with Sticky Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-2 border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">{building.title}</h1>
              <div className="flex items-center gap-2 text-lg text-gray-700">
                <MapPin className="h-5 w-5 text-blue-900" />
                <span>{building.location}</span>
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">{building.description}</p>

            <a
              href="#apartments"
              className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 font-semibold hover:bg-blue-800 transition-colors"
            >
              <span>See Apartments</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          {/* Sticky Info Card */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white p-8 border-2 border-gray-200">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-3">Starting Price</p>
                  <div className="flex items-baseline gap-2">
                    <Euro className="h-6 w-6 text-blue-900" />
                    <span className="text-4xl font-bold text-gray-900">{building.startingPriceText}</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Location:</span> {building.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apartments Section */}
      <section id="apartments" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12">Available Apartments</h2>

          {apartments.length === 0 ? (
            <p className="text-gray-600">No apartments available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apartments.map((apartment) => (
                <div
                  key={apartment.id}
                  className="bg-white overflow-hidden border border-gray-200 hover:border-blue-900 transition-colors group"
                >
                  {/* Cover Image */}
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    <img
                      src={
                        apartment.images?.[0] ||
                        'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg'
                      }
                      alt={apartment.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!!apartment.images?.length && apartment.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {apartment.images.length} photos
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{apartment.title}</h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <Euro className="h-5 w-5 text-blue-900" />
                      <span className="text-2xl font-bold text-gray-900">{apartment.priceText}</span>
                    </div>

                    {/* Key Specs */}
                    <div className="grid grid-cols-4 gap-3 mb-4 pb-4 border-b border-gray-200 text-xs">
                      <div>
                        <p className="text-gray-600 font-semibold mb-1">Size</p>
                        <p className="font-bold text-gray-900">
                          {typeof apartment.sizeInteriorSqm === 'number' ? `${apartment.sizeInteriorSqm}m²` : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold mb-1">Beds</p>
                        <p className="font-bold text-gray-900">{typeof apartment.beds === 'number' ? apartment.beds : '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold mb-1">Baths</p>
                        <p className="font-bold text-gray-900">{typeof apartment.baths === 'number' ? apartment.baths : '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold mb-1">Floor</p>
                        <p className="font-bold text-gray-900">{apartment.floorLabel || '—'}</p>
                      </div>
                    </div>

                    {/* Features */}
                    {apartment.features && apartment.features.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">Features</p>
                        <ul className="space-y-1">
                          {apartment.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              • {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      to={`/projects/${building.slug}/apartments/${apartment.slug}`}
                      className="inline-flex items-center gap-2 text-blue-900 font-semibold hover:gap-3 transition-all group/link w-full justify-between"
                    >
                      <span>View Apartment</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
