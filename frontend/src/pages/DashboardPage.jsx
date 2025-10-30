import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Planet from '../components/Planet'
import MissionCard from '../components/MissionCard'

const DashboardPage = ({ user, onLogout, planetHealth, onCompleteMission }) => {
  const [missions, setMissions] = useState([])
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)

  useEffect(() => {
    // Load missions
    const loadedMissions = [
      {
        id: 1,
        type: 'qr',
        title: 'Return LPG Cylinder',
        description: 'Scan QR code when returning your empty cylinder to prevent waste',
        points: 100,
        healthBonus: 5
      },
      {
        id: 2,
        type: 'delivery',
        title: 'Eco-Delivery Schedule',
        description: 'Choose optimized delivery time slot to reduce carbon footprint',
        points: 50,
        healthBonus: 3
      },
      {
        id: 3,
        type: 'quiz',
        title: 'LPG Safety Champion',
        description: 'Complete safety quiz to become an energy safety expert',
        points: 75,
        healthBonus: 2,
        quizQuestions: [
          {
            question: "What should you do if you smell gas?",
            options: ["Open windows and doors", "Turn on electrical switches", "Light a match to check"]
          },
          {
            question: "How should LPG cylinders be stored?",
            options: ["Upright position", "On their side", "In direct sunlight"]
          }
        ]
      },
      {
        id: 4,
        type: 'social',
        title: 'Refer a Friend',
        description: 'Invite friends to join Eco-Mission and connect your planets',
        points: 200,
        healthBonus: 8,
        socialReward: true
      }
    ]
    setMissions(loadedMissions)
  }, [])

  useEffect(() => {
    // Show crisis alert when planet health is low
    if (planetHealth < 40) {
      setShowCrisisAlert(true)
    }
  }, [planetHealth])

  const handleCompleteMission = (missionId, points) => {
    onCompleteMission(missionId, points)
    
    // Show celebration for significant health improvements
    if (planetHealth < 50 && (planetHealth + points/20) >= 50) {
      // Planet recovered from crisis
      setShowCrisisAlert(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Crisis Alert */}
        {showCrisisAlert && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl animate-pulse">
            <div className="flex items-center space-x-3">
              <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
              <div>
                <h3 className="font-bold text-red-800">Planet in Crisis!</h3>
                <p className="text-red-700 text-sm">Complete missions to heal your ecosystem and remove pollution.</p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section with Planet */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.name}! 🌍
            </h1>
            <p className="text-gray-600 mt-2">
              {planetHealth >= 70 
                ? "Your planet is thriving! Keep up the great work." 
                : planetHealth >= 50 
                ? "Your planet needs attention. Complete missions to help it thrive."
                : "Your planet is in danger! Complete missions urgently to heal it."
              }
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <p className="text-sm font-medium text-gray-600">Eco Points</p>
                <p className="text-2xl font-bold text-green-600">{user?.points}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <p className="text-sm font-medium text-gray-600">Missions Done</p>
                <p className="text-2xl font-bold text-blue-600">{user?.completedMissions?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <Planet health={planetHealth} size="large" />
          </div>
        </div>

        {/* Missions Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Eco-Missions</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Completed: {user?.completedMissions?.length || 0}/{missions.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${((user?.completedMissions?.length || 0) / missions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                user={user}
                planetHealth={planetHealth}
                onComplete={handleCompleteMission}
              />
            ))}
          </div>
        </div>

        {/* Progress Celebration */}
        {planetHealth > 85 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-white text-center">
            <i className="fas fa-trophy text-2xl mb-2"></i>
            <h3 className="font-bold">Planet Guardian Achieved!</h3>
            <p className="text-sm opacity-90">Your ecosystem is thriving thanks to your sustainable choices!</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage