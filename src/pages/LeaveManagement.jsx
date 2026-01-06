import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LeaveDashboard from '../components/leave/LeaveDashboard'
import LeaveForm from '../components/leave/LeaveForm'
import LocalLeaveForm from '../components/leave/LocalLeaveForm'
import LeaveHistory from '../components/leave/LeaveHistory'
import LeaveApprovals from '../components/leave/LeaveApprovals'

const LeaveManagement = () => {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedLeaveType, setSelectedLeaveType] = useState(null)

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'apply', name: 'Apply for Leave', icon: 'ri-file-add-line' },
    { id: 'history', name: 'Leave History', icon: 'ri-history-line' },
    { id: 'approvals', name: 'Approvals', icon: 'ri-checkbox-line', requiresApprover: true },
  ]

  const canApprove = profile?.is_supervisor || profile?.is_hr || profile?.is_ed || profile?.role === 'admin'

  const renderContent = () => {
    if (activeTab === 'apply') {
      if (!selectedLeaveType) {
        return (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Leave Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setSelectedLeaveType('annual')}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-emerald-600 hover:shadow-lg transition-all text-left group"
              >
                <i className="ri-calendar-line text-4xl text-emerald-600 mb-4 group-hover:scale-110 transition-transform"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Annual Leave</h3>
                <p className="text-gray-600 text-sm">
                  Planned vacation, extended absences. Requires 3-tier approval (Supervisor → HR → ED)
                </p>
              </button>

              <button
                onClick={() => setSelectedLeaveType('local')}
                className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition-all text-left group"
              >
                <i className="ri-map-pin-line text-4xl text-blue-600 mb-4 group-hover:scale-110 transition-transform"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Local/Casual Leave</h3>
                <p className="text-gray-600 text-sm">
                  Short-term leave within station. Simplified approval process (ED or Head of Department)
                </p>
              </button>
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">
                <i className="ri-information-line mr-2"></i>
                <strong>Note:</strong> Other leave types (Sick, Maternity, Paternity, Compassionate, Study, Commutation) 
                use the Annual Leave form with appropriate selection.
              </p>
            </div>
          </div>
        )
      }

      if (selectedLeaveType === 'annual') {
        return (
          <div>
            <button
              onClick={() => setSelectedLeaveType(null)}
              className="mb-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Leave Type Selection
            </button>
            <LeaveForm onSuccess={() => {
              setSelectedLeaveType(null)
              setActiveTab('history')
            }} />
          </div>
        )
      }

      if (selectedLeaveType === 'local') {
        return (
          <div>
            <button
              onClick={() => setSelectedLeaveType(null)}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Leave Type Selection
            </button>
            <LocalLeaveForm onSuccess={() => {
              setSelectedLeaveType(null)
              setActiveTab('history')
            }} />
          </div>
        )
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <LeaveDashboard onNavigate={setActiveTab} />
      case 'history':
        return <LeaveHistory />
      case 'approvals':
        return <LeaveApprovals />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Leave Management System</h1>
          <p className="text-emerald-100">Manage your leave requests and approvals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                if (tab.requiresApprover && !canApprove) return null
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      if (tab.id !== 'apply') setSelectedLeaveType(null)
                    }}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={tab.icon}></i>
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}

export default LeaveManagement
