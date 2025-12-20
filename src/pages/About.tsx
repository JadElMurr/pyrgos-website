export default function About() {
  const values = [
    'Quality',
    'Clarity',
    'Reliability',
    'Craftsmanship'
  ];

  return (
    <div className="pt-16">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8">About PYRGOS</h1>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              We are a residential real estate development company focused on creating thoughtfully designed buildings that become landmarks in their communities. Our mission is to deliver projects that reflect our unwavering commitment to quality, clarity in our processes, and reliable execution.
            </p>
          </div>

          <div className="border-t-2 border-gray-200 border-b-2 py-12">
            <h2 className="text-sm uppercase tracking-widest text-gray-600 font-semibold mb-8">Core Values</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            Each project we undertake is an opportunity to contribute to the urban landscape with integrity and vision. We work with architects, engineers, and craftspeople who share our dedication to excellence, ensuring that every building we develop becomes a valued asset to its community.
          </p>
        </div>
      </section>
    </div>
  );
}
