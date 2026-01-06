import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const UserDashboard = () => {
  const { user, profile } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewSubmissionModal, setShowNewSubmissionModal] = useState(false)
  const [newSubmission, setNewSubmission] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    fetchSubmissions()
  }, [user])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSubmission = async (e) => {
    e.preventDefault()
    
    try {
      const submissionId = `RIA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
      
      const { error } = await supabase
        .from('submissions')
        .insert([{
          user_id: user.id,
          submission_id: submissionId,
          title: newSubmission.title,
          description: newSubmission.description,
          status: 'draft',
          submitted_at: new Date().toISOString()
        }])

      if (error) throw error

      setShowNewSubmissionModal(false)
      setNewSubmission({ title: '', description: '' })
      fetchSubmissions()
      alert('Submission created successfully!')
    } catch (error) {
      console.error('Error creating submission:', error)
      alert('Failed to create submission')
    }
  }

  const submitForReview = async (submissionId) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'submitted', submitted_at: new Date().toISOString() })
        .eq('id', submissionId)

      if (error) throw error
      fetchSubmissions()
      alert('Submission sent for review!')
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Failed to submit for review')
    }
  }

  const stats = {
    total: submissions.length,
    draft: submissions.filter(s => s.status === 'draft').length,
    pending: submissions.filter(s => ['submitted', 'under_review', 'pending_documents'].includes(s.status)).length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line text-4xl text-emerald-600 animate-spin"></i>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-900 to-emerald-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
              <p className="text-emerald-100">
                {profile?.agency_name || 'Welcome'} - {profile?.full_name || user?.email}
              </p>
            </div>
            <button
              onClick={() => setShowNewSubmissionModal(true)}
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-emerald-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              <i className="ri-add-line mr-2"></i>
              New Submission
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-3xl font-bold text-blue-600">{stats.total}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Submissions</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="ri-draft-line text-2xl text-gray-600"></i>
              </div>
              <span className="text-3xl font-bold text-gray-600">{stats.draft}</span>
            </div>
            <p className="text-gray-600 font-medium">Drafts</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-2xl text-amber-600"></i>
              </div>
              <span className="text-3xl font-bold text-amber-600">{stats.pending}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending Review</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
              </div>
              <span className="text-3xl font-bold text-green-600">{stats.approved}</span>
            </div>
            <p className="text-gray-600 font-medium">Approved</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-close-circle-line text-2xl text-red-600"></i>
              </div>
              <span className="text-3xl font-bold text-red-600">{stats.rejected}</span>
            </div>
            <p className="text-gray-600 font-medium">Rejected</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Submissions</h2>

              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{submission.title}</h3>
                        <p className="text-sm text-gray-500">ID: {submission.submission_id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                        submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        submission.status === 'under_review' ? 'bg-purple-100 text-purple-700' :
                        submission.status === 'pending_documents' ? 'bg-blue-100 text-blue-700' :
                        submission.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {submission.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    {submission.description && (
                      <p className="text-sm text-gray-600 mb-3">{submission.description}</p>
                    )}

                    {submission.review_notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <p className="text-sm text-blue-900">
                          <strong>Review Notes:</strong> {submission.review_notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <i className="ri-calendar-line mr-1"></i>
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                      {submission.status === 'draft' && (
                        <button
                          onClick={() => submitForReview(submission.id)}
                          className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Submit for Review
                          <i className="ri-arrow-right-line ml-1"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {submissions.length === 0 && (
                  <div className="text-center py-12">
                    <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4">No submissions yet</p>
                    <button
                      onClick={() => setShowNewSubmissionModal(true)}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Create Your First Submission
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowNewSubmissionModal(true)}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <i className="ri-file-add-line text-xl text-emerald-600"></i>
                  <span className="font-medium text-gray-900">New Submission</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <i className="ri-download-line text-xl text-blue-600"></i>
                  <span className="font-medium text-gray-900">Download Forms</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <i className="ri-book-line text-xl text-purple-600"></i>
                  <span className="font-medium text-gray-900">View Guidelines</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Need Help?</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Contact our support team for assistance with your submissions.
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
          </div>
        </div>
      </div>

      {showNewSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-900">New Submission</h2>
              <button
                onClick={() => {
                  setShowNewSubmissionModal(false)
                  setNewSubmission({ title: '', description: '' })
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={createSubmission} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSubmission.title}
                  onChange={(e) => setNewSubmission({ ...newSubmission, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="e.g., Tourism Licensing Framework"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newSubmission.description}
                  onChange={(e) => setNewSubmission({ ...newSubmission, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
                  placeholder="Provide a brief description of your submission..."
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
                >
                  Create Submission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewSubmissionModal(false)
                    setNewSubmission({ title: '', description: '' })
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
