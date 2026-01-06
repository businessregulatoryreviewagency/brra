const About = () => {
  const leadership = [
    {
      name: 'Dr. Sarah Mwanza',
      position: 'Director General',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      bio: 'Dr. Mwanza brings over 20 years of experience in regulatory policy and public administration.'
    },
    {
      name: 'Mr. James Phiri',
      position: 'Deputy Director, Policy Analysis',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      bio: 'Mr. Phiri specializes in economic impact assessment and regulatory framework development.'
    },
    {
      name: 'Ms. Grace Banda',
      position: 'Deputy Director, Stakeholder Engagement',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      bio: 'Ms. Banda leads our stakeholder consultation and public engagement initiatives.'
    }
  ]

  const functions = [
    {
      icon: 'ri-line-chart-line',
      title: 'Regulatory Impact Assessment',
      description: 'Conduct comprehensive analysis of proposed regulations and assess impacts on businesses, consumers, and the economy.'
    },
    {
      icon: 'ri-team-line',
      title: 'Stakeholder Consultation',
      description: 'Facilitate engagement between regulators and stakeholders to ensure inclusive policy development.'
    },
    {
      icon: 'ri-file-search-line',
      title: 'Policy Review & Analysis',
      description: 'Review existing regulatory frameworks and identify gaps, overlaps, and improvement opportunities.'
    },
    {
      icon: 'ri-graduation-cap-line',
      title: 'Capacity Building',
      description: 'Provide training to regulatory agencies and share best practices in regulatory development.'
    },
    {
      icon: 'ri-microscope-line',
      title: 'Research & Development',
      description: 'Study regulatory trends and international best practices to address emerging regulatory challenges.'
    },
    {
      icon: 'ri-bar-chart-box-line',
      title: 'Monitoring & Evaluation',
      description: 'Monitor implementation and effectiveness of regulations and recommend improvements.'
    }
  ]

  const values = [
    {
      icon: 'ri-eye-line',
      title: 'Transparency',
      description: 'Open and accountable processes in all our activities'
    },
    {
      icon: 'ri-star-line',
      title: 'Excellence',
      description: 'Commitment to quality and best practices'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Integrity',
      description: 'Ethical conduct in all our activities'
    },
    {
      icon: 'ri-lightbulb-line',
      title: 'Innovation',
      description: 'Embracing new ideas and technologies'
    }
  ]

  const partners = [
    { name: 'ZTA', full: 'Zambia Tourism Agency' },
    { name: 'ZMA', full: 'Zambia Medicines Authority' },
    { name: 'ZBS', full: 'Zambia Bureau of Standards' },
    { name: 'NAPSA', full: 'National Pension Scheme Authority' },
    { name: 'ZPPA', full: 'Zambia Public Procurement Authority' },
    { name: 'MCTI', full: 'Ministry of Commerce, Trade and Industry' },
    { name: 'CEEC', full: 'Citizens Economic Empowerment Commission' },
    { name: 'PACRA', full: 'Patents and Companies Registration Agency' }
  ]

  return (
    <div>
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-br from-blue-900 to-emerald-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">About BRRA</h1>
          <p className="text-xl text-emerald-100">Promoting a Conducive Business Regulatory Environment</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission & Mandate</h2>
              <p className="text-lg text-gray-700 mb-4">
                To ensure that Zambia's regulatory frameworks are evidence-based, proportionate, and conducive to sustainable economic growth while protecting public interests and promoting good governance.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Evidence-Based Decision Making</h3>
                    <p className="text-gray-600">Promote evidence-based regulatory decision making through comprehensive analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Stakeholder Participation</h3>
                    <p className="text-gray-600">Ensure stakeholder participation in regulatory processes for inclusive development</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-checkbox-circle-fill text-emerald-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Regulatory Quality</h3>
                    <p className="text-gray-600">Enhance regulatory quality and effectiveness across all sectors</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800" 
                alt="BRRA Mission" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <i className="ri-map-pin-line text-3xl text-emerald-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-sm text-gray-600">Plot No. 2251, Fairley Road, Ridgeway, LUSAKA, ZAMBIA</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <i className="ri-time-line text-3xl text-emerald-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
              <p className="text-sm text-gray-600">Monday - Friday<br/>8:00AM – 5:00PM</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <i className="ri-phone-line text-3xl text-emerald-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-sm text-gray-600">+260 211 259165</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <i className="ri-mail-line text-3xl text-emerald-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-sm text-gray-600">info@brra.org.zm</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Functions</h2>
            <p className="text-gray-600">How we serve Zambia's business regulatory environment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {functions.map((func, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <i className={`${func.icon} text-4xl text-emerald-600 mb-4`}></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{func.title}</h3>
                <p className="text-gray-600">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-gray-600">Meet the professionals driving BRRA's mission</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
                <img src={leader.image} alt={leader.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-emerald-600 font-medium mb-3">{leader.position}</p>
                  <p className="text-gray-600 text-sm">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide our work</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <i className={`${value.icon} text-5xl text-emerald-600 mb-4`}></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Partners</h2>
            <p className="text-emerald-100">Collaborating with key regulatory agencies across Zambia</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                <div className="font-bold text-lg text-white mb-1">{partner.name}</div>
                <div className="text-xs text-emerald-100">{partner.full}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
