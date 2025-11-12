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
const HOST = '192.168.12.121'; 

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
const server = app.listen(PORT, HOST, () => {
  const address = server.address();
  console.log(`\nServer running on:`);
  console.log(`- Local:            http://localhost:${address.port}`);
  console.log(`- On Your Network:  http://${Object.values(ifaces)
    .flat()
    .find(iface => iface.family === 'IPv4' && !iface.internal)?.address || 'YOUR_LOCAL_IP'}:${address.port}`);
  
  console.log('\nAvailable endpoints:');
  console.log(`- GET    http://localhost:${address.port}/api/health`);
  console.log(`- POST   http://localhost:${address.port}/api/auth/register`);
  console.log(`- POST   http://localhost:${address.port}/api/auth/login`);
  console.log(`- GET    http://localhost:${address.port}/api/profile/me`);
  console.log(`- PATCH  http://localhost:${address.port}/api/profile/me`);
  console.log('\nMake sure to replace localhost with your local IP when connecting from other devices!');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
