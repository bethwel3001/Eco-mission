import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Planet from '../components/Planet'
import MissionCard from '../components/MissionCard'
import ImpactStats from '../components/ImpactStats'

const Dashboard = ({ user, onLogout, planetHealth, onCompleteMission }) => {
  const [missions, setMissions] = useState([])
  const [totalImpact, setTotalImpact] = useState({
    co2: 124,
    water: 3400,
    energy: 890
  })
  const [showImpact, setShowImpact] = useState(false)

  /* -------------------- Sample Missions -------------------- */
  useEffect(() => {
    setMissions([
      {
        _id: '1',
        title: 'Return LPG Cylinder',
        type: 'qr',
        description: 'Scan QR code when returning your empty cylinder to prevent waste',
        points: 100,
        healthBonus: 5,
        difficulty: 'Easy',
        category: 'Recycling',
        co2Saved: 2.5,
        waterSaved: 50,
        energySaved: 15
      },
      {
        _id: '2',
        title: 'Eco Delivery Schedule',
        type: 'delivery',
        description: 'Choose optimized delivery time slot to reduce carbon footprint',
        points: 75,
        healthBonus: 3,
        difficulty: 'Easy',
        category: 'Logistics',
        co2Saved: 1.2,
        waterSaved: 25,
        energySaved: 8
      },
      {
        _id: '3',
        title: 'Energy Safety Quiz',
        type: 'quiz',
        description: 'Complete safety quiz to become an energy safety expert',
        points: 50,
        healthBonus: 2,
        difficulty: 'Medium',
        category: 'Education',
        co2Saved: 0.5,
        waterSaved: 10,
        energySaved: 5
      },
      {
        _id: '4',
        title: 'Refer a Friend',
        type: 'social',
        description: 'Invite friends to join Eco-Mission and connect your planets',
        points: 200,
        healthBonus: 8,
        difficulty: 'Hard',
        category: 'Social',
        co2Saved: 5.0,
        waterSaved: 100,
        energySaved: 30
      }
    ])
  }, [])

  /* -------------------- Scroll Reveal Impact -------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowImpact(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    const section = document.getElementById('impact-section')
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  /* -------------------- Mission Completion -------------------- */
  const handleCompleteMission = (missionId, points, missionName) => {
    const mission = missions.find(m => m._id === missionId)
    if (mission) {
      setTotalImpact(prev => ({
        co2: prev.co2 + mission.co2Saved,
        water: prev.water + mission.waterSaved,
        energy: prev.energy + mission.energySaved
      }))
    }

    onCompleteMission(missionId, points, missionName)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      <Header user={user} onLogout={onLogout} planetHealth={planetHealth} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* -------------------- HERO -------------------- */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-24">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Heal Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">
                Planet
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Every sustainable choice brings your virtual ecosystem back to life.
              Complete missions, earn rewards, and watch your planet thrive.
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <Planet health={planetHealth} size="large" user={user} />
          </div>
        </section>

        {/* -------------------- IMPACT (SCROLL REVEAL) -------------------- */}
        <section
          id="impact-section"
          className={`mb-20 transition-all duration-700 ease-out ${
            showImpact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          {showImpact && (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Your Environmental Impact
              </h2>
              <ImpactStats impact={totalImpact} />
            </>
          )}
        </section>

        {/* -------------------- MISSIONS -------------------- */}
        <section className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Eco-Missions
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Complete missions to heal your planet and earn rewards
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {user?.completedMissions?.length || 0}/{missions.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Completed</div>
              </div>

              <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-teal-400 h-2 sm:h-3 rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      ((user?.completedMissions?.length || 0) / missions.length) * 100
                    }%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {missions.map((mission, index) => (
              <MissionCard
                key={mission._id}
                mission={mission}
                user={user}
                index={index}
                onComplete={handleCompleteMission}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
