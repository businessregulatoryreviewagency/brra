import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const AdminDashboard = () => {
  const { user, profile } = useAuth()
  const [users, setUsers] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, submissionsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('submissions').select('*, profiles(full_name, email)').order('created_at', { ascending: false })
      ])

      if (usersRes.data) setUsers(usersRes.data)
      if (submissionsRes.data) setSubmissions(submissionsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update user role')
    }
  }

  const approveUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Failed to approve user')
    }
  }

  const stats = {
    totalUsers: users.length,
    pendingApproval: users.filter(u => !u.is_approved).length,
    totalSubmissions: submissions.length,
    pendingReview: submissions.filter(s => s.status === 'submitted' || s.status === 'under_review').length
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
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-emerald-100">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            <div className="px-4 py-2 bg-white/20 rounded-md">
              <span className="text-sm font-medium">Role: Administrator</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-2xl text-blue-600"></i>
              </div>
              <span className="text-3xl font-bold text-blue-600">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Users</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-2xl text-amber-600"></i>
              </div>
              <span className="text-3xl font-bold text-amber-600">{stats.pendingApproval}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending Approval</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-2xl text-emerald-600"></i>
              </div>
              <span className="text-3xl font-bold text-emerald-600">{stats.totalSubmissions}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Submissions</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-eye-line text-2xl text-purple-600"></i>
              </div>
              <span className="text-3xl font-bold text-purple-600">{stats.pendingReview}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending Review</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'overview'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'users'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setSelectedTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'submissions'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Submissions
              </button>
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-emerald-600"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name || 'New User'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{u.full_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{u.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {u.agency_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={u.role}
                              onChange={(e) => updateUserRole(u.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="staff">Staff</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              u.is_approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {u.is_approved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {!u.is_approved && (
                              <button
                                onClick={() => approveUser(u.id)}
                                className="text-emerald-600 hover:text-emerald-900 font-medium"
                              >
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'submissions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Submissions</h3>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{submission.title}</h4>
                          <p className="text-sm text-gray-500">ID: {submission.submission_id}</p>
                          <p className="text-sm text-gray-500">
                            Submitted by: {submission.profiles?.full_name || submission.profiles?.email}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                          submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          submission.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {submission.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      {submission.description && (
                        <p className="text-sm text-gray-600 mb-2">{submission.description}</p>
                      )}
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No submissions yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
