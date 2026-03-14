/**
 * Database Connection Test
 * Simple script to test MongoDB connection and Analysis model
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testDatabase() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Check if MongoDB URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('📋 MongoDB URI found (first 20 chars):', process.env.MONGODB_URI.substring(0, 20) + '...');
    
    // Connect to MongoDB with timeout
    console.log('🔌 Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    
    console.log('✅ Database connection successful!');
    console.log('📊 Connected to database:', mongoose.connection.db.databaseName);
    
    // Import Analysis model after connection
    const Analysis = require('./models/Analysis');
    
    // Test creating a sample analysis record
    console.log('🧪 Testing Analysis model...');
    
    const sampleAnalysis = new Analysis({
      jobUrl: 'https://example.com/job/test-' + Date.now(),
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      jobSkills: ['JavaScript', 'React', 'Node.js'],
      resumeSkills: ['JavaScript', 'Python', 'SQL'],
      matchScore: 33.33,
      matchingSkills: ['JavaScript'],
      missingSkills: ['React', 'Node.js'],
      suggestions: ['Add React experience to your resume', 'Learn Node.js fundamentals']
    });
    
    // Save the test record
    const savedAnalysis = await sampleAnalysis.save();
    console.log('✅ Test analysis record created with ID:', savedAnalysis._id);
    
    // Test the custom methods
    const metrics = savedAnalysis.getAnalysisMetrics();
    console.log('📊 Analysis metrics:', metrics);
    
    // Test finding recent analyses
    const recentAnalyses = await Analysis.findRecent(5);
    console.log('📋 Recent analyses count:', recentAnalyses.length);
    
    // Clean up - delete the test record
    await Analysis.findByIdAndDelete(savedAnalysis._id);
    console.log('🧹 Test record cleaned up');
    
    console.log('✅ All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:');
    console.error('Error message:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('MONGODB_URI')) {
      console.error('💡 Fix: Make sure MONGODB_URI is set in your .env file');
    } else if (error.message.includes('authentication')) {
      console.error('💡 Fix: Check your MongoDB username and password');
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      console.error('💡 Fix: Check your internet connection and MongoDB Atlas network access');
    } else if (error.message.includes('Cannot find module')) {
      console.error('💡 Fix: Run "npm install" to install dependencies');
    }
    
    console.error('Full error:', error);
  } finally {
    // Close the connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('📴 Database connection closed');
    }
    process.exit(0);
  }
}

// Run the test
testDatabase();