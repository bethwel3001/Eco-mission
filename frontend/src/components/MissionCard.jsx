import React, { useState, useEffect } from 'react'
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
  const [showScanModal, setShowScanModal] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const isCompleted = user.completedMissions?.includes(mission._id)

  /* -------------------- Lock Background Scroll -------------------- */
  useEffect(() => {
    document.body.style.overflow = showScanModal ? 'hidden' : ''
  }, [showScanModal])

  /* -------------------- Complete Mission -------------------- */
  const handleComplete = async () => {
    if (isCompleted) return
    setIsCompleting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onComplete(mission._id, mission.points, mission.title)
    setIsCompleting(false)
  }

  /* -------------------- Simulate QR Scan -------------------- */
  const handleSimulateScan = () => {
    setIsScanning(true)
    setShowScanModal(true)

    setTimeout(() => {
      setIsScanning(false)
    }, 2000)
  }

  /* -------------------- Icons -------------------- */
  const getMissionIcon = () => {
    switch (mission.type) {
      case 'qr': return <QRIcon className="w-4 h-4" />
      case 'delivery': return <TruckIcon className="w-4 h-4" />
      case 'quiz': return <QuizIcon className="w-4 h-4" />
      case 'social': return <UsersIcon className="w-4 h-4" />
      default: return <PlayIcon className="w-4 h-4" />
    }
  }

  const getActionIcon = () => {
    if (isCompleting) {
      return (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )
    }
    if (isCompleted) return <CheckIcon className="w-4 h-4" />
    return <PlayIcon className="w-4 h-4" />
  }

  return (
    <>
      {/* -------------------- MISSION CARD -------------------- */}
      <div
        className={`border-2 rounded-2xl p-5 transition-all duration-300 animate-fadeIn ${
          isCompleted
            ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
            : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg'
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {getMissionIcon()}
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
              isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-700'
            }`}
          >
            +{mission.points}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-bold text-gray-900 text-lg mb-2">
          {mission.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {mission.description}
        </p>

        {/* QR Scan Section */}
        {mission.type === 'qr' && !isCompleted && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <p className="text-xs text-blue-700 mb-2 font-medium">
              Scan QR Code
            </p>

            <div className="relative w-20 h-20 mx-auto bg-white border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center overflow-hidden">
              <QRIcon className="w-6 h-6 text-blue-400 z-10" />
              {isScanning && (
                <div className="absolute inset-0 bg-blue-400/20 animate-scan" />
              )}
            </div>

            <button
              onClick={handleSimulateScan}
              className="mt-3 text-xs px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Simulate Scan
            </button>
          </div>
        )}

        {/* Action Button (Compact & Square) */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleComplete}
            disabled={isCompleted || isCompleting}
            className={`w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2
              rounded-xl flex items-center justify-center gap-2
              font-semibold transition active:scale-95
              ${
                isCompleted
                  ? 'bg-green-500 text-white cursor-default'
                  : isCompleting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
          >
            {getActionIcon()}
            <span className="hidden sm:inline text-sm">
              {isCompleted ? 'Done' : 'Start'}
            </span>
          </button>
        </div>

        {/* Impact Badge */}
        {!isCompleted && (
          <div className="mt-3 flex justify-center">
            <span className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded-full">
              Saves {mission.co2Saved}kg CO₂
            </span>
          </div>
        )}

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="mt-3 flex justify-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
          </div>
        )}
      </div>

      {/* -------------------- SCAN MODAL -------------------- */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay (no blur) */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowScanModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center animate-fadeIn">
            <button
              onClick={() => setShowScanModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {isScanning ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <h3 className="font-semibold text-gray-900">
                  Scanning...
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Aligning QR code
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl mb-3">🚧</div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-sm text-gray-600">
                  QR scanning will be available in a future update.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default MissionCard
