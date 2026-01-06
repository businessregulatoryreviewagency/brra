import { Link } from 'react-router-dom'

const Home = () => {
  const services = [
    {
      icon: 'ri-line-chart-line',
      title: 'RIA (Regulatory Impact Assessment)',
      description: 'A vital process ensuring effective and efficient regulations. Analyzes potential consequences of new rules to prevent unnecessary burdens.',
      link: '/services#ria'
    },
    {
      icon: 'ri-building-line',
      title: 'RSC (Regulatory Services Centres)',
      description: 'Physical centers for improved regulatory service delivery. BRRA coordinates establishment and rollout across Zambia.',
      link: '/services#rsc'
    },
    {
      icon: 'ri-computer-line',
      title: 'e-Services',
      description: 'Digital platforms simplifying business registration and compliance. Features online applications, document submission, and status tracking.',
      link: '/services#e-services'
    }
  ]

  const quickLinks = [
    { icon: 'ri-search-line', title: 'E-Registry Portal', link: '#' },
    { icon: 'ri-file-text-line', title: 'Submit RIA Framework', link: '#' },
    { icon: 'ri-map-pin-line', title: 'Track Submission', link: '#' },
    { icon: 'ri-download-line', title: 'Download Forms', link: '#' },
    { icon: 'ri-phone-line', title: 'Contact Us', link: '/contact' },
    { icon: 'ri-book-line', title: 'Strategic Plan PDF', link: '#' }
  ]

  const news = [
    {
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      category: 'Policy Update',
      date: 'December 15, 2024',
      title: 'New RIA Guidelines Released for Public Consultation',
      excerpt: 'BRRA announces updated Regulatory Impact Assessment guidelines aimed at enhancing stakeholder participation...'
    },
    {
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      category: 'Infrastructure',
      date: 'December 10, 2024',
      title: 'BRRA Launches Regulatory Services Centre in Ndola',
      excerpt: 'The new RSC will provide streamlined access to business licensing services for the Copperbelt region...'
    },
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      category: 'Report',
      date: 'December 5, 2024',
      title: 'Strategic Plan 2022-2026 Implementation Progress',
      excerpt: 'BRRA releases mid-term review showing significant progress in operational excellence and partnerships...'
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      category: 'Consultation',
      date: 'November 28, 2024',
      title: 'Stakeholder Workshop on Business Licensing Reform',
      excerpt: 'Over 50 regulatory agencies participated in the workshop focused on streamlining licensing processes...'
    }
  ]

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            The Business Regulatory Review Agency
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-emerald-100">
            Promoting a Conducive Business Regulatory Environment
          </p>
          <p className="text-lg mb-8 text-gray-200 max-w-3xl mx-auto">
            A statutory body under the Ministry of Commerce, Trade and Industry, established to ensure an efficient, cost-effective, and accessible business licensing system in Zambia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="px-8 py-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
              Submit Framework
            </a>
            <a href="#" className="px-8 py-4 bg-white text-blue-900 rounded-md hover:bg-gray-100 transition-colors font-medium">
              Track Submission
            </a>
            <Link to="/news" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-900 transition-colors font-medium">
              Latest Notices
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About BRRA</h2>
              <p className="text-gray-600 mb-4">
                The Business Regulatory Review Agency (BRRA) was established under the Business Regulatory Act No. 3 of 2014, amended by Act No. 14 of 2018, and has been operational since January 2016.
              </p>
              <p className="text-gray-600 mb-6">
                Our core mandate is to ensure that Zambia's business licensing system is efficient, cost-effective, and accessible to all stakeholders while promoting sustainable economic growth.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <i className="ri-target-line text-4xl text-emerald-600 mb-2"></i>
                  <h3 className="font-semibold text-gray-900">Mission</h3>
                  <p className="text-sm text-gray-600 mt-2">Evidence-based regulatory frameworks</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <i className="ri-eye-line text-4xl text-blue-600 mb-2"></i>
                  <h3 className="font-semibold text-gray-900">Vision</h3>
                  <p className="text-sm text-gray-600 mt-2">Leading regulatory excellence in Africa</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <i className="ri-focus-line text-4xl text-amber-600 mb-2"></i>
                  <h3 className="font-semibold text-gray-900">Focus</h3>
                  <p className="text-sm text-gray-600 mt-2">Operational & regulatory excellence</p>
                </div>
              </div>
              <Link to="/about" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                Learn More About Us
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800" 
                alt="BRRA Team" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <p className="text-gray-600">Fast access to frequently used resources</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.link}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow text-center group"
              >
                <i className={`${link.icon} text-4xl text-emerald-600 mb-3 group-hover:scale-110 transition-transform inline-block`}></i>
                <h3 className="text-sm font-medium text-gray-900">{link.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600">Comprehensive regulatory support for businesses in Zambia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-shadow">
                <i className={`${service.icon} text-5xl text-emerald-600 mb-4`}></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a href={service.link} className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center">
                  Learn More
                  <i className="ri-arrow-right-line ml-2"></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">Strategic Plan 2022-2026</h2>
              <p className="text-emerald-100 mb-6">
                Our strategic plan is aligned with the Eighth National Development Plan and complies with the National Planning and Budgeting Act No. 1 of 2020.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-400 text-xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold">Operational Excellence</h3>
                    <p className="text-emerald-100 text-sm">Delivering high quality services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-400 text-xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold">Strategic Partnerships</h3>
                    <p className="text-emerald-100 text-sm">Improved regulatory services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-400 text-xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold">Business Regulatory Excellence</h3>
                    <p className="text-emerald-100 text-sm">Conducive business environment</p>
                  </div>
                </div>
              </div>
              <a href="#" className="inline-flex items-center px-6 py-3 bg-white text-blue-900 rounded-md hover:bg-gray-100 transition-colors font-medium">
                <i className="ri-download-line mr-2"></i>
                Download Strategic Plan
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Eight Strategic Objectives</h3>
              <ol className="space-y-3 text-emerald-100">
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">1.</span>
                  <span>Improve regulation of business policies and laws</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">2.</span>
                  <span>Improve management of Regulatory Services</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">3.</span>
                  <span>Enhance business Regulatory Impact Assessment processes</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">4.</span>
                  <span>Enhance awareness of BRRA's mandate</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">5.</span>
                  <span>Improve financial resource management</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">6.</span>
                  <span>Improve management systems</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">7.</span>
                  <span>Improve human capital</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-white mr-3">8.</span>
                  <span>Improve office accommodation</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Zambia Business Licensing Information Portal (e-Registry)
          </h2>
          <p className="text-emerald-100 mb-8">
            Businesses operating in Zambia are typically required to obtain one or more licenses and permits, depending on the activities of their enterprise. This website enables you to obtain information on the licenses pertaining to your business.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for business licenses..."
                className="flex-1 px-6 py-4 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                <i className="ri-search-line mr-2"></i>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest News & Updates</h2>
            <p className="text-gray-600">Stay informed about BRRA's activities and regulatory developments</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center">
                    Read More
                    <i className="ri-arrow-right-line ml-2"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/news" className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
              View All News
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
