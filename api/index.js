const express = require("express")
const serverless = require("serverless-http")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection - use singleton from config/db.js
const connectDB = require("../config/db")
const mongoose = require('mongoose')

// Ensure DB connection on first request (serverless-friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB()
    // Verify connection is ready
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ Database connection not ready, state:', mongoose.connection.readyState)
    }
    next()
  } catch (error) {
    console.error('❌ Database connection error in middleware:', error.message)
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message
    })
    // Continue to next middleware - routes will handle DB errors
    next()
  }
})

// Routes
const authRoutes = require("../routes/authRoutes")
const userRoutes = require("../routes/userRoutes")
const leaveRoutes = require("../routes/leaveRoutes")
const balanceRoutes = require("../routes/balanceRoutes")
const balanceRequestRoutes = require("../routes/balanceRequestRoutes")
const noticeRoutes = require("../routes/noticeRoutes")
const adminRoutes = require("../routes/adminRoutes")
const wellnessRoutes = require("../routes/wellnessRoutes")

// Note: Vercel strips the /api prefix when routing to serverless functions
// So routes should be mounted without /api prefix
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/leaves", leaveRoutes)
app.use("/balances", balanceRoutes)
app.use("/balance-requests", balanceRequestRoutes)
app.use("/notices", noticeRoutes)
app.use("/admin", adminRoutes)
app.use("/wellness", wellnessRoutes)

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Leave Management System API is running",
    timestamp: new Date().toISOString(),
    status: "OK",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      leaves: "/api/leaves",
      balances: "/api/balances",
      balanceRequests: "/api/balance-requests",
      notices: "/api/notices",
      admin: "/api/admin",
      wellness: "/api/wellness"
    }
  })
})

// Debug endpoint
app.get("/debug", async (req, res) => {
  const mongoose = require('mongoose')
  const User = require('../models/User')
  
  let dbStatus = 'unknown'
  let userCount = 0
  
  try {
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    if (mongoose.connection.readyState === 1) {
      userCount = await User.countDocuments()
    }
  } catch (err) {
    dbStatus = 'error: ' + err.message
  }
  
  res.json({
    message: "Debug info",
    environment: {
      node_version: process.version,
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      mongodb_uri_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      jwt_secret_length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      vercel_region: process.env.VERCEL_REGION || "unknown",
      node_env: process.env.NODE_ENV || "development"
    },
    database: {
      status: dbStatus,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || 'not connected',
      name: mongoose.connection.name || 'not connected',
      user_count: userCount
    },
    request_info: {
      method: req.method,
      url: req.url,
      path: req.path
    }
  })
})

// Catch all other routes
app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
    available_routes: [
      "GET /api (or /api/)",
      "GET /api/debug",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/me",
      "GET /api/users",
      "GET /api/leaves",
      "GET /api/balances",
      "GET /api/balance-requests",
      "GET /api/notices",
      "GET /api/admin/stats",
      "GET /api/wellness/articles",
      "GET /api/wellness/events"
    ]
  })
})

// Error handler - must be last
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  console.error("Error name:", err.name)
  console.error("Error message:", err.message)
  console.error("Error stack:", err.stack)
  
  // Always include error details in Vercel (regardless of NODE_ENV)
  const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV
  
  // Return error in format expected by frontend
  const statusCode = err.status || 500
  res.status(statusCode).json({
    error: {
      code: statusCode.toString(),
      message: err.message || "Internal server error"
    },
    // Always include debug info in Vercel for troubleshooting
    ...(isVercel ? {
      errorType: err.name,
      errorDetails: err.message,
      stack: err.stack,
      nodeEnv: process.env.NODE_ENV || 'not set',
      isVercel: true
    } : {})
  })
})

// Export with serverless-http wrapper for Vercel /api folder structure
module.exports = serverless(app)
