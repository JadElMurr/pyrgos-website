import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, MapPin, Euro, Bed, Bath, Maximize, Building as BuildingIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, Building, Apartment } from '../lib/supabase';

export default function ApartmentDetail() {
  const { slug: buildingSlug, apartmentSlug } = useParams<{ slug: string; apartmentSlug: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (buildingSlug && apartmentSlug) {
      fetchData();
    }
  }, [buildingSlug, apartmentSlug]);

  const fetchData = async () => {
    try {
      const { data: buildingData, error: buildingError } = await supabase
        .from('buildings')
        .select('*')
        .eq('slug', buildingSlug)
        .maybeSingle();

      if (buildingError) throw buildingError;
      if (!buildingData) {
        setLoading(false);
        return;
      }

      setBuilding(buildingData);

      const { data: apartmentData, error: apartmentError } = await supabase
        .from('apartments')
        .select('*')
        .eq('building_id', buildingData.id)
        .eq('slug', apartmentSlug)
        .maybeSingle();

      if (apartmentError) throw apartmentError;
      setApartment(apartmentData);
    } catch (error) {
      console.error('Error fetching apartment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!building || !apartment) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">Apartment not found</p>
          <Link to="/projects" className="text-blue-900 font-semibold hover:text-blue-800">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const images = apartment.images.length > 0
    ? apartment.images
    : ['https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg'];

  return (
    <div className="pt-16">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 space-y-2">
        <Link to="/projects" className="inline-flex items-center gap-2 text-blue-900 font-semibold hover:gap-3 transition-all">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Projects</span>
        </Link>
        <Link to={`/projects/${buildingSlug}`} className="inline-flex items-center gap-2 text-blue-900 font-semibold hover:gap-3 transition-all ml-6">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to {building.title}</span>
        </Link>
      </div>

      {/* Hero Gallery */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative h-96 md:h-[500px] overflow-hidden group bg-gray-200">
          <img
            src={images[currentImageIndex]}
            alt={`${apartment.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-6 gap-2 mt-6">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-24 overflow-hidden transition-all ${
                  currentImageIndex === index ? 'ring-2 ring-blue-900' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Top Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-2">{apartment.title}</h1>
            <p className="text-lg text-gray-600 mb-6">
              {building.title} • {building.location}
            </p>

            <div className="flex items-baseline gap-2 mb-8">
              <Euro className="h-7 w-7 text-blue-900" />
              <span className="text-5xl font-bold text-gray-900">
                {formatPrice(apartment.price)}
              </span>
            </div>

            {apartment.description && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {apartment.description}
              </p>
            )}
          </div>

          {/* Sticky Summary Card */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white p-8 border-2 border-gray-200">
              <div className="space-y-8">
                {/* Price */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(apartment.price)}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">Specifications</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Size</p>
                      <p className="text-xl font-bold text-gray-900">{apartment.size_m2}m²</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Bedrooms</p>
                      <p className="text-xl font-bold text-gray-900">{apartment.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Bathrooms</p>
                      <p className="text-xl font-bold text-gray-900">{apartment.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Floor</p>
                      <p className="text-xl font-bold text-gray-900">{apartment.floor}</p>
                    </div>
                  </div>
                </div>

                {/* Building Info */}
                <div className="border-t pt-4">
                  <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2">Location</p>
                  <p className="text-gray-900">{building.title}</p>
                  <p className="text-gray-600">{building.location}</p>
                </div>

                {/* CTA */}
                <Link
                  to="/contact"
                  className="block w-full text-center bg-blue-900 text-white py-4 font-semibold hover:bg-blue-800 transition-colors"
                >
                  Inquire Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Features */}
          {apartment.features.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Features</h2>
              <ul className="space-y-4">
                {apartment.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-900 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Specs */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Specifications</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <Maximize className="h-6 w-6 text-blue-900 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Living Space</p>
                  <p className="text-2xl font-bold text-gray-900">{apartment.size_m2} m²</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <Bed className="h-6 w-6 text-blue-900 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bedrooms</p>
                  <p className="text-2xl font-bold text-gray-900">{apartment.bedrooms}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <Bath className="h-6 w-6 text-blue-900 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bathrooms</p>
                  <p className="text-2xl font-bold text-gray-900">{apartment.bathrooms}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <BuildingIcon className="h-6 w-6 text-blue-900 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Floor Level</p>
                  <p className="text-2xl font-bold text-gray-900">Floor {apartment.floor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Interested in this property?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Get in touch with our team to learn more about this apartment and schedule a viewing.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-blue-900 text-white px-8 py-4 font-semibold hover:bg-blue-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
