import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import Analytics from './components/Analytics'
import Notification from './components/Notification'

function App() {
  const [user, setUser] = useState(null)
  const [planetHealth, setPlanetHealth] = useState(75)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Simulate planet health decay over time (crisis loop)
    if (user) {
      const interval = setInterval(() => {
        setPlanetHealth(prev => {
          const newHealth = Math.max(30, prev - 0.1)
          if (newHealth < 40 && prev >= 40) {
            addNotification({
              type: 'warning',
              title: 'Planet Health Critical!',
              message: 'Your ecosystem needs attention. Complete missions to heal it.',
              duration: 5000
            })
          }
          return newHealth
        })
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  const addNotification = (notification) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const login = (userData) => {
    setUser(userData)
    setPlanetHealth(userData.planetHealth || 75)
    addNotification({
      type: 'success',
      title: 'Welcome to Eco-Mission!',
      message: 'Start completing missions to heal your planet.',
      duration: 3000
    })
  }

  const logout = () => {
    addNotification({
      type: 'info',
      title: 'See you soon!',
      message: 'Your planet will be waiting for your return.',
      duration: 2000
    })
    setTimeout(() => {
      setUser(null)
      setPlanetHealth(75)
    }, 2000)
  }

  const completeMission = (missionId, points, missionName) => {
    const healthBoost = points / 20
    const oldHealth = planetHealth
    const newHealth = Math.min(100, planetHealth + healthBoost)
    
    setPlanetHealth(newHealth)
    
    setUser(prev => ({
      ...prev,
      points: prev.points + points,
      completedMissions: [...(prev.completedMissions || []), missionId]
    }))

    // Show notification
    addNotification({
      type: 'success',
      title: 'Mission Complete!',
      message: `+${points} points from ${missionName}`,
      duration: 3000
    })

    // Show level up notification
    if (Math.floor(oldHealth / 10) < Math.floor(newHealth / 10)) {
      addNotification({
        type: 'celebration',
        title: 'Level Up!',
        message: `Your planet health reached ${Math.floor(newHealth/10)*10}%!`,
        duration: 4000
      })
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
        {/* Notifications Container */}
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full sm:w-auto">
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>

        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginPage onLogin={login} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? (
              <DashboardPage 
                user={user} 
                onLogout={logout} 
                planetHealth={planetHealth}
                onCompleteMission={completeMission}
              />
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/analytics" 
            element={user ? (
              <Analytics 
                user={user} 
                onLogout={logout} 
                planetHealth={planetHealth}
              />
            ) : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App