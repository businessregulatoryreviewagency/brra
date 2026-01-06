import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const partners = [
    { name: 'ZTA', full: 'Zambia Tourism Agency' },
    { name: 'ZMA', full: 'Zambia Medicines Authority' },
    { name: 'ZBS', full: 'Zambia Bureau of Standards' },
    { name: 'NAPSA', full: 'National Pension Scheme Authority' },
    { name: 'ZPPA', full: 'Zambia Public Procurement Authority' },
    { name: 'MCTI', full: 'Ministry of Commerce, Trade and Industry' },
    { name: 'CEEC', full: 'Citizens Economic Empowerment Commission' },
    { name: 'PACRA', full: 'Patents and Companies Registration Agency' },
  ]

  return (
    <footer className="bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-lg">BR</span>
              </div>
              <div>
                <div className="font-bold">BRRA</div>
                <div className="text-xs text-emerald-100">Business Regulatory Review Agency</div>
              </div>
            </div>
            <p className="text-sm text-emerald-100">
              Promoting a conducive business regulatory environment in Zambia through evidence-based policy making and stakeholder engagement.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-emerald-100 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-emerald-100 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-emerald-100 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/departments" className="text-emerald-100 hover:text-white transition-colors">Departments</Link></li>
              <li><Link to="/news" className="text-emerald-100 hover:text-white transition-colors">News & Updates</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-emerald-100 hover:text-white transition-colors">RIA Framework</a></li>
              <li><a href="#" className="text-emerald-100 hover:text-white transition-colors">e-Registry Portal</a></li>
              <li><a href="#" className="text-emerald-100 hover:text-white transition-colors">Regulatory Services Centres</a></li>
              <li><a href="#" className="text-emerald-100 hover:text-white transition-colors">Submit Framework</a></li>
              <li><a href="#" className="text-emerald-100 hover:text-white transition-colors">Track Submission</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <i className="ri-map-pin-line text-emerald-200 mt-1"></i>
                <span className="text-emerald-100">Plot No. 2251, Fairley Road, Ridgeway, LUSAKA, ZAMBIA</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-phone-line text-emerald-200"></i>
                <a href="tel:+260211259165" className="text-emerald-100 hover:text-white transition-colors">+260 211 259165</a>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-mail-line text-emerald-200"></i>
                <a href="mailto:info@brra.org.zm" className="text-emerald-100 hover:text-white transition-colors">info@brra.org.zm</a>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-time-line text-emerald-200"></i>
                <span className="text-emerald-100">Mon-Fri, 8:00AM - 5:00PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-500 pt-8 mb-8">
          <h3 className="font-semibold text-lg mb-4 text-center">Our Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {partners.map((partner) => (
              <div key={partner.name} className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors">
                <div className="font-bold text-sm">{partner.name}</div>
                <div className="text-xs text-emerald-100 mt-1">{partner.full}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-emerald-500 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-emerald-100 mb-4 md:mb-0">
            © {currentYear} Business Regulatory Review Agency. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <i className="ri-twitter-x-fill"></i>
            </a>
            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <i className="ri-linkedin-fill"></i>
            </a>
            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <i className="ri-mail-fill"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
