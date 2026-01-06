const Departments = () => {
  const departments = [
    {
      id: 'executive',
      icon: 'ri-user-star-line',
      name: 'Office of the Executive Director',
      brief: 'Strategic leadership and coordination of Agency programmes and activities.',
      description: 'The Office of the Director and Chief Executive Officer (CEO) provides strategic focus and direction, as well as coordinating the implementation of the programmes and activities of the Agency. In addition, it ensures that there are effective communication channels and feedback mechanisms within the Agency and with external stakeholders.',
      responsibilities: [
        'Strategic planning and direction',
        'Coordination of agency programmes',
        'Stakeholder relationship management',
        'Policy oversight and governance',
        'Performance monitoring and evaluation'
      ]
    },
    {
      id: 'policy',
      icon: 'ri-file-text-line',
      name: 'Policy Analysis & Development',
      brief: 'Research, analysis, and development of regulatory frameworks.',
      description: 'This department is responsible for conducting comprehensive research and analysis of regulatory policies, developing evidence-based recommendations, and supporting regulatory agencies in framework development.',
      responsibilities: [
        'Regulatory impact assessments',
        'Policy research and analysis',
        'Framework development support',
        'Economic impact studies',
        'Best practice research'
      ]
    },
    {
      id: 'stakeholder',
      icon: 'ri-team-line',
      name: 'Stakeholder Engagement',
      brief: 'Facilitating consultation and engagement with regulatory stakeholders.',
      description: 'The Stakeholder Engagement department manages relationships with regulatory agencies, businesses, and the public, ensuring inclusive participation in regulatory processes.',
      responsibilities: [
        'Public consultations',
        'Stakeholder workshops and forums',
        'Communication and outreach',
        'Feedback collection and analysis',
        'Partnership development'
      ]
    },
    {
      id: 'ria',
      icon: 'ri-line-chart-line',
      name: 'Regulatory Impact Assessment Unit',
      brief: 'Conducting comprehensive impact assessments of proposed regulations.',
      description: 'The RIA Unit evaluates the potential impacts of proposed regulations on businesses, consumers, and the economy, ensuring evidence-based regulatory decision-making.',
      responsibilities: [
        'Cost-benefit analysis',
        'Impact assessment studies',
        'Risk evaluation',
        'Alternative analysis',
        'Compliance cost estimation'
      ]
    },
    {
      id: 'legal',
      icon: 'ri-scales-line',
      name: 'Legal & Compliance',
      brief: 'Ensuring legal compliance and providing legal advisory services.',
      description: 'This department provides legal advisory services, ensures compliance with relevant laws and regulations, and supports the development of legally sound regulatory frameworks.',
      responsibilities: [
        'Legal advisory services',
        'Compliance monitoring',
        'Contract review and management',
        'Legislative drafting support',
        'Dispute resolution'
      ]
    },
    {
      id: 'finance',
      icon: 'ri-money-dollar-circle-line',
      name: 'Finance & Administration',
      brief: 'Managing financial resources and administrative operations.',
      description: 'The Finance & Administration department manages the Agency\'s financial resources, procurement, human resources, and general administrative functions.',
      responsibilities: [
        'Financial planning and budgeting',
        'Procurement management',
        'Human resource management',
        'Asset management',
        'Administrative support services'
      ]
    },
    {
      id: 'ict',
      icon: 'ri-computer-line',
      name: 'ICT & Innovation',
      brief: 'Managing technology infrastructure and digital transformation initiatives.',
      description: 'This department oversees the Agency\'s technology infrastructure, develops digital solutions for regulatory services, and drives innovation in service delivery.',
      responsibilities: [
        'IT infrastructure management',
        'Digital platform development',
        'Data management and security',
        'Technology innovation',
        'Technical support services'
      ]
    }
  ]

  return (
    <div>
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-br from-blue-900 to-emerald-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Our Departments</h1>
          <p className="text-xl text-emerald-100">Specialized units driving BRRA's mission</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Organizational Structure</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              BRRA is organized into specialized departments and units, each with specific mandates and responsibilities that contribute to our overall mission of enhancing Zambia's regulatory environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {departments.map((dept) => (
              <a
                key={dept.id}
                href={`#${dept.id}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-all hover:scale-105"
              >
                <i className={`${dept.icon} text-4xl text-emerald-600 mb-3`}></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-gray-600">{dept.brief}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {departments.map((dept, index) => (
        <section
          key={dept.id}
          id={dept.id}
          className={`py-20 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <i className={`${dept.icon} text-3xl text-emerald-600`}></i>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{dept.name}</h2>
                    <p className="text-emerald-600 font-medium">{dept.brief}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{dept.description}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-3">
                  {dept.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <i className="ri-checkbox-circle-fill text-emerald-600 text-xl mt-0.5"></i>
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Work With Us</h2>
          <p className="text-emerald-100 mb-8">
            Interested in collaborating with BRRA or learning more about our departments? Get in touch with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-emerald-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Contact Us
            </a>
            <a
              href="#"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-emerald-600 transition-colors font-medium"
            >
              Download Organizational Chart
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Departments
