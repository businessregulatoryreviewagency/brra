import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const PortalLoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { signIn, signUp } = useAuth()

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [registerForm, setRegisterForm] = useState({
    agencyName: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const { error } = await signIn(loginForm.email, loginForm.password)

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    } else {
      setMessage({ type: 'success', text: 'Login successful!' })
      setTimeout(() => {
        onClose()
        window.location.href = '/dashboard'
      }, 1000)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      setLoading(false)
      return
    }

    const { error } = await signUp(registerForm.email, registerForm.password, {
      agency_name: registerForm.agencyName,
      full_name: registerForm.fullName,
      phone: registerForm.phone
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setLoading(false)
    } else {
      setMessage({ type: 'success', text: 'Registration successful! Please check your email to verify your account.' })
      setLoading(false)
      setRegisterForm({
        agencyName: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Portal Access</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {
                setActiveTab('login')
                setMessage({ type: '', text: '' })
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab('register')
                setMessage({ type: '', text: '' })
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="your.email@agency.gov.zm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency Name
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.agencyName}
                  onChange={(e) => setRegisterForm({ ...registerForm, agencyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="Your Agency Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="your.email@agency.gov.zm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="+260 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Creating account...
                  </span>
                ) : (
                  'Request Access'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to BRRA's terms of service and privacy policy
              </p>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">Need help?</p>
            <div className="flex gap-3">
              <a
                href="tel:+260211259165"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                <i className="ri-phone-line"></i>
                Call Support
              </a>
              <a
                href="mailto:info@brra.org.zm"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                <i className="ri-mail-line"></i>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortalLoginModal
