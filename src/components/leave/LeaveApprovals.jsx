import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatDisplayDate, getStatusColor } from '../../utils/leaveCalculations'

const LeaveApprovals = () => {
  const { user, profile } = useAuth()
  const [activeRole, setActiveRole] = useState('supervisor')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [notes, setNotes] = useState('')
  const [processingAction, setProcessingAction] = useState(false)

  useEffect(() => {
    // Set initial active role based on user permissions
    if (profile?.is_ed) setActiveRole('ed')
    else if (profile?.is_hr) setActiveRole('hr')
    else if (profile?.is_supervisor) setActiveRole('supervisor')
    
    fetchPendingRequests()
  }, [user, profile, activeRole])

  const fetchPendingRequests = async () => {
    setLoading(true)
    try {
      let query = supabase.from('leave_requests').select('*')

      if (activeRole === 'supervisor') {
        query = query
          .eq('supervisor_id', user.email)
          .eq('supervisor_decision', 'Pending')
      } else if (activeRole === 'hr') {
        query = query
          .eq('hr_id', user.email)
          .eq('supervisor_decision', 'Approved')
          .eq('hr_decision', 'Pending')
      } else if (activeRole === 'ed') {
        query = query
          .eq('ed_id', user.email)
          .eq('hr_decision', 'Approved')
          .eq('ed_decision', 'Pending')
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedRequest) return
    setProcessingAction(true)

    try {
      const updates = {
        updated_at: new Date().toISOString()
      }

      if (activeRole === 'supervisor') {
        updates.supervisor_decision = 'Approved'
        updates.supervisor_notes = notes
        updates.supervisor_action_date = new Date().toISOString()
        updates.status = 'Pending HR'
      } else if (activeRole === 'hr') {
        updates.hr_decision = 'Approved'
        updates.hr_notes = notes
        updates.hr_action_date = new Date().toISOString()
        updates.status = 'Pending ED'
      } else if (activeRole === 'ed') {
        updates.ed_decision = 'Approved'
        updates.ed_notes = notes
        updates.ed_action_date = new Date().toISOString()
        updates.status = 'Approved'
        updates.approved_days = selectedRequest.requested_days
      }

      const { error } = await supabase
        .from('leave_requests')
        .update(updates)
        .eq('id', selectedRequest.id)

      if (error) throw error

      // Send email notification (simplified - you'll need to implement email service)
      console.log('Email notification would be sent here')

      alert('Leave request approved successfully!')
      setSelectedRequest(null)
      setNotes('')
      fetchPendingRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request')
    } finally {
      setProcessingAction(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest || !notes.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setProcessingAction(true)

    try {
      const updates = {
        status: 'Rejected',
        rejection_reason: notes,
        updated_at: new Date().toISOString()
      }

      if (activeRole === 'supervisor') {
        updates.supervisor_decision = 'Rejected'
        updates.supervisor_notes = notes
        updates.supervisor_action_date = new Date().toISOString()
      } else if (activeRole === 'hr') {
        updates.hr_decision = 'Rejected'
        updates.hr_notes = notes
        updates.hr_action_date = new Date().toISOString()
      } else if (activeRole === 'ed') {
        updates.ed_decision = 'Rejected'
        updates.ed_notes = notes
        updates.ed_action_date = new Date().toISOString()
      }

      const { error } = await supabase
        .from('leave_requests')
        .update(updates)
        .eq('id', selectedRequest.id)

      if (error) throw error

      alert('Leave request rejected')
      setSelectedRequest(null)
      setNotes('')
      fetchPendingRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    } finally {
      setProcessingAction(false)
    }
  }

  const roles = []
  if (profile?.is_supervisor) roles.push({ id: 'supervisor', name: 'Supervisor Approvals', icon: 'ri-user-line' })
  if (profile?.is_hr) roles.push({ id: 'hr', name: 'HR Approvals', icon: 'ri-team-line' })
  if (profile?.is_ed) roles.push({ id: 'ed', name: 'ED Approvals', icon: 'ri-user-star-line' })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <i className="ri-loader-4-line text-4xl text-emerald-600 animate-spin"></i>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Leave Approvals</h2>

      {roles.length > 1 && (
        <div className="flex gap-2 mb-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeRole === role.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={role.icon}></i>
              <span>{role.name}</span>
            </button>
          ))}
        </div>
      )}

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => {
            const employeeData = request.employee_data
            return (
              <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {employeeData.full_name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Employee No:</span> {employeeData.employee_number}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span> {employeeData.department}
                      </div>
                      <div>
                        <span className="font-medium">Position:</span> {employeeData.position}
                      </div>
                      <div>
                        <span className="font-medium">Leave Type:</span> {request.leave_type}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Start Date:</span>
                      <p className="text-gray-900">{formatDisplayDate(request.start_date)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">End Date:</span>
                      <p className="text-gray-900">{formatDisplayDate(request.end_date)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Working Days:</span>
                      <p className="text-gray-900">{request.requested_days} days</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium text-gray-700 text-sm">Address on Leave:</span>
                    <p className="text-gray-900 text-sm mt-1">{request.address_on_leave}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <i className="ri-checkbox-circle-line mr-2"></i>
                    Review & Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request)
                      setNotes('')
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    <i className="ri-close-circle-line mr-2"></i>
                    Reject
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <i className="ri-checkbox-circle-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No pending approvals</p>
        </div>
      )}

      {/* Approval Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-2xl font-bold text-gray-900">Review Leave Request</h2>
              <button
                onClick={() => {
                  setSelectedRequest(null)
                  setNotes('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900">{selectedRequest.employee_data.full_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Employee No:</span>
                    <p className="text-gray-900">{selectedRequest.employee_data.employee_number}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Department:</span>
                    <p className="text-gray-900">{selectedRequest.employee_data.department}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Position:</span>
                    <p className="text-gray-900">{selectedRequest.employee_data.position}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Details</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-gray-600">Leave Type:</span>
                      <p className="text-gray-900">{selectedRequest.leave_type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Working Days:</span>
                      <p className="text-gray-900">{selectedRequest.requested_days} days</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Start Date:</span>
                      <p className="text-gray-900">{formatDisplayDate(selectedRequest.start_date)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">End Date:</span>
                      <p className="text-gray-900">{formatDisplayDate(selectedRequest.end_date)}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 text-sm">Address on Leave:</span>
                    <p className="text-gray-900 text-sm mt-1">{selectedRequest.address_on_leave}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes {activeRole === 'reject' && <span className="text-red-600">*</span>}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
                  placeholder="Add your notes or comments..."
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleApprove}
                  disabled={processingAction}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingAction ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <i className="ri-checkbox-circle-line mr-2"></i>
                      Approve
                    </>
                  )}
                </button>
                <button
                  onClick={handleReject}
                  disabled={processingAction}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingAction ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <i className="ri-close-circle-line mr-2"></i>
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveApprovals
