import React, { useState } from 'react'
import { 
  QRIcon, 
  TruckIcon, 
  QuizIcon, 
  UsersIcon, 
  CheckIcon, 
  PlayIcon 
} from '../assets/icons'

const MissionCard = ({ mission, user, onComplete, index }) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const isCompleted = user.completedMissions?.includes(mission._id)

  const handleComplete = async () => {
    if (isCompleted) return

    setIsCompleting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onComplete(mission._id, mission.points, mission.title)
    setIsCompleting(false)
  }

  const getMissionIcon = () => {
    switch (mission.type) {
      case 'qr': return <QRIcon className="w-4 h-4" />
      case 'delivery': return <TruckIcon className="w-4 h-4" />
      case 'quiz': return <QuizIcon className="w-4 h-4" />
      case 'social': return <UsersIcon className="w-4 h-4" />
      default: return <PlayIcon className="w-4 h-4" />
    }
  }

  const getButtonContent = () => {
    if (isCompleting) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="hidden sm:inline">Processing</span>
        </>
      )
    }
    if (isCompleted) {
      return (
        <>
          <CheckIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Done</span>
        </>
      )
    }
    return (
      <>
        <PlayIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Start</span>
      </>
    )
  }

  const getButtonSize = () => {
    return "px-4 py-2.5 sm:px-5 sm:py-3"
  }

  return (
    <div 
      className={`group border-2 ${
        isCompleted 
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
          : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg'
      } rounded-2xl p-5 transition-all duration-300 hover-lift animate-fadeIn`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`${
          isCompleted 
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
            : 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600'
        } w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
          {getMissionIcon()}
        </div>
        <div className="text-right">
          <span className={`${
            isCompleted 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
          } px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300`}>
            +{mission.points}
          </span>
          {mission.healthBonus && (
            <div className="text-xs text-green-600 mt-1 font-medium">
              +{mission.healthBonus}% 🌱
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
        {mission.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {mission.description}
      </p>
      
      {/* QR Mission Special Section */}
      {mission.type === 'qr' && !isCompleted && (
        <div className="mb-4 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <p className="text-xs text-blue-700 mb-2 font-medium">Scan QR Code</p>
          <div className="w-20 h-20 mx-auto bg-white border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center mb-2">
            <QRIcon className="w-6 h-6 text-blue-400" />
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:shadow-md transition-all duration-200 hover:scale-105">
            Simulate Scan
          </button>
        </div>
      )}

      {/* Action Button - Compact and Square-ish */}
      <button 
        onClick={handleComplete}
        disabled={isCompleted || isCompleting}
        className={`w-full ${
          isCompleted 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-default' 
            : isCompleting
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-lg'
        } rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
          isCompleting ? 'min-h-[44px]' : 'min-h-[40px]'
        } active:scale-95`}
      >
        {getButtonContent()}
      </button>

      {/* Environmental Impact Badge */}
      {!isCompleted && (
        <div className="mt-3 flex items-center justify-center">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-2 py-1 rounded-full border border-teal-200">
            <span className="text-xs text-teal-700 font-medium">
              Saves {mission.co2Saved}kg CO₂
            </span>
          </div>
        </div>
      )}

      {/* Celebration Effect for Completed Missions */}
      {isCompleted && (
        <div className="mt-3 flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  )
}

export default MissionCard