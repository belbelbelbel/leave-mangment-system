const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const serverless = require("serverless-http")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
let cachedDb = null

const connectDB = async () => {
  if (cachedDb) {
    console.log("Using cached database connection")
    return cachedDb
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
    cachedDb = conn
    console.log('MongoDB Connected')
    return cachedDb
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    throw error
  }
}

// Import models to ensure they're registered with mongoose
require("../models/User")
require("../models/Balance")
require("../models/BalanceRequest")
require("../models/Leave")
require("../models/Notice")
require("../models/Notification")
require("../models/wellnessArticle")
require("../models/wellnessEvent")

// Routes
const authRoutes = require("../routes/authRoutes")
const userRoutes = require("../routes/userRoutes")
const leaveRoutes = require("../routes/leaveRoutes")
const balanceRoutes = require("../routes/balanceRoutes")
const balanceRequestRoutes = require("../routes/balanceRequestRoutes")
const noticeRoutes = require("../routes/noticeRoutes")
const adminRoutes = require("../routes/adminRoutes")
const wellnessRoutes = require("../routes/wellnessRoutes")

// Connect to database before handling any requests
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error("Database connection failed:", error)
    res.status(500).json({
      error: "Database connection failed",
      details: error.message
    })
  }
})

// API Routes (no /api prefix needed - Vercel strips it)
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/leaves", leaveRoutes)
app.use("/balances", balanceRoutes)
app.use("/balance-requests", balanceRequestRoutes)
app.use("/notices", noticeRoutes)
app.use("/admin", adminRoutes)
app.use("/wellness", wellnessRoutes)

// Health check endpoint with debug info
app.get("/", (req, res) => {
  res.json({
    message: "Leave Management System API is running",
    timestamp: new Date().toISOString(),
    environment: {
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV
    },
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

// Add debug endpoint for troubleshooting
app.get("/debug", (req, res) => {
  res.json({
    message: "Debug information",
    environment_variables: {
      MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Missing",
      JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Missing",
      NODE_ENV: process.env.NODE_ENV || "Not set"
    },
    mongoose_connection: {
      ready_state: mongoose.connection.readyState,
      states: {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
      }
    }
  })
})

// Export the serverless function
module.exports = serverless(app)