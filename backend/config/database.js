/**
 * Database Connection Module
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB connected successfully');
    
    // Log database name for confirmation
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Connected to database: ${dbName}`);

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Exit process with failure code
    process.exit(1);
  }
}

/**
 * Handles MongoDB connection events
 */
function setupConnectionEvents() {
  // Connection error after initial connection
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });

  // Connection disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  // Connection reconnected
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
      process.exit(1);
    }
  });
}

module.exports = {
  connectDB,
  setupConnectionEvents
};