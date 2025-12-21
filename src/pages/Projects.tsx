import { Link } from 'react-router';
import { ArrowRight, MapPin, Euro } from 'lucide-react';
import { buildings, type Building } from '../data/pyrgosData';

export default function Projects() {
  const gaziBuildings = buildings.filter((b) => b.location === 'Gazi');
  const glyfadaBuildings = buildings.filter((b) => b.location === 'Glyfada');

  const BuildingRow = ({ building }: { building: Building }) => (
    <div className="group">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        {/* Image */}
        <div className="lg:col-span-2 overflow-hidden bg-gray-200 h-72 lg:h-auto">
          <img
            src={
              building.images?.[0] ||
              'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg'
            }
            alt={building.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
              {building.title}
            </h3>

            <div className="flex items-center gap-2 text-lg text-gray-700">
              <MapPin className="h-5 w-5 text-blue-900 flex-shrink-0" />
              <span>{building.location}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <Euro className="h-5 w-5 text-blue-900 flex-shrink-0" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {building.startingPriceText}
              </span>
              <span className="text-sm text-gray-600">starting price</span>
            </div>

            <p className="text-gray-700 leading-relaxed">{building.description}</p>

            {building.highlights?.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-2 text-gray-700">
                {building.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-900 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to={`/projects/${building.slug}`}
            className="inline-flex items-center gap-2 text-blue-900 font-semibold hover:gap-3 transition-all group/link w-fit"
          >
            <span>View Building</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mt-12 border-t-2 border-gray-200" />
    </div>
  );

  return (
    <div className="pt-16">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-16">
          {/* Gazi Section */}
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Gazi Listings</h2>

            {gaziBuildings.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-sm p-10 text-center">
                <p className="text-gray-700 text-lg font-semibold">Coming soon</p>
                <p className="text-gray-600 mt-2">
                  We will publish our Gazi brochure and listings shortly.
                </p>
              </div>
            ) : (
              gaziBuildings.map((building) => (
                <BuildingRow key={building.id} building={building} />
              ))
            )}
          </div>

          <div className="border-t-2 border-gray-200" />

          {/* Glyfada Section */}
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Glyfada Listings</h2>

            {glyfadaBuildings.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                <p>No projects available at the moment.</p>
              </div>
            ) : (
              glyfadaBuildings.map((building) => (
                <BuildingRow key={building.id} building={building} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
