import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const StaffDashboard = () => {
  const { user, profile } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, profiles(full_name, email, agency_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (submissionId, newStatus) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status: newStatus,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || null
        })
        .eq('id', submissionId)

      if (error) throw error
      
      setSelectedSubmission(null)
      setReviewNotes('')
      fetchSubmissions()
      alert('Submission status updated successfully')
    } catch (error) {
      console.error('Error updating submission:', error)
      alert('Failed to update submission status')
    }
  }

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    underReview: submissions.filter(s => s.status === 'under_review').length,
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Staff Dashboard</h1>
              <p className="text-emerald-100">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-md">
              <span className="text-sm font-medium">Role: Staff</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/leave-management"
          className="mb-6 block bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Leave Management System</h3>
              <p className="text-emerald-100">Manage leave requests and approvals</p>
            </div>
            <i className="ri-calendar-check-line text-5xl opacity-80"></i>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-3xl font-bold text-blue-600">{stats.total}</span>
            </div>
            <p className="text-gray-600 font-medium">Total</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="ri-inbox-line text-2xl text-amber-600"></i>
              </div>
              <span className="text-3xl font-bold text-amber-600">{stats.submitted}</span>
            </div>
            <p className="text-gray-600 font-medium">New</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-eye-line text-2xl text-purple-600"></i>
              </div>
              <span className="text-3xl font-bold text-purple-600">{stats.underReview}</span>
            </div>
            <p className="text-gray-600 font-medium">In Review</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
              </div>
              <span className="text-3xl font-bold text-green-600">{stats.approved}</span>
            </div>
            <p className="text-gray-600 font-medium">Approved</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-close-circle-line text-2xl text-red-600"></i>
              </div>
              <span className="text-3xl font-bold text-red-600">{stats.rejected}</span>
            </div>
            <p className="text-gray-600 font-medium">Rejected</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Submissions</h2>
          
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{submission.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">ID: {submission.submission_id}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <i className="ri-building-line mr-1"></i>
                        {submission.profiles?.agency_name || 'N/A'}
                      </span>
                      <span className="flex items-center">
                        <i className="ri-user-line mr-1"></i>
                        {submission.profiles?.full_name || submission.profiles?.email}
                      </span>
                      <span className="flex items-center">
                        <i className="ri-calendar-line mr-1"></i>
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                    submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    submission.status === 'under_review' ? 'bg-purple-100 text-purple-700' :
                    submission.status === 'pending_documents' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {submission.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {submission.description && (
                  <p className="text-gray-600 mb-4">{submission.description}</p>
                )}

                {submission.review_notes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-blue-900">
                      <strong>Review Notes:</strong> {submission.review_notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Review Submission
                  </button>
                </div>
              </div>
            ))}

            {submissions.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">No submissions to review</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-900">Review Submission</h2>
              <button
                onClick={() => {
                  setSelectedSubmission(null)
                  setReviewNotes('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedSubmission.title}</h3>
                <p className="text-sm text-gray-500 mb-4">ID: {selectedSubmission.submission_id}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Agency</p>
                    <p className="font-medium">{selectedSubmission.profiles?.agency_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted By</p>
                    <p className="font-medium">{selectedSubmission.profiles?.full_name || selectedSubmission.profiles?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-medium">{new Date(selectedSubmission.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className="font-medium">{selectedSubmission.status.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>

                {selectedSubmission.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-gray-900">{selectedSubmission.description}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
                  placeholder="Add notes about your review..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, 'under_review')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
                >
                  <i className="ri-eye-line mr-2"></i>
                  Mark Under Review
                </button>
                <button
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, 'pending_documents')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  <i className="ri-file-list-line mr-2"></i>
                  Request Documents
                </button>
                <button
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, 'approved')}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  <i className="ri-checkbox-circle-line mr-2"></i>
                  Approve
                </button>
                <button
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, 'rejected')}
                  className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  <i className="ri-close-circle-line mr-2"></i>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffDashboard
