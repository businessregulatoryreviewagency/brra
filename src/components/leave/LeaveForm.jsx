import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { calculateWorkingDays } from '../../utils/leaveCalculations'

const LeaveForm = ({ onSuccess }) => {
  const { user, profile } = useAuth()
  const [staffMembers, setStaffMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    commuted_days: 0,
    address_on_leave: '',
    supervisor_id: '',
    supervisor_name: '',
    hr_id: '',
    hr_name: '',
    ed_id: '',
    ed_name: ''
  })

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Compassionate Leave',
    'Study Leave',
    'Commutation of Leave'
  ]

  useEffect(() => {
    fetchStaffMembers()
  }, [])

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('is_approved', true)
        .neq('id', user.id)
        .order('full_name')

      if (error) throw error
      setStaffMembers(data || [])
    } catch (error) {
      console.error('Error fetching staff:', error)
    }
  }

  const workingDays = formData.start_date && formData.end_date
    ? calculateWorkingDays(formData.start_date, formData.end_date)
    : 0

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!profile?.employee_number || !profile?.nrc_no) {
      alert('Please complete your profile information before applying for leave')
      return
    }

    if (!formData.supervisor_id || !formData.hr_id || !formData.ed_id) {
      alert('Please select all approvers (Supervisor, HR, and ED)')
      return
    }

    setLoading(true)

    try {
      const leaveRequest = {
        requester_id: user.id,
        employee_data: {
          full_name: profile.full_name,
          email: user.email,
          employee_number: profile.employee_number,
          nrc_no: profile.nrc_no,
          department: profile.agency_name || 'N/A',
          position: profile.position || 'N/A',
          grade: profile.grade || 'N/A',
          salary: profile.salary || 0,
          date_of_appointment: profile.date_of_appointment,
          date_of_return_after_last_leave: profile.date_of_return_after_last_leave,
          date_last_travel_allowance: profile.date_last_travel_allowance
        },
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        requested_days: workingDays,
        commuted_days: formData.leave_type === 'Commutation of Leave' ? formData.commuted_days : 0,
        address_on_leave: formData.address_on_leave,
        supervisor_id: formData.supervisor_id,
        supervisor_name: formData.supervisor_name,
        hr_id: formData.hr_id,
        hr_name: formData.hr_name,
        ed_id: formData.ed_id,
        ed_name: formData.ed_name,
        status: 'Pending Supervisor'
      }

      const { error } = await supabase
        .from('leave_requests')
        .insert([leaveRequest])

      if (error) throw error

      alert('Leave request submitted successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error submitting leave request:', error)
      alert('Failed to submit leave request: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproverChange = (field, email) => {
    const staff = staffMembers.find(s => s.email === email)
    if (staff) {
      setFormData({
        ...formData,
        [field]: email,
        [`${field.replace('_id', '_name')}`]: staff.full_name
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Annual Leave Application Form</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Part A - Applicant Information */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-gray-100 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
            PART A - Applicant Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Employee Number</label>
              <p className="text-gray-900">{profile?.employee_number || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">NRC Number</label>
              <p className="text-gray-900">{profile?.nrc_no || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Department</label>
              <p className="text-gray-900">{profile?.agency_name || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Position</label>
              <p className="text-gray-900">{profile?.position || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Grade</label>
              <p className="text-gray-900">{profile?.grade || 'Not set'}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={formData.leave_type}
                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {formData.leave_type === 'Commutation of Leave' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commuted Days <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.commuted_days}
                  onChange={(e) => setFormData({ ...formData, commuted_days: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                min={formData.start_date}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days
              </label>
              <div className="w-full px-4 py-2 bg-emerald-50 border-2 border-emerald-500 rounded-md font-bold text-emerald-700 text-center">
                {workingDays} days
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address on Leave <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              value={formData.address_on_leave}
              onChange={(e) => setFormData({ ...formData, address_on_leave: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Enter your contact address during leave"
            ></textarea>
          </div>
        </div>

        {/* Part B - Supervisor */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-blue-100 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
            PART B - Head of Department / Supervisor
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Supervisor <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={formData.supervisor_id}
              onChange={(e) => handleApproverChange('supervisor_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose supervisor</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.email}>
                  {staff.full_name} ({staff.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Part C - HR Officer */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-purple-100 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
            PART C - HR Officer
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select HR Officer <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={formData.hr_id}
              onChange={(e) => handleApproverChange('hr_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Choose HR officer</option>
              {staffMembers.filter(s => s.role === 'staff' || s.role === 'admin').map((staff) => (
                <option key={staff.id} value={staff.email}>
                  {staff.full_name} ({staff.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Part D - Executive Director */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-amber-100 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
            PART D - Executive Director
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Executive Director <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={formData.ed_id}
              onChange={(e) => handleApproverChange('ed_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Choose executive director</option>
              {staffMembers.filter(s => s.role === 'admin').map((staff) => (
                <option key={staff.id} value={staff.email}>
                  {staff.full_name} ({staff.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || workingDays === 0}
            className="flex-1 px-8 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Submitting...
              </span>
            ) : (
              <>
                <i className="ri-send-plane-line mr-2"></i>
                Submit Leave Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LeaveForm
