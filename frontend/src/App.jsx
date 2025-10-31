import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Notification from './components/Notification'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null)
  const [planetHealth, setPlanetHealth] = useState(75)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setPlanetHealth(userData.planetHealth || 75)
    }
  }, [])

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
    localStorage.setItem('user', JSON.stringify(userData))
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
      localStorage.removeItem('user')
    }, 2000)
  }

  const completeMission = (missionId, points, missionName) => {
    const healthBoost = points / 20
    const newHealth = Math.min(100, planetHealth + healthBoost)
    const newPoints = user.points + points
    
    setPlanetHealth(newHealth)
    setUser(prev => ({
      ...prev,
      points: newPoints,
      completedMissions: [...(prev.completedMissions || []), missionId]
    }))

    const updatedUser = {
      ...user,
      points: newPoints,
      completedMissions: [...(user.completedMissions || []), missionId],
      planetHealth: newHealth
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))

    addNotification({
      type: 'success',
      title: 'Mission Complete!',
      message: `+${points} points from ${missionName}`,
      duration: 3000
    })
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex flex-col">
        {/* Fixed Notification Container */}
        <div className="fixed top-20 right-4 z-50 space-y-2 w-full max-w-sm">
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

        <div className="flex-1">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={login} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? (
                <Dashboard 
                  user={user} 
                  onLogout={logout} 
                  planetHealth={planetHealth}
                  onCompleteMission={completeMission}
                />
              ) : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>

        {/* Footer - only show on dashboard */}
        {user && <Footer />}
      </div>
    </Router>
  )
}

export default App