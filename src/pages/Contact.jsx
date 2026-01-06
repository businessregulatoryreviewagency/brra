import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-br from-blue-900 to-emerald-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-emerald-100">We're here to help and answer any questions you may have</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-map-pin-line text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visit Us</h3>
              <p className="text-gray-600">
                Plot No. 2251, Fairley Road<br />
                Ridgeway<br />
                LUSAKA, ZAMBIA
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-phone-line text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Call Us</h3>
              <p className="text-gray-600 mb-2">
                <a href="tel:+260211259165" className="hover:text-blue-600 transition-colors">
                  +260 211 259165
                </a>
              </p>
              <p className="text-sm text-gray-500">
                Monday - Friday<br />
                8:00 AM - 5:00 PM
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-emerald-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-line text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Us</h3>
              <p className="text-gray-600 mb-2">
                <a href="mailto:info@brra.org.zm" className="hover:text-purple-600 transition-colors">
                  info@brra.org.zm
                </a>
              </p>
              <p className="text-sm text-gray-500">
                We'll respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible</p>
          </div>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <i className="ri-checkbox-circle-fill text-green-600 text-2xl mr-3"></i>
                <p className="text-green-700">Thank you for your message! We'll get back to you soon.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="+260 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="ria">RIA Framework Submission</option>
                  <option value="rsc">Regulatory Services Centre</option>
                  <option value="eservices">e-Services Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium text-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us on the Map</h2>
            <p className="text-gray-600">Visit our office in Lusaka</p>
          </div>
          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg" style={{ height: '450px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.234!2d28.3!3d-15.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDI0JzAwLjAiUyAyOMKwMTgnMDAuMCJF!5e0!3m2!1sen!2szm!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Follow Us on Social Media</h2>
          <p className="text-emerald-100 mb-8">
            Stay connected and get the latest updates from BRRA
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-facebook-fill text-2xl text-white"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-twitter-x-fill text-2xl text-white"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-linkedin-fill text-2xl text-white"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-youtube-fill text-2xl text-white"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
