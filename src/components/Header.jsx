import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PortalLoginModal from './PortalLoginModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Departments', path: '/departments' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">BR</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-gray-900">BRRA</div>
                <div className="text-xs text-gray-600">Business Regulatory Review Agency</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden lg:flex items-center space-x-3">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <i className="ri-dashboard-line"></i>
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden lg:flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
                >
                  <i className="ri-login-box-line"></i>
                  <span>Portal Login</span>
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
                >
                  <i className="ri-login-box-line"></i>
                  <span>Portal Login</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <PortalLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}

export default Header
