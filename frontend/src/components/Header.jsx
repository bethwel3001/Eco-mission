import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = ({ user, onLogout, planetHealth }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [animatedHealth, setAnimatedHealth] = useState(0)
  const location = useLocation()

  useEffect(() => {
    // Animate planet health number
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

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-leaf text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Eco-Mission</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <Link 
              to="/analytics" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/analytics' 
                  ? 'bg-green-50 text-green-700 shadow-sm' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <i className="fas fa-chart-bar text-sm sm:text-base"></i>
              <span className="hidden sm:inline">Analytics</span>
            </Link>

            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/dashboard' 
                  ? 'bg-green-50 text-green-700 shadow-sm' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <i className="fas fa-globe-americas text-sm sm:text-base"></i>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-xs"></i>
                  </div>
                  {/* Small planet health indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-200 shadow-sm">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${getHealthGradient(planetHealth)}`}></div>
                  </div>
                </div>
                <span className="text-gray-700 font-medium hidden sm:block max-w-20 truncate">{user?.name}</span>
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>

                  {/* Planet Health */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 flex items-center">
                        <i className="fas fa-heart mr-2"></i>
                        Planet Health
                      </span>
                      <span className={`text-sm font-bold ${getHealthColor(animatedHealth)} transition-colors duration-500`}>
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

                  {/* Quick Stats */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{user?.points}</p>
                        <p className="text-xs text-gray-500">Eco Points</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{user?.completedMissions?.length || 0}</p>
                        <p className="text-xs text-gray-500">Missions</p>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <i className="fas fa-sign-out-alt text-gray-400 w-5"></i>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  )
}

export default Header