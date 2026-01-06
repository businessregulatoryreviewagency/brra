import { useState } from 'react'

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Policy Update', 'Infrastructure', 'Report', 'Consultation', 'Guidelines']

  const newsArticles = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
      category: 'Policy Update',
      date: 'December 15, 2024',
      title: 'New RIA Guidelines Released for Public Consultation',
      excerpt: 'BRRA announces updated Regulatory Impact Assessment guidelines aimed at enhancing stakeholder participation and improving the quality of regulatory analysis across all sectors.',
      featured: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      category: 'Infrastructure',
      date: 'December 10, 2024',
      title: 'BRRA Launches Regulatory Services Centre in Ndola',
      excerpt: 'The new RSC will provide streamlined access to business licensing services for the Copperbelt region, reducing costs and improving efficiency for local businesses.',
      featured: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      category: 'Report',
      date: 'December 5, 2024',
      title: 'Strategic Plan 2022-2026 Implementation Progress',
      excerpt: 'BRRA releases mid-term review showing significant progress in operational excellence and partnerships with regulatory agencies.',
      featured: false
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      category: 'Consultation',
      date: 'November 28, 2024',
      title: 'Stakeholder Workshop on Business Licensing Reform',
      excerpt: 'Over 50 regulatory agencies participated in the workshop focused on streamlining licensing processes and reducing regulatory burden.',
      featured: false
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      category: 'Guidelines',
      date: 'November 20, 2024',
      title: 'Updated Framework Submission Guidelines Published',
      excerpt: 'New guidelines provide clearer instructions for regulatory agencies submitting frameworks for RIA review.',
      featured: false
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      category: 'Policy Update',
      date: 'November 15, 2024',
      title: 'BRRA Partners with International Regulatory Bodies',
      excerpt: 'New partnerships aim to bring international best practices to Zambia\'s regulatory environment.',
      featured: false
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      category: 'Report',
      date: 'November 5, 2024',
      title: 'Annual Regulatory Impact Assessment Report 2024',
      excerpt: 'Comprehensive analysis of regulatory impacts across key economic sectors in Zambia.',
      featured: false
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      category: 'Infrastructure',
      date: 'October 28, 2024',
      title: 'e-Registry Platform Receives Major Upgrade',
      excerpt: 'Enhanced features include improved search functionality and mobile optimization for better user experience.',
      featured: false
    }
  ]

  const filteredNews = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory)

  const featuredNews = newsArticles.filter(article => article.featured)

  return (
    <div>
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-br from-blue-900 to-emerald-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-xl text-emerald-100">Stay informed about BRRA's activities and regulatory developments</p>
        </div>
      </section>

      {featuredNews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-500">{article.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center">
                      Read Full Article
                      <i className="ri-arrow-right-line ml-2"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">All News</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center">
                    Read More
                    <i className="ri-arrow-right-line ml-2"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-emerald-100 mb-8">
            Get the latest news and updates from BRRA delivered directly to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default News
