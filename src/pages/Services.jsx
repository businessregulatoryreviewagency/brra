const Services = () => {
  return (
    <div>
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-br from-blue-900 to-emerald-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-emerald-100">Comprehensive regulatory support for businesses in Zambia</p>
        </div>
      </section>

      <section id="ria" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <i className="ri-line-chart-line text-3xl text-emerald-600"></i>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Regulatory Impact Assessment (RIA)</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Regulatory Impact Assessment (RIA) is a vital process that ensures regulations are effective, efficient, and proportionate. It involves a comprehensive analysis of the potential consequences of new or amended regulations before they are implemented.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Evidence-Based Policy Making</h3>
                    <p className="text-gray-600">Ensures decisions are based on solid evidence and comprehensive analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cost-Benefit Analysis</h3>
                    <p className="text-gray-600">Evaluates economic impacts and identifies the most efficient regulatory options</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Stakeholder Input</h3>
                    <p className="text-gray-600">Incorporates feedback from businesses, consumers, and affected parties</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
                    <p className="text-gray-600">Identifies and evaluates potential risks and unintended consequences</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="#" className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
                  Submit RIA Framework
                </a>
                <a href="#" className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors font-medium">
                  Download Guidelines
                </a>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" 
                alt="RIA Process" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="rsc" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" 
                alt="RSC Centers" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-building-line text-3xl text-blue-600"></i>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Regulatory Services Centres (RSC)</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Regulatory Services Centres are physical locations established to improve the delivery of regulatory services to businesses across Zambia. BRRA coordinates the establishment and rollout of these centers nationwide.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-blue-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">One-Stop Service</h3>
                    <p className="text-gray-600">Access multiple regulatory services in a single location</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-blue-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reduced Costs</h3>
                    <p className="text-gray-600">Lower the cost of doing business through streamlined processes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-blue-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Improved Accessibility</h3>
                    <p className="text-gray-600">Bring services closer to businesses across all provinces</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-blue-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enhanced Efficiency</h3>
                    <p className="text-gray-600">Expedite licensing and permit processes</p>
                  </div>
                </div>
              </div>
              <a href="#" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Find Nearest RSC
                <i className="ri-map-pin-line ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="e-services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-computer-line text-3xl text-purple-600"></i>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">e-Services & Digital Platforms</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our digital platforms simplify business registration, licensing, and compliance processes through innovative online services. Access regulatory information and submit applications from anywhere, anytime.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-purple-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Online Applications</h3>
                    <p className="text-gray-600">Submit license applications and documents electronically</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-purple-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-Time Tracking</h3>
                    <p className="text-gray-600">Monitor the status of your applications in real-time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-purple-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enhanced Transparency</h3>
                    <p className="text-gray-600">Clear visibility into regulatory requirements and processes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-purple-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">24/7 Access</h3>
                    <p className="text-gray-600">Access services and information at your convenience</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="#" className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium">
                  Access e-Registry
                </a>
                <a href="#" className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors font-medium">
                  User Guide
                </a>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800" 
                alt="Digital Services" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Additional Services</h2>
            <p className="text-emerald-100">More ways we support Zambia's business regulatory environment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors">
              <i className="ri-team-line text-4xl text-white mb-3"></i>
              <h3 className="text-lg font-semibold text-white mb-2">Stakeholder Consultation</h3>
              <p className="text-sm text-emerald-100">Facilitate engagement between regulators and stakeholders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors">
              <i className="ri-graduation-cap-line text-4xl text-white mb-3"></i>
              <h3 className="text-lg font-semibold text-white mb-2">Capacity Building</h3>
              <p className="text-sm text-emerald-100">Training and support for regulatory agencies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors">
              <i className="ri-microscope-line text-4xl text-white mb-3"></i>
              <h3 className="text-lg font-semibold text-white mb-2">Research & Analysis</h3>
              <p className="text-sm text-emerald-100">Study regulatory trends and best practices</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors">
              <i className="ri-bar-chart-box-line text-4xl text-white mb-3"></i>
              <h3 className="text-lg font-semibold text-white mb-2">Monitoring & Evaluation</h3>
              <p className="text-sm text-emerald-100">Track effectiveness and recommend improvements</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Assistance?</h2>
          <p className="text-gray-600 mb-8">
            Our team is here to help you navigate regulatory processes and access our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="px-8 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
              Contact Us
            </a>
            <a href="#" className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors font-medium">
              Download Service Guide
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
