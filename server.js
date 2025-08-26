const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage (no database required)
const users = new Map();
const messages = [];
let messageId = 1;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    users: users.size,
    messages: messages.length
  });
});

// API endpoints
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Telegram Clone Backend API',
    version: '1.0.0',
    status: 'running',
    features: ['authentication', 'messaging', 'users', 'health']
  });
});

// User registration
app.post('/api/v1/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (users.has(email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const user = {
    id: Date.now().toString(),
    username,
    email,
    password: password, // In production, hash this!
    createdAt: new Date().toISOString()
  };
  
  users.set(email, user);
  
  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// User login
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  
  const user = users.get(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    message: 'Login successful',
    user: { id: user.id, username: user.username, email: user.email },
    token: `fake-jwt-token-${user.id}` // In production, use real JWT
  });
});

// Get users
app.get('/api/v1/users', (req, res) => {
  const userList = Array.from(users.values()).map(user => ({
    id: user.id,
    username: user.username,
    email: user.email
  }));
  
  res.json({ users: userList });
});

// Send message
app.post('/api/v1/messages', (req, res) => {
  const { senderId, receiverId, content } = req.body;
  
  if (!senderId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const message = {
    id: messageId++,
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString()
  };
  
  messages.push(message);
  
  res.status(201).json({
    message: 'Message sent successfully',
    message: message
  });
});

// Get messages
app.get('/api/v1/messages', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }
  
  const userMessages = messages.filter(msg => 
    msg.senderId === userId || msg.receiverId === userId
  );
  
  res.json({ messages: userMessages });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Telegram Clone Backend',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      users: 'GET /api/v1/users',
      sendMessage: 'POST /api/v1/messages',
      getMessages: 'GET /api/v1/messages'
    },
    stats: {
      users: users.size,
      messages: messages.length
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api/v1`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(`👥 Users: ${users.size}`);
  console.log(`💬 Messages: ${messages.length}`);
});

module.exports = app;
