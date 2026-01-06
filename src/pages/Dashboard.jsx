import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user, signOut } = useAuth()

  const stats = [
    { icon: 'ri-file-text-line', label: 'Submissions', value: '12', color: 'emerald' },
    { icon: 'ri-time-line', label: 'Pending Review', value: '3', color: 'amber' },
    { icon: 'ri-checkbox-circle-line', label: 'Approved', value: '8', color: 'green' },
    { icon: 'ri-close-circle-line', label: 'Rejected', value: '1', color: 'red' }
  ]

  const recentSubmissions = [
    {
      id: 'RIA-2024-001',
      title: 'Tourism Licensing Framework',
      date: '2024-12-15',
      status: 'Under Review',
      statusColor: 'amber'
    },
    {
      id: 'RIA-2024-002',
      title: 'Food Safety Regulations',
      date: '2024-12-10',
      status: 'Approved',
      statusColor: 'green'
    },
    {
      id: 'RIA-2024-003',
      title: 'Construction Permits Update',
      date: '2024-12-05',
      status: 'Pending Documents',
      statusColor: 'blue'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-emerald-100">
                {user?.email || 'User'}
              </p>
            </div>
            <button
              onClick={signOut}
              className="mt-4 md:mt-0 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
            >
              <i className="ri-logout-box-line mr-2"></i>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-2xl text-${stat.color}-600`}></i>
                </div>
                <span className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</span>
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Submissions</h2>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">
                  <i className="ri-add-line mr-2"></i>
                  New Submission
                </button>
              </div>

              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{submission.title}</h3>
                        <p className="text-sm text-gray-500">ID: {submission.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                        submission.statusColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                        submission.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <i className="ri-calendar-line mr-1"></i>
                        {submission.date}
                      </span>
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                        View Details
                        <i className="ri-arrow-right-line ml-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                  View All Submissions
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <i className="ri-file-add-line text-xl text-emerald-600"></i>
                  <span className="font-medium text-gray-900">Submit New Framework</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <i className="ri-search-line text-xl text-blue-600"></i>
                  <span className="font-medium text-gray-900">Track Submission</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <i className="ri-download-line text-xl text-purple-600"></i>
                  <span className="font-medium text-gray-900">Download Forms</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <i className="ri-book-line text-xl text-amber-600"></i>
                  <span className="font-medium text-gray-900">View Guidelines</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Need Help?</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Our support team is here to assist you with any questions or issues.
              </p>
              <div className="space-y-2">
                <a href="tel:+260211259165" className="flex items-center space-x-2 text-sm hover:text-emerald-100 transition-colors">
                  <i className="ri-phone-line"></i>
                  <span>+260 211 259165</span>
                </a>
                <a href="mailto:info@brra.org.zm" className="flex items-center space-x-2 text-sm hover:text-emerald-100 transition-colors">
                  <i className="ri-mail-line"></i>
                  <span>info@brra.org.zm</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 pb-3 border-b border-gray-200">
                  <i className="ri-notification-line text-emerald-600 mt-1"></i>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Framework Approved</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b border-gray-200">
                  <i className="ri-message-line text-blue-600 mt-1"></i>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">New Comment on RIA-2024-001</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <i className="ri-information-line text-amber-600 mt-1"></i>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">System Maintenance Scheduled</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
