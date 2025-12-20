import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-16">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-700">
              Reach us directly using the details below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <p className="text-lg text-gray-700">
                For project inquiries, apartment availability, or partnership opportunities,
                contact our team and we’ll respond as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-blue-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-700">Athens, Greece</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="h-6 w-6 text-blue-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-700">
                      <a
                        href="tel:+306986108962"
                        className="hover:underline block"
                      >
                        +30 698 610 8962
                      </a>
                      <a
                        href="tel:+306945284162"
                        className="hover:underline block"
                      >
                        +30 694 528 4162
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="h-6 w-6 text-blue-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-700">
                      <a
                        href="mailto:pyrgosdio@gmail.com"
                        className="hover:underline"
                      >
                        pyrgosdio@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  When contacting us, please mention the building and apartment
                  you are interested in so we can assist you faster.
                </p>
              </div>
            </div>

            {/* CTA Panel */}
            <div className="border border-gray-200 bg-white p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Quick Contact
              </h2>
              <p className="text-gray-700 mb-6">
                Choose your preferred channel:
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="mailto:pyrgosdio@gmail.com?subject=Pyrgos%20Inquiry"
                  className="inline-flex items-center justify-center px-5 py-3 bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-colors"
                >
                  Email us
                </a>

                <a
                  href="tel:+306986108962"
                  className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Call us
                </a>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                Contact details can be updated at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
