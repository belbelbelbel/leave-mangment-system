const express = require("express")
const serverless = require("serverless-http")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const connectDB = require("../config/db")

// Connect to database (for serverless, connection is reused)
let dbConnected = false
const ensureDBConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB()
      dbConnected = true
    } catch (error) {
      console.error("Database connection error:", error)
      // Don't throw - let routes handle it
    }
  }
}

// Ensure DB connection on first request
app.use(async (req, res, next) => {
  await ensureDBConnection()
  next()
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
app.get("/debug", (req, res) => {
  res.json({
    message: "Debug info",
    environment: {
      node_version: process.version,
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      vercel_region: process.env.VERCEL_REGION || "unknown",
      node_env: process.env.NODE_ENV || "development"
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

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

module.exports = serverless(app)
