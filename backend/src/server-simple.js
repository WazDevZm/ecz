// Simplified backend server that works without MongoDB
// Perfect for demo and development

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5174',
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Mock data
const mockData = {
  overview: {
    totalMentions: 15847,
    sentiment: { positive: '45.2', negative: '28.7', neutral: '26.1' },
    trendingHashtags: [
      { tag: 'zambiadecides', count: 3421 },
      { tag: 'elections2026', count: 2876 }
    ],
    mostDiscussedParty: {
      name: 'UPND',
      abbreviation: 'UPND',
      color: '#dc2626'
    }
  },
  parties: [
    { _id: '1', name: 'UPND', abbreviation: 'UPND', color: '#dc2626', leader: 'Hakainde Hichilema' },
    { _id: '2', name: 'PF', abbreviation: 'PF', color: '#16a34a', leader: 'Edgar Lungu' },
    { _id: '3', name: 'SP', abbreviation: 'SP', color: '#f59e0b', leader: "Fred M'membe" },
    { _id: '4', name: 'UKA', abbreviation: 'UKA', color: '#3b82f6', leader: 'Various' }
  ]
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running!' 
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    success: true,
    token: 'demo-token-' + Date.now(),
    user: {
      id: '1',
      name: 'Demo User',
      email: email,
      role: 'admin'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email } = req.body;
  res.json({
    success: true,
    token: 'demo-token-' + Date.now(),
    user: {
      id: '1',
      name: name,
      email: email,
      role: 'viewer'
    }
  });
});

// Dashboard routes
app.get('/api/dashboard/overview', (req, res) => {
  res.json({ success: true, data: mockData.overview });
});

app.get('/api/dashboard/sentiment-trends', (req, res) => {
  const trends = Array.from({ length: 7 }, (_, i) => ({
    time: i + 1,
    sentiment: 'positive',
    count: Math.floor(Math.random() * 200) + 100,
    avgScore: (Math.random() * 0.5 + 0.5).toFixed(2)
  }));
  res.json({ success: true, data: trends });
});

app.get('/api/dashboard/party-comparison', (req, res) => {
  const comparison = mockData.parties.map(party => ({
    party: { id: party._id, name: party.name, abbreviation: party.abbreviation, color: party.color },
    mentions: Math.floor(Math.random() * 5000) + 1000,
    engagement: Math.floor(Math.random() * 10000) + 2000,
    sentiment: {
      positive: (Math.random() * 30 + 35).toFixed(1),
      negative: (Math.random() * 20 + 20).toFixed(1),
      neutral: (Math.random() * 15 + 20).toFixed(1),
      netScore: (Math.random() * 30).toFixed(1)
    }
  }));
  res.json({ success: true, data: comparison });
});

app.get('/api/dashboard/candidate-leaderboard', (req, res) => {
  const candidates = [
    { id: '1', name: 'Hakainde Hichilema', party: mockData.parties[0] },
    { id: '2', name: 'Edgar Lungu', party: mockData.parties[1] },
    { id: '3', name: "Fred M'membe", party: mockData.parties[2] }
  ];
  
  const leaderboard = candidates.map(c => ({
    candidate: {
      id: c.id,
      name: c.name,
      photo: null,
      party: { name: c.party.name, abbreviation: c.party.abbreviation, color: c.party.color }
    },
    mentions: Math.floor(Math.random() * 3000) + 1000,
    positivePercent: (Math.random() * 30 + 35).toFixed(1),
    negativePercent: (Math.random() * 20 + 20).toFixed(1),
    netSentiment: (Math.random() * 30).toFixed(1)
  }));
  
  res.json({ success: true, data: leaderboard });
});

app.get('/api/dashboard/word-cloud', (req, res) => {
  const hashtags = [
    'zambiadecides', 'elections2026', 'economy', 'jobs', 'youth',
    'education', 'health', 'corruption', 'infrastructure', 'democracy'
  ].map(tag => ({ text: tag, value: Math.floor(Math.random() * 3000) + 500 }));
  
  const topics = [
    'economy', 'jobs', 'education', 'health', 'corruption',
    'infrastructure', 'agriculture', 'youth'
  ].map(topic => ({ text: topic, value: Math.floor(Math.random() * 4000) + 1000 }));
  
  res.json({ success: true, data: { hashtags, topics } });
});

app.get('/api/dashboard/recent-posts', (req, res) => {
  const posts = Array.from({ length: 10 }, (_, i) => ({
    _id: `post-${i}`,
    content: `Sample political discussion post #${i + 1}`,
    source: ['twitter', 'facebook', 'news'][Math.floor(Math.random() * 3)],
    sentiment: {
      label: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
      score: (Math.random() * 2 - 1).toFixed(2)
    },
    publishedAt: new Date(Date.now() - i * 300000).toISOString(),
    author: { username: `user_${Math.floor(Math.random() * 1000)}` }
  }));
  
  res.json({ success: true, data: posts });
});

// Parties routes
app.get('/api/parties', (req, res) => {
  res.json({ success: true, data: mockData.parties });
});

// Candidates routes
app.get('/api/candidates', (req, res) => {
  const candidates = [
    { _id: '1', name: 'Hakainde Hichilema', party: mockData.parties[0], position: 'president' },
    { _id: '2', name: 'Edgar Lungu', party: mockData.parties[1], position: 'president' },
    { _id: '3', name: "Fred M'membe", party: mockData.parties[2], position: 'president' }
  ];
  res.json({ success: true, data: candidates });
});

// Provinces routes
app.get('/api/provinces/analytics', (req, res) => {
  const provinces = [
    'Lusaka', 'Copperbelt', 'Southern', 'Eastern', 'Northern',
    'Luapula', 'North-Western', 'Western', 'Central', 'Muchinga'
  ].map(name => ({
    _id: name,
    totalMentions: Math.floor(Math.random() * 4000) + 500,
    avgSentiment: (Math.random() * 0.4 - 0.1).toFixed(2)
  }));
  
  res.json({ success: true, data: provinces });
});

// Alerts routes
app.get('/api/alerts', (req, res) => {
  const alerts = [
    {
      _id: '1',
      name: 'UPND Sentiment Spike',
      type: 'sentiment_spike',
      conditions: { threshold: 20, timeWindow: 24 },
      isActive: true,
      triggerCount: 3
    }
  ];
  res.json({ success: true, data: alerts });
});

app.post('/api/alerts', (req, res) => {
  res.json({ success: true, data: { _id: Date.now().toString(), ...req.body } });
});

app.delete('/api/alerts/:id', (req, res) => {
  res.json({ success: true, message: 'Alert deleted' });
});

// Reports routes
app.post('/api/reports/generate', (req, res) => {
  res.json({
    success: true,
    data: {
      generatedAt: new Date(),
      format: req.body.format,
      timeRange: req.body.timeRange,
      summary: mockData.overview
    }
  });
});

// Users routes (admin)
app.get('/api/users', (req, res) => {
  const users = [
    { _id: '1', name: 'Admin User', email: 'admin@zedpulse.zm', role: 'admin', isActive: true },
    { _id: '2', name: 'Analyst User', email: 'analyst@zedpulse.zm', role: 'analyst', isActive: true },
    { _id: '3', name: 'Viewer User', email: 'viewer@zedpulse.zm', role: 'viewer', isActive: true }
  ];
  res.json({ success: true, data: users });
});

app.put('/api/users/:id', (req, res) => {
  res.json({ success: true, data: { _id: req.params.id, ...req.body } });
});

// Socket.io handlers
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('subscribe:dashboard', () => {
    socket.join('dashboard');
    console.log(`Client ${socket.id} subscribed to dashboard`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Simulate real-time posts every 30 seconds
setInterval(() => {
  const newPost = {
    _id: Date.now().toString(),
    content: 'New political discussion happening now...',
    source: ['twitter', 'facebook', 'news'][Math.floor(Math.random() * 3)],
    sentiment: {
      label: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
      score: (Math.random() * 2 - 1).toFixed(2)
    },
    publishedAt: new Date().toISOString(),
    author: { username: `user_${Math.floor(Math.random() * 1000)}` }
  };
  
  io.to('dashboard').emit('new:post', newPost);
  console.log('📡 Broadcasted new post to dashboard');
}, 30000);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀 ZedPulse Backend Server Started!');
  console.log('🚀 ========================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for real-time updates`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log('🎯 Mode: Demo (No database required)');
  console.log('');
  console.log('📝 Available endpoints:');
  console.log('   POST /api/auth/login');
  console.log('   POST /api/auth/register');
  console.log('   GET  /api/dashboard/overview');
  console.log('   GET  /api/parties');
  console.log('   GET  /api/candidates');
  console.log('   ... and more!');
  console.log('');
  console.log('🔗 Connect frontend to: http://localhost:5174');
  console.log('========================================');
  console.log('');
});

export { io };
