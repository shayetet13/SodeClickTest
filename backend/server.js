const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: path.join(__dirname, 'env.' + NODE_ENV)
});

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sodeclick';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS Configuration - Allow Railway frontend
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://sodeclicktest-front-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const membershipRoutes = require('./routes/membership');
const upgradeSimpleRoutes = require('./routes/upgrade-simple');
const blurRoutes = require('./routes/blur');
const chatroomRoutes = require('./routes/chatroom');
const messagesRoutes = require('./routes/messages');
const giftRoutes = require('./routes/gift');
const voteRoutes = require('./routes/vote');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');
const matchingRoutes = require('./routes/matching');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/upgrade-simple', upgradeSimpleRoutes);
app.use('/api/blur', blurRoutes);
app.use('/api/chatroom', chatroomRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/gift', giftRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/matching', matchingRoutes);

app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
