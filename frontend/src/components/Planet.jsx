import React, { useState, useEffect } from 'react'

const Planet = ({ health, size = 'large' }) => {
  const [animatedHealth, setAnimatedHealth] = useState(0)
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    // Animate health number
    const timer = setTimeout(() => {
      setAnimatedHealth(health)
    }, 500)

    // Pulse animation for low health
    setIsPulsing(health < 40)
    
    return () => clearTimeout(timer)
  }, [health])

  const getPlanetAppearance = () => {
    if (animatedHealth >= 80) {
      return {
        gradient: 'from-green-400 via-emerald-500 to-teal-400',
        features: '🌿 🏝️ 🌸',
        status: 'Thriving!',
        shadow: 'shadow-2xl shadow-green-200'
      }
    } else if (animatedHealth >= 60) {
      return {
        gradient: 'from-green-300 via-emerald-400 to-teal-300',
        features: '🌿 🏝️',
        status: 'Healthy',
        shadow: 'shadow-xl shadow-green-100'
      }
    } else if (animatedHealth >= 40) {
      return {
        gradient: 'from-yellow-400 via-amber-500 to-orange-300',
        features: '🍂 🏜️',
        status: 'Needs Care',
        shadow: 'shadow-lg shadow-yellow-100'
      }
    } else {
      return {
        gradient: 'from-red-300 via-orange-400 to-yellow-300',
        features: '💨 🏭',
        status: 'Critical!',
        shadow: 'shadow-lg shadow-red-100'
      }
    }
  }

  const { gradient, features, status, shadow } = getPlanetAppearance()
  const planetSize = size === 'large' ? 'w-48 h-48 sm:w-64 sm:h-64' : 'w-16 h-16 sm:w-20 sm:h-20'

  return (
    <div className="relative">
      <div className={`${planetSize} bg-gradient-to-br ${gradient} ${shadow} rounded-full planet-health flex items-center justify-center relative overflow-hidden transition-all duration-1000 ease-out ${
        isPulsing ? 'animate-pulse' : 'hover:scale-105'
      }`}>
        
        {/* Animated features based on health */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-2xl sm:text-3xl opacity-70 animate-float">
            {features}
          </div>
        </div>

        {/* Planet core with shimmer */}
        <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-shimmer"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                top: `${20 + i * 25}%`,
                left: `${15 + i * 30}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Status display for large planets */}
        {size === 'large' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-500">
            {status} • {Math.round(animatedHealth)}%
          </div>
        )}
      </div>

      {/* Crisis indicators for low health */}
      {animatedHealth < 40 && (
        <div className="absolute inset-0 animate-ping">
          <div className="w-full h-full bg-red-500/10 rounded-full"></div>
        </div>
      )}
    </div>
  )
}

export default Planet