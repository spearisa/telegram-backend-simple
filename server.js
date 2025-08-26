const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API endpoints
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Telegram Clone Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/v1/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ]
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  res.json({
    message: 'Login endpoint',
    status: 'working'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Telegram Clone Backend',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      users: '/api/v1/users',
      login: '/api/v1/auth/login'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api/v1`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
});

module.exports = app;
