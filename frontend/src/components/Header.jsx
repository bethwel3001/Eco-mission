import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LeafIcon, 
  PlanetIcon, 
  UserIcon, 
  LogoutIcon,
  CheckIcon
} from '../assets/icons'

const Header = ({ user, onLogout, planetHealth }) => {
  const [showUserModal, setShowUserModal] = useState(false)
  const [animatedHealth, setAnimatedHealth] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHealth(planetHealth)
    }, 300)
    return () => clearTimeout(timer)
  }, [planetHealth])

  const getHealthColor = (health) => {
    if (health >= 70) return 'text-green-500'
    if (health >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getHealthGradient = (health) => {
    if (health >= 70) return 'from-green-400 to-emerald-500'
    if (health >= 50) return 'from-yellow-400 to-amber-500'
    return 'from-red-400 to-orange-500'
  }

  const closeModal = () => {
    setShowUserModal(false)
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserModal && !event.target.closest('.user-modal-content')) {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserModal])

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Eco-Mission</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-4 sm:space-x-6">
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === '/dashboard' 
                    ? 'bg-green-50 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <PlanetIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* User Menu Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    {/* Small planet health indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-200 shadow-sm">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${getHealthGradient(planetHealth)}`}></div>
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium hidden sm:block max-w-20 truncate">Be Tu</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* User Modal Overlay */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          />
          
          {/* Modal Content - Smaller and Centered */}
          <div className="user-modal-content relative bg-white rounded-xl shadow-xl w-full max-w-sm transform transition-all duration-300">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform duration-200 z-10"
            >
              <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header - Compact */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-xl p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold truncate">Be Tu</h2>
                  <p className="text-green-100 text-xs truncate">betu@nextspace.com</p>
                </div>
              </div>
            </div>

            {/* Modal Body - Compact */}
            <div className="p-4 space-y-4">
              {/* Planet Health Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm flex items-center">
                    <PlanetIcon className="w-4 h-4 mr-2 text-green-600" />
                    Planet Health
                  </h3>
                  <span className={`text-base font-bold ${getHealthColor(animatedHealth)}`}>
                    {Math.round(animatedHealth)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getHealthGradient(planetHealth)} transition-all duration-1000 ease-out`}
                    style={{ width: `${animatedHealth}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid - Compact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 text-center border border-blue-200">
                  <div className="text-xl font-bold text-blue-600">{user?.points || 0}</div>
                  <div className="text-xs text-blue-700 font-medium">Eco Points</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 text-center border border-purple-200">
                  <div className="text-xl font-bold text-purple-600">{user?.completedMissions?.length || 0}</div>
                  <div className="text-xs text-purple-700 font-medium">Missions</div>
                </div>
              </div>

              {/* Achievements - Compact */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center">
                  <CheckIcon className="w-4 h-4 mr-2 text-amber-600" />
                  Achievements
                </h3>
                <div className="space-y-1">
                  {user?.completedMissions?.length > 0 ? (
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{user.completedMissions.length} missions done</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600">Start your first mission!</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Eco Warrior</span>
                  </div>
                </div>
              </div>

              {/* Smaller Logout Button */}
              <button
                onClick={() => {
                  closeModal()
                  onLogout()
                }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-md transition-all duration-200 text-sm"
              >
                <LogoutIcon className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header