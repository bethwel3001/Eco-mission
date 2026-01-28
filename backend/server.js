import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eco-mission', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  points: { type: Number, default: 100 },
  planetHealth: { type: Number, default: 75 },
  completedMissions: [String],
  joinedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Mission Schema
const missionSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  points: Number,
  healthBonus: Number,
  difficulty: String,
  category: String,
  co2Saved: Number,
  waterSaved: Number,
  energySaved: Number,
  isActive: Boolean
});

const Mission = mongoose.model('Mission', missionSchema);

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  date: Date,
  missionsCompleted: Number,
  pointsEarned: Number,
  healthChange: Number,
  environmentalImpact: {
    co2Saved: Number,
    waterSaved: Number,
    energySaved: Number
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

const JWT_SECRET = 'eco-mission-secret-key';

// Auth middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      points: 100,
      planetHealth: 75
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        planetHealth: user.planetHealth,
        completedMissions: user.completedMissions
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        planetHealth: user.planetHealth,
        completedMissions: user.completedMissions
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get missions
app.get('/api/missions', auth, async (req, res) => {
  try {
    const missions = await Mission.find({ isActive: true });
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete mission
app.post('/api/missions/:id/complete', auth, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const user = req.user;

    // Check if already completed
    if (user.completedMissions.includes(req.params.id)) {
      return res.status(400).json({ error: 'Mission already completed' });
    }

    // Update user stats
    user.points += mission.points;
    user.planetHealth = Math.min(100, user.planetHealth + mission.healthBonus);
    user.completedMissions.push(req.params.id);

    await user.save();

    // Record analytics
    const analytics = new Analytics({
      userId: user._id,
      date: new Date(),
      missionsCompleted: 1,
      pointsEarned: mission.points,
      healthChange: mission.healthBonus,
      environmentalImpact: {
        co2Saved: mission.co2Saved,
        waterSaved: mission.waterSaved,
        energySaved: mission.energySaved
      }
    });
    await analytics.save();

    res.json({
      points: user.points,
      planetHealth: user.planetHealth,
      missionCompleted: true,
      rewards: {
        points: mission.points,
        health: mission.healthBonus,
        environmentalImpact: {
          co2: mission.co2Saved,
          water: mission.waterSaved,
          energy: mission.energySaved
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user analytics
app.get('/api/analytics', auth, async (req, res) => {
  try {
    const userAnalytics = await Analytics.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    const totalStats = await Analytics.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$pointsEarned' },
          totalCO2: { $sum: '$environmentalImpact.co2Saved' },
          totalWater: { $sum: '$environmentalImpact.waterSaved' },
          totalEnergy: { $sum: '$environmentalImpact.energySaved' },
          totalMissions: { $sum: '$missionsCompleted' }
        }
      }
    ]);

    res.json({
      recent: userAnalytics,
      totals: totalStats[0] || {
        totalPoints: 0,
        totalCO2: 0,
        totalWater: 0,
        totalEnergy: 0,
        totalMissions: 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard
app.get('/api/leaderboard', auth, async (req, res) => {
  try {
    const leaders = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select('name points planetHealth completedMissions');

    res.json(leaders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize sample data
app.post('/api/init-data', async (req, res) => {
  try {
    await Mission.deleteMany({});
    
    const sampleMissions = [
      {
        title: 'Return LPG Cylinder',
        type: 'qr',
        description: 'Scan QR code when returning your empty cylinder to prevent waste',
        points: 100,
        healthBonus: 5,
        difficulty: 'Easy',
        category: 'Recycling',
        co2Saved: 2.5,
        waterSaved: 50,
        energySaved: 15,
        isActive: true
      },
      {
        title: 'Eco Delivery Schedule',
        type: 'delivery',
        description: 'Choose optimized delivery time slot to reduce carbon footprint',
        points: 75,
        healthBonus: 3,
        difficulty: 'Easy',
        category: 'Logistics',
        co2Saved: 1.2,
        waterSaved: 25,
        energySaved: 8,
        isActive: true
      },
      {
        title: 'Energy Safety Quiz',
        type: 'quiz',
        description: 'Complete safety quiz to become an energy safety expert',
        points: 50,
        healthBonus: 2,
        difficulty: 'Medium',
        category: 'Education',
        co2Saved: 0.5,
        waterSaved: 10,
        energySaved: 5,
        isActive: true
      },
      {
        title: 'Refer a Friend',
        type: 'social',
        description: 'Invite friends to join Eco-Mission and connect your planets',
        points: 200,
        healthBonus: 8,
        difficulty: 'Hard',
        category: 'Social',
        co2Saved: 5.0,
        waterSaved: 100,
        energySaved: 30,
        isActive: true
      },
      {
        title: 'Energy Usage Report',
        type: 'report',
        description: 'Submit your weekly energy usage for personalized tips',
        points: 80,
        healthBonus: 4,
        difficulty: 'Medium',
        category: 'Analytics',
        co2Saved: 1.8,
        waterSaved: 35,
        energySaved: 12,
        isActive: true
      }
    ];

    await Mission.insertMany(sampleMissions);
    res.json({ message: 'Sample data initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API running ...',
    timestamp: new Date().toISOString()
  });
});

// Get user profile
app.get('/api/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        points: req.user.points,
        planetHealth: req.user.planetHealth,
        completedMissions: req.user.completedMissions,
        joinedAt: req.user.joinedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connection.on('connected', () => {
  console.log(' Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Initialize data: POST http://localhost:${PORT}/api/init-data`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error(' MongoDB connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n Shutting down server...');
  await mongoose.connection.close();
  console.log(' MongoDB connection closed');
  process.exit(0);
});

export default app;