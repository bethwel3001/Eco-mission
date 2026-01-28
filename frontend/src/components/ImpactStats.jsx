import { useEffect, useState } from 'react'
import { FaLeaf, FaWater, FaBolt, FaTree } from 'react-icons/fa'

const ANIMATION_DURATION = 1200
const ANIMATION_STEPS = 40
const TREE_CO2_RATIO = 15

const STATS = [
  { key: 'co2', label: 'CO₂ Prevented', unit: 'kg', color: 'text-emerald-600', icon: <FaLeaf className="w-5 h-5" /> },
  { key: 'water', label: 'Water Saved', unit: 'L', color: 'text-blue-600', icon: <FaWater className="w-5 h-5" /> },
  { key: 'energy', label: 'Energy Saved', unit: 'kWh', color: 'text-yellow-600', icon: <FaBolt className="w-5 h-5" /> },
  { key: 'trees', label: 'Tree Equivalent', unit: 'trees', color: 'text-green-700', icon: <FaTree className="w-5 h-5" /> }
]

const ImpactStats = ({ impact }) => {
  const [values, setValues] = useState({
    co2: 0,
    water: 0,
    energy: 0,
    trees: 0
  })

  useEffect(() => {
    let step = 0
    const stepTime = ANIMATION_DURATION / ANIMATION_STEPS

    const interval = setInterval(() => {
      step += 1
      const progress = Math.min(step / ANIMATION_STEPS, 1)

      setValues({
        co2: Math.round(impact.co2 * progress),
        water: Math.round(impact.water * progress),
        energy: Math.round(impact.energy * progress),
        trees: Math.round((impact.co2 * progress) / TREE_CO2_RATIO)
      })

      if (progress === 1) clearInterval(interval)
    }, stepTime)

    return () => clearInterval(interval)
  }, [impact])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS.map((stat, index) => (
        <div
          key={stat.key}
          className={`flex items-center space-x-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:p-5 
                      transform transition duration-500 ease-out animate-fadeIn opacity-0 translate-y-4`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'forwards',
            animationName: 'fadeInUp'
          }}
        >
          {/* Icon */}
          <div className={`p-2 rounded-full bg-gray-100 ${stat.color}`}>
            {stat.icon}
          </div>

          {/* Label + Value */}
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500">{stat.label}</span>
            <div className="flex items-baseline space-x-1">
              <span className={`text-lg sm:text-xl font-semibold ${stat.color}`}>
                {values[stat.key]}
              </span>
              <span className="text-xs sm:text-sm text-gray-400">{stat.unit}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default ImpactStats
