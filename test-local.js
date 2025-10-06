const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Create a simple Express server to test the API
const testApp = express()

// Middleware
testApp.use(cors())
testApp.use(express.json())
testApp.use(express.static(path.join(__dirname, "frontend")))

// Database connection
const connectDB = require("./config/db")
connectDB()

// Routes (same as in server.js)
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const leaveRoutes = require("./routes/leaveRoutes")
const balanceRoutes = require("./routes/balanceRoutes")
const balanceRequestRoutes = require("./routes/balanceRequestRoutes")
const noticeRoutes = require("./routes/noticeRoutes")
const adminRoutes = require("./routes/adminRoutes")
const wellnessRoutes = require("./routes/wellnessRoutes")

// API Routes
testApp.use("/api/auth", authRoutes)
testApp.use("/api/users", userRoutes)
testApp.use("/api/leaves", leaveRoutes)
testApp.use("/api/balances", balanceRoutes)
testApp.use("/api/balance-requests", balanceRequestRoutes)
testApp.use("/api/notices", noticeRoutes)
testApp.use("/api/admin", adminRoutes)
testApp.use("/api/wellness", wellnessRoutes)

// Health check endpoint
testApp.get("/api", (req, res) => {
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

// Serve frontend - root route
testApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"))
})

// Health check for the test server
testApp.get("/health", (req, res) => {
  res.json({ message: "Test server is running", timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3000
testApp.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`)
  console.log(`Frontend: http://localhost:${PORT}`)
  console.log(`API Health Check: http://localhost:${PORT}/api`)
  console.log(`API Auth: http://localhost:${PORT}/api/auth`)
  console.log(`API Users: http://localhost:${PORT}/api/users`)
})