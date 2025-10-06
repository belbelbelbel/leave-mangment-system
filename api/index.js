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
    res.status(500).json({ error: "Database connection failed" })
  }
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/leaves", leaveRoutes)
app.use("/api/balances", balanceRoutes)
app.use("/api/balance-requests", balanceRequestRoutes)
app.use("/api/notices", noticeRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/wellness", wellnessRoutes)

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({ 
    message: "Leave Management System API is running",
    timestamp: new Date().toISOString(),
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

// Export the serverless function
module.exports = serverless(app)