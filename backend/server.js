/**
 * Express Server Setup
 * Main server file for Job Match Analyzer Backend API
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, setupConnectionEvents } = require('./config/database');

// Load environment variables
dotenv.config();

// Import API routes
const apiRoutes = require('./routes/api');

// Create Express app
const app = express();

// Configure CORS middleware to accept frontend origin
const corsOptions = {
  origin: '*', // Allow all origins (use specific origin in production)
  credentials: false, // Set to false when using origin: '*'
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Configure express.json() middleware for JSON parsing
app.use(express.json({ limit: '10mb' }));

// Configure express.urlencoded() middleware for form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes at /api prefix
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Job Match Analyzer API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND'
    }
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error.message);
  
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
});

// Startup function with error handling
async function startServer() {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['MONGODB_URI', 'GROQ_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Connect to MongoDB
    await connectDB();
    
    // Setup connection event handlers
    setupConnectionEvents();

    // Pre-warm Puppeteer browser to avoid cold-start failures on first request
    try {
      const { getBrowser } = require('./services/scraper/renderPage');
      await getBrowser();
      console.log('✅ Puppeteer browser pre-warmed');
    } catch (err) {
      console.warn('⚠️  Puppeteer pre-warm failed (non-fatal):', err.message);
    }

    // Start server on port from environment variable (default: 3001)
    const PORT = process.env.PORT || 3001;
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}/api`);
      console.log(`❤️  Health check at http://localhost:${PORT}/health`);
    });

    // Handle port already in use error
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try one of these solutions:');
        console.log('   1. Kill the process using port:', `netstat -ano | findstr :${PORT}`);
        console.log('   2. Change PORT in .env file to a different number (e.g., 3002, 8000)');
        console.log('   3. Stop other servers running on this port');
        process.exit(1);
      } else {
        console.error('❌ Server error:', error.message);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;