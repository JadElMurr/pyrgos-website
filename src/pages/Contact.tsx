import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Netlify Forms requires URL-encoded form body
  const encode = (data: Record<string, string>) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: Record<string, string> = {
        'form-name': 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      });

      if (!res.ok) {
        throw new Error(`Netlify form submission failed: ${res.status}`);
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-700">Get in touch with our team</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <p className="text-lg text-gray-700">
                Have questions about our projects? We'd love to hear from you. Get in touch with our team using the form or contact information below.
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
                    <p className="text-gray-700">+30 210 123 4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="h-6 w-6 text-blue-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-700">info@pyrgos.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {isSuccess && (
                <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-sm flex gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Thank you!</h3>
                    <p className="text-green-800 text-sm">
                      We've received your message and will get back to you shortly.
                    </p>
                  </div>
                </div>
              )}

              {/* Netlify Forms:
                  - data-netlify="true" enables form handling
                  - name must match 'form-name' above
                  - hidden form-name input helps Netlify detect the form
                  - honeypot prevents spam
              */}
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don’t fill this out: <input name="bot-field" />
                  </label>
                </p>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-900`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-900`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="+30 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className={`w-full px-4 py-3 border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-900`}
                    placeholder="Your message..."
                  />
                  {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 text-white py-4 font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-500">
                This form is handled by Netlify (no database needed).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
