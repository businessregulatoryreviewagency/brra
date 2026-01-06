import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Departments from './pages/Departments'
import Services from './pages/Services'
import News from './pages/News'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import StaffDashboard from './pages/StaffDashboard'
import UserDashboard from './pages/UserDashboard'
import LeaveManagement from './pages/LeaveManagement'
import RoleBasedRoute from './components/RoleBasedRoute'
import { useAuth } from './contexts/AuthContext'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/services" element={<Services />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                <StaffDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <RoleBasedRoute allowedRoles={['admin', 'staff', 'user']}>
                <UserDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/leave-management"
            element={
              <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                <LeaveManagement />
              </RoleBasedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function DashboardRouter() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line text-4xl text-emerald-600 animate-spin"></i>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-4 bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-3xl text-red-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            Your user profile could not be loaded. This may be because:
          </p>
          <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li>• The database hasn't been set up yet</li>
            <li>• Your profile wasn't created during registration</li>
            <li>• There's a database connection issue</li>
          </ul>
          <p className="text-sm text-gray-500 mb-4">
            <strong>Email:</strong> {user.email}
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!profile.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-4 bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-time-line text-3xl text-amber-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
          <p className="text-gray-600 mb-6">
            Your account is awaiting administrator approval. You'll be notified once approved.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            <strong>Email:</strong> {user.email}
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  if (profile.role === 'admin') {
    return <Navigate to="/admin" replace />
  } else if (profile.role === 'staff') {
    return <Navigate to="/staff" replace />
  } else {
    return <Navigate to="/user" replace />
  }
}

export default App
