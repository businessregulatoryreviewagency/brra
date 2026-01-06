import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

const LeaveDashboard = ({ onNavigate }) => {
  const { user, profile } = useAuth()
  const [recentRequests, setRecentRequests] = useState([])
  const [pendingApprovals, setPendingApprovals] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch recent leave requests
      const { data: requests } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentRequests(requests || [])

      // Count pending approvals if user is an approver
      if (profile?.is_supervisor || profile?.is_hr || profile?.is_ed || profile?.role === 'admin') {
        let query = supabase.from('leave_requests').select('id', { count: 'exact', head: true })

        if (profile.is_supervisor) {
          query = query.eq('supervisor_id', user.email).eq('supervisor_decision', 'Pending')
        } else if (profile.is_hr) {
          query = query.eq('hr_id', user.email).eq('hr_decision', 'Pending').eq('supervisor_decision', 'Approved')
        } else if (profile.is_ed) {
          query = query.eq('ed_id', user.email).eq('ed_decision', 'Pending').eq('hr_decision', 'Approved')
        }

        const { count } = await query
        setPendingApprovals(count || 0)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending Supervisor': 'bg-yellow-100 text-yellow-800',
      'Pending HR': 'bg-blue-100 text-blue-800',
      'Pending ED': 'bg-purple-100 text-purple-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <i className="ri-loader-4-line text-4xl text-emerald-600 animate-spin"></i>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-calendar-line text-4xl opacity-80"></i>
            <span className="text-5xl font-bold">{profile?.annual_leave_balance || 30}</span>
          </div>
          <h3 className="text-lg font-semibold">Annual Leave Balance</h3>
          <p className="text-emerald-100 text-sm mt-1">Days remaining this year</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-map-pin-line text-4xl opacity-80"></i>
            <span className="text-5xl font-bold">{profile?.local_leave_balance || 30}</span>
          </div>
          <h3 className="text-lg font-semibold">Local Leave Balance</h3>
          <p className="text-blue-100 text-sm mt-1">Days remaining this year</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <i className="ri-heart-pulse-line text-4xl opacity-80"></i>
            <span className="text-5xl font-bold">{profile?.sick_leave_balance || 90}</span>
          </div>
          <h3 className="text-lg font-semibold">Sick Leave Balance</h3>
          <p className="text-purple-100 text-sm mt-1">Days remaining this year</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onNavigate('apply')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-emerald-600"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-add-line text-2xl text-emerald-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Apply for Leave</h3>
              <p className="text-sm text-gray-600">Submit a new leave request</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-blue-600"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-history-line text-2xl text-blue-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">View & Print Applications</h3>
              <p className="text-sm text-gray-600">Access your leave history</p>
            </div>
          </div>
        </button>

        {(profile?.is_supervisor || profile?.is_hr || profile?.is_ed || profile?.role === 'admin') && (
          <button
            onClick={() => onNavigate('approvals')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-purple-600 relative"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-line text-2xl text-purple-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Review Approvals</h3>
                <p className="text-sm text-gray-600">Process pending leave requests</p>
              </div>
            </div>
            {pendingApprovals > 0 && (
              <span className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {pendingApprovals}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Recent Leave Requests */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Leave Requests</h2>
        
        {recentRequests.length > 0 ? (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.leave_type}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <i className="ri-calendar-line mr-1"></i>
                      {request.requested_days} working days
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No leave requests yet</p>
            <button
              onClick={() => onNavigate('apply')}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Apply for Leave
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaveDashboard
