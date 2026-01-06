import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { formatDisplayDate, getStatusColor, getStatusIcon } from '../../utils/leaveCalculations'

const LeaveHistory = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLeaveRequests()
  }, [user])

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching leave requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter)

  const handlePrint = (request) => {
    const printWindow = window.open('', '_blank')
    const employeeData = request.employee_data

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Leave Application - ${request.leave_type}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #10B981; }
          h1 { font-size: 20px; margin: 10px 0; }
          .section { margin: 30px 0; padding: 20px; border: 1px solid #ddd; }
          .section-title { font-weight: bold; background: #f3f4f6; padding: 10px; margin: -20px -20px 15px -20px; }
          .field { margin: 10px 0; display: flex; }
          .field-label { font-weight: bold; width: 200px; }
          .field-value { flex: 1; }
          .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 40px; padding-top: 5px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">BRRA</div>
          <div>Business Regulatory Review Agency</div>
          <h1>APPLICATION FOR LEAVE: ${request.leave_type}</h1>
        </div>

        <div class="section">
          <div class="section-title">PART A - APPLICANT INFORMATION</div>
          <div class="field"><div class="field-label">Name:</div><div class="field-value">${employeeData.full_name}</div></div>
          <div class="field"><div class="field-label">File No:</div><div class="field-value">${employeeData.employee_number}</div></div>
          <div class="field"><div class="field-label">NRC No:</div><div class="field-value">${employeeData.nrc_no}</div></div>
          <div class="field"><div class="field-label">Department:</div><div class="field-value">${employeeData.department}</div></div>
          <div class="field"><div class="field-label">Position:</div><div class="field-value">${employeeData.position}</div></div>
          <div class="field"><div class="field-label">Grade:</div><div class="field-value">${employeeData.grade}</div></div>
          <div class="field"><div class="field-label">Annual Salary:</div><div class="field-value">K ${employeeData.salary}</div></div>
          <div class="field"><div class="field-label">Leave Type:</div><div class="field-value">${request.leave_type}</div></div>
          <div class="field"><div class="field-label">Start Date:</div><div class="field-value">${formatDisplayDate(request.start_date)}</div></div>
          <div class="field"><div class="field-label">End Date:</div><div class="field-value">${formatDisplayDate(request.end_date)}</div></div>
          <div class="field"><div class="field-label">Working Days:</div><div class="field-value">${request.requested_days}</div></div>
          ${request.commuted_days > 0 ? `<div class="field"><div class="field-label">Commuted Days:</div><div class="field-value">${request.commuted_days}</div></div>` : ''}
          <div class="field"><div class="field-label">Address on Leave:</div><div class="field-value">${request.address_on_leave}</div></div>
        </div>

        ${request.supervisor_name ? `
        <div class="section">
          <div class="section-title">PART B - HEAD OF DEPARTMENT / SUPERVISOR</div>
          <div class="field"><div class="field-label">Name:</div><div class="field-value">${request.supervisor_name}</div></div>
          <div class="field"><div class="field-label">Decision:</div><div class="field-value">${request.supervisor_decision}</div></div>
          ${request.supervisor_notes ? `<div class="field"><div class="field-label">Notes:</div><div class="field-value">${request.supervisor_notes}</div></div>` : ''}
          ${request.supervisor_action_date ? `<div class="field"><div class="field-label">Date:</div><div class="field-value">${formatDisplayDate(request.supervisor_action_date)}</div></div>` : ''}
          <div class="signature-line">Signature</div>
        </div>
        ` : ''}

        ${request.hr_name ? `
        <div class="section">
          <div class="section-title">PART C - HR OFFICER</div>
          <div class="field"><div class="field-label">Name:</div><div class="field-value">${request.hr_name}</div></div>
          <div class="field"><div class="field-label">Decision:</div><div class="field-value">${request.hr_decision}</div></div>
          ${request.hr_months_in_service ? `<div class="field"><div class="field-label">Months in Service:</div><div class="field-value">${request.hr_months_in_service}</div></div>` : ''}
          ${request.hr_notes ? `<div class="field"><div class="field-label">Notes:</div><div class="field-value">${request.hr_notes}</div></div>` : ''}
          ${request.hr_action_date ? `<div class="field"><div class="field-label">Date:</div><div class="field-value">${formatDisplayDate(request.hr_action_date)}</div></div>` : ''}
          <div class="signature-line">Signature</div>
        </div>
        ` : ''}

        ${request.ed_name ? `
        <div class="section">
          <div class="section-title">PART D - EXECUTIVE DIRECTOR</div>
          <div class="field"><div class="field-label">Name:</div><div class="field-value">${request.ed_name}</div></div>
          <div class="field"><div class="field-label">Decision:</div><div class="field-value">${request.ed_decision}</div></div>
          ${request.approved_days ? `<div class="field"><div class="field-label">Days Granted:</div><div class="field-value">${request.approved_days}</div></div>` : ''}
          ${request.ed_resume_duty_date ? `<div class="field"><div class="field-label">Resume Duty On:</div><div class="field-value">${formatDisplayDate(request.ed_resume_duty_date)}</div></div>` : ''}
          ${request.ed_notes ? `<div class="field"><div class="field-label">Notes:</div><div class="field-value">${request.ed_notes}</div></div>` : ''}
          ${request.ed_action_date ? `<div class="field"><div class="field-label">Date:</div><div class="field-value">${formatDisplayDate(request.ed_action_date)}</div></div>` : ''}
          <div class="signature-line">Signature</div>
        </div>
        ` : ''}

        <div style="margin-top: 40px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 30px; background: #10B981; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print Document
          </button>
        </div>

        <div style="margin-top: 30px; font-size: 12px; color: #666;">
          <p><strong>Distribution:</strong> Original - Personal File, Copy 1 - Department, Copy 2 - HR, Copy 3 - Employee</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <i className="ri-loader-4-line text-4xl text-emerald-600 animate-spin"></i>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Leave History</h2>
        <div className="flex gap-2">
          {['all', 'Approved', 'Pending Supervisor', 'Pending HR', 'Pending ED', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.leave_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(request.start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(request.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.requested_days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      <i className={`${getStatusIcon(request.status)} mr-1`}></i>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDisplayDate(request.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handlePrint(request)}
                      className="text-emerald-600 hover:text-emerald-900 font-medium"
                    >
                      <i className="ri-printer-line mr-1"></i>
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No leave requests found</p>
        </div>
      )}
    </div>
  )
}

export default LeaveHistory
