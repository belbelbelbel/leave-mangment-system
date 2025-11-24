// config/db.js
// Global MongoDB connection singleton for serverless (Vercel)
const mongoose = require('mongoose');

// Cache the connection to reuse across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  
  if (!uri) {
    const error = new Error('MONGODB_URI is not defined in environment variables');
    console.error('❌', error.message);
    throw error;
  }

  // If already connected and ready, return immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected successfully');
      cached.conn = mongoose;
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      cached.conn = null;
      console.error('❌ MongoDB connection failed:', error.message);
      console.error('Error code:', error.code);
      console.error('Error name:', error.name);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }
};

module.exports = connectDB;
