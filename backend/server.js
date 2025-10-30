import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Mock database for MVP - replace with MongoDB in production
let planetState = {
  health: 75,
  cleanliness: 60,
  lastUpdated: new Date()
}

// Routes
app.post('/api/missions/complete', (req, res) => {
  const { missionId } = req.body
  
  // Simulate planet improvement based on mission
  planetState.health = Math.min(100, planetState.health + 10)
  planetState.cleanliness = Math.min(100, planetState.cleanliness + 15)
  planetState.lastUpdated = new Date()

  res.json({
    success: true,
    planet: planetState,
    pointsEarned: 100
  })
})

app.get('/api/user/planet', (req, res) => {
  res.json(planetState)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})