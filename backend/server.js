const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/onboarding', require('./routes/onboardingRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/learning-path', require('./routes/roadmapRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PathRecommender AI Learning Path Engine is running' });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = process.env.PORT || 5000;

const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`PathRecommender API Server running on port ${portToUse}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portToUse} is in use, trying port ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  startServer(PORT);
}

module.exports = app;
