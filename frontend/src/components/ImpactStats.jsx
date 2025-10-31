import React, { useState, useEffect } from 'react'

const ImpactStats = ({ impact }) => {
  const [animatedStats, setAnimatedStats] = useState({
    co2: 0,
    water: 0,
    energy: 0,
    trees: 0
  })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setAnimatedStats({
        co2: Math.round(impact.co2 * progress),
        water: Math.round(impact.water * progress),
        energy: Math.round(impact.energy * progress),
        trees: Math.round((impact.co2 * progress) / 15)
      })

      if (step >= steps) clearInterval(timer)
    }, stepDuration)

    return () => clearInterval(timer)
  }, [impact])

  const stats = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'CO2 Prevented',
      value: animatedStats.co2,
      unit: 'kg',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      label: 'Water Saved',
      value: animatedStats.water,
      unit: 'L',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Energy Saved',
      value: animatedStats.energy,
      unit: 'kWh',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      label: 'Trees Equivalent',
      value: animatedStats.trees,
      unit: 'trees',
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={`${stat.bg} rounded-2xl p-6 border-2 border-white shadow-lg hover-lift transition-all duration-300 animate-fadeIn`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.bg.replace('50', '100')}`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
              <span className="text-sm ml-1">{stat.unit}</span>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{stat.label}</h3>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                stat.label.includes('CO2') ? 'bg-emerald-500' :
                stat.label.includes('Water') ? 'bg-blue-500' :
                stat.label.includes('Energy') ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ 
                width: `${(stat.value / (impact[stat.label.toLowerCase().split(' ')[0]] || 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImpactStats