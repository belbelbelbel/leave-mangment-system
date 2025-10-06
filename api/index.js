const express = require("express")
const serverless = require("serverless-http")

const app = express()

// Basic middleware
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Simple health check - no database
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running",
    timestamp: new Date().toISOString(),
    status: "OK"
  })
})

// Simple registration endpoint without database (for testing)
app.post("/auth/register", (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email and password are required",
        received: { name: !!name, email: !!email, password: !!password }
      })
    }

    // Simulate successful registration (no database)
    res.status(201).json({
      message: "Registration endpoint working (no database yet)",
      user: {
        name,
        email,
        role: role || "Employee"
      },
      note: "This is a test response - database connection will be added next"
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ 
      message: "Registration error", 
      error: error.message,
      stack: error.stack
    })
  }
})

// Simple login endpoint without database (for testing)
app.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        received: { email: !!email, password: !!password }
      })
    }

    // Simulate successful login (no database)
    res.json({
      message: "Login endpoint working (no database yet)",
      token: "fake-token-for-testing",
      user: {
        email,
        role: "Employee"
      },
      note: "This is a test response - database connection will be added next"
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ 
      message: "Login error", 
      error: error.message,
      stack: error.stack
    })
  }
})

// Debug endpoint
app.get("/debug", (req, res) => {
  res.json({
    message: "Debug info",
    environment: {
      node_version: process.version,
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      vercel_region: process.env.VERCEL_REGION || "unknown"
    },
    request_info: {
      method: req.method,
      url: req.url,
      headers: req.headers
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
      "GET /api/",
      "GET /api/debug", 
      "POST /api/auth/register",
      "POST /api/auth/login"
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