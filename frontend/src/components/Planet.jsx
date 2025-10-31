import React, { useState, useEffect } from 'react'

const Planet = ({ health, size = 'large', user }) => {
  const [animatedHealth, setAnimatedHealth] = useState(0)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedHealth(health)
    }, 500)
    return () => clearTimeout(timer)
  }, [health])

  useEffect(() => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }))
    setParticles(newParticles)
  }, [])

  const getPlanetState = () => {
    if (animatedHealth >= 80) {
      return {
        gradient: 'from-emerald-400 via-green-500 to-teal-400',
        glow: 'shadow-2xl shadow-green-300/50',
        status: 'Thriving Ecosystem',
        textColor: 'text-emerald-600'
      }
    } else if (animatedHealth >= 60) {
      return {
        gradient: 'from-green-300 via-emerald-400 to-teal-300',
        glow: 'shadow-xl shadow-green-200/30',
        status: 'Healthy Planet',
        textColor: 'text-green-600'
      }
    } else if (animatedHealth >= 40) {
      return {
        gradient: 'from-yellow-400 via-amber-500 to-orange-300',
        glow: 'shadow-lg shadow-yellow-200/20',
        status: 'Needs Care',
        textColor: 'text-amber-600'
      }
    } else {
      return {
        gradient: 'from-red-300 via-orange-400 to-yellow-300',
        glow: 'shadow-lg shadow-red-200/20 animate-pulse',
        status: 'Critical Condition',
        textColor: 'text-red-600'
      }
    }
  }

  const { gradient, glow, status, textColor } = getPlanetState()
  const planetSize = size === 'large' 
    ? 'w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64' 
    : 'w-16 h-16 sm:w-20 sm:h-20'

  return (
    <div className="flex flex-col items-center">
      {/* Planet Visualization */}
      <div className="relative mb-4">
        <div className={`${planetSize} ${glow} rounded-full relative overflow-hidden animate-float`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full`}></div>
          
          <div className="absolute inset-4 bg-green-600 rounded-full opacity-20"></div>
          
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute bg-white/30 rounded-full animate-float"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: '10%',
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            ></div>
          ))}
        </div>

        <div className="absolute -inset-4 border-4 border-transparent rounded-full">
          <div 
            className="w-full h-full rounded-full border-4 border-green-400 border-t-transparent border-r-transparent transition-all duration-1000 ease-out"
            style={{ 
              transform: `rotate(${animatedHealth * 3.6}deg)`,
              opacity: animatedHealth > 30 ? 0.7 : 0.3
            }}
          ></div>
        </div>
      </div>

      {/* Stats Section */}
      {size === 'large' && (
        <div className="w-full max-w-xs">
          {/* Health Status */}
          <div className="glass px-4 py-3 rounded-2xl backdrop-blur-sm mb-4 text-center">
            <p className={`text-sm font-semibold ${textColor} mb-1`}>
              {status}
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    animatedHealth >= 70 ? 'bg-green-500' :
                    animatedHealth >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${animatedHealth}%` }}
                ></div>
              </div>
              <span className={`text-sm font-bold ${textColor} min-w-12`}>
                {Math.round(animatedHealth)}%
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 rounded-xl p-3 text-center border border-white">
              <div className="text-lg font-bold text-green-600">{user?.points || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Eco Points</div>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center border border-white">
              <div className="text-lg font-bold text-blue-600">{user?.completedMissions?.length || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Missions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Planet