// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.warn('⚠️  MongoDB URI is not defined in environment variables');
      return;
    }

    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Don't exit process - let server continue and routes can handle DB errors
    // This allows the server to start even if DB is temporarily unavailable
    console.log('⚠️  Server will continue without database connection');
    return;
  }
};

module.exports = connectDB;
