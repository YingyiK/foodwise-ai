const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const foodRoutes = require('../routes/foodRoutes');
const restaurantRoutes = require('../routes/restaurantRoutes');
const groceryRoutes = require('../routes/groceryRoutes');
const userRoutes = require('../routes/userRoutes');
const agentRoutes = require('../routes/agentRoutes');

// Routes
app.use('/api/food', foodRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/agents', agentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'FoodWise AI Backend',
    stage: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export handler for AWS Lambda
module.exports.handler = serverless(app);
