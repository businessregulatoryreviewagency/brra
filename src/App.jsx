import { Routes, Route, Navigate } from 'react-router-dom'
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
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line text-4xl text-emerald-600 animate-spin"></i>
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/" replace />
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
