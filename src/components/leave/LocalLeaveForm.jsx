import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { calculateWorkingDays, calculateMonthsBetween } from '../../utils/leaveCalculations'

const LocalLeaveForm = ({ onSuccess }) => {
  const { user, profile } = useAuth()
  const [staffMembers, setStaffMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    station: '',
    last_leave_date: '',
    months_since_last_leave: 0,
    rate_of_leave: 2.5,
    division: '',
    start_date: '',
    end_date: '',
    address_on_leave: '',
    ed_id: '',
    ed_name: ''
  })

  useEffect(() => {
    fetchStaffMembers()
  }, [])

  useEffect(() => {
    if (formData.last_leave_date && formData.start_date) {
      const months = calculateMonthsBetween(formData.last_leave_date, formData.start_date)
      setFormData(prev => ({ ...prev, months_since_last_leave: months }))
    }
  }, [formData.last_leave_date, formData.start_date])

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

  const accruedDays = Math.floor(formData.months_since_last_leave * formData.rate_of_leave)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!profile?.employee_number) {
      alert('Please complete your profile information before applying for leave')
      return
    }

    if (!formData.ed_id) {
      alert('Please select an approver (ED or Head of Department)')
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
          department: profile.agency_name || 'N/A',
          position: profile.position || 'N/A',
          date_of_appointment: profile.date_of_appointment
        },
        leave_type: 'Local Leave',
        start_date: formData.start_date,
        end_date: formData.end_date,
        requested_days: workingDays,
        address_on_leave: formData.address_on_leave,
        station: formData.station,
        last_leave_date: formData.last_leave_date,
        months_since_last_leave: formData.months_since_last_leave,
        rate_of_leave: formData.rate_of_leave,
        accrued_leave_days: accruedDays,
        division: formData.division,
        ed_id: formData.ed_id,
        ed_name: formData.ed_name,
        status: 'Pending ED',
        supervisor_decision: 'Approved',
        hr_decision: 'Approved'
      }

      const { error } = await supabase
        .from('leave_requests')
        .insert([leaveRequest])

      if (error) throw error

      alert('Local leave request submitted successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error submitting leave request:', error)
      alert('Failed to submit leave request: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproverChange = (email) => {
    const staff = staffMembers.find(s => s.email === email)
    if (staff) {
      setFormData({
        ...formData,
        ed_id: email,
        ed_name: staff.full_name
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Local/Casual Leave Application Form</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Part 1 - Applicant Section */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-gray-100 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
            PART 1 - Applicant Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Employee Number</label>
              <p className="text-gray-900">{profile?.employee_number || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Department</label>
              <p className="text-gray-900">{profile?.agency_name || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="text-sm font-medium text-gray-600">Position</label>
              <p className="text-gray-900">{profile?.position || 'Not set'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Station <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Lusaka HQ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division/Unit
              </label>
              <input
                type="text"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your division"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Leave Taken
              </label>
              <input
                type="date"
                value={formData.last_leave_date}
                onChange={(e) => setFormData({ ...formData, last_leave_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate of Leave (days/month)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.rate_of_leave}
                onChange={(e) => setFormData({ ...formData, rate_of_leave: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Months Since Last Leave
              </label>
              <div className="w-full px-4 py-2 bg-blue-50 border-2 border-blue-500 rounded-md font-bold text-blue-700">
                {formData.months_since_last_leave} months
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accrued Leave Days
              </label>
              <div className="w-full px-4 py-2 bg-emerald-50 border-2 border-emerald-500 rounded-md font-bold text-emerald-700">
                {accruedDays} days
              </div>
            </div>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Resume Duty) <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                min={formData.start_date}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days Applied For
              </label>
              <div className="w-full px-4 py-2 bg-purple-50 border-2 border-purple-500 rounded-md font-bold text-purple-700 text-center">
                {workingDays} days
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address During Leave <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              value={formData.address_on_leave}
              onChange={(e) => setFormData({ ...formData, address_on_leave: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter your contact address during leave"
            ></textarea>
          </div>
        </div>

        {/* Part 2 - Approval */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-amber-100 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
            PART 2 - Approval
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Approver (Executive Director or Head of Department) <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={formData.ed_id}
              onChange={(e) => handleApproverChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Choose approver</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.email}>
                  {staff.full_name} ({staff.email})
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Local/Casual leave requires single-tier approval from ED or Head of Department
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || workingDays === 0}
            className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Submitting...
              </span>
            ) : (
              <>
                <i className="ri-send-plane-line mr-2"></i>
                Submit Local Leave Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LocalLeaveForm
