require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const tipsRoutes = require('./routes/tips');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Initialize database connection
initializeDatabase().catch(console.error);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['*'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/tips', tipsRoutes);

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to JobHUD API',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      tips: '/api/tips',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get user profile
app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profile = profiles[userId] || {
    id: userId,
    displayName: 'New User',
    email: '',
    phone: '',
    location: '',
    headline: 'Professional',
    bio: 'Tell us about yourself...',
  };
  res.json(profile);
});

// Create or update user profile
app.post('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  profiles[userId] = { ...req.body, id: userId };
  res.json(profiles[userId]);
});

// Update user profile (partial update)
app.patch('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  if (!profiles[userId]) {
    profiles[userId] = { id: userId };
  }
  profiles[userId] = { ...profiles[userId], ...req.body };
  res.json(profiles[userId]);
});

// Get network interfaces for better logging
const ifaces = require('os').networkInterfaces();
console.log('\n=== Network Interfaces ===');
Object.keys(ifaces).forEach(ifname => {
  ifaces[ifname].forEach(iface => {
    if ('IPv4' === iface.family && !iface.internal) {
      console.log(`- ${ifname}: ${iface.address}`);
    }
  });
});
console.log('=========================\n');

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Start the server
const server = app.listen(PORT, () => {
  const address = server.address();
  console.log(`\n✅ Server running on port: ${address.port}`);

  console.log('\nAvailable endpoints:');
  console.log(`- GET    /api/health`);
  console.log(`- POST   /api/auth/register`);
  console.log(`- POST   /api/auth/login`);
  console.log(`- GET    /api/profile/me`);
  console.log(`- PATCH  /api/profile/me`);

  console.log('\nℹ️ When testing locally, access: http://localhost:' + address.port);
  console.log('   On Render, use your deployment URL (e.g., https://your-app.onrender.com)');
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
