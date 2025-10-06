const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const serverless = require("serverless-http")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection with better error handling
let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error("MongoDB URI not found in environment variables")
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    })
    
    isConnected = true
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    throw new Error(`Database connection failed: ${error.message}`)
  }
}

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Leave Management System API is running",
    timestamp: new Date().toISOString(),
    status: "OK",
    environment: {
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      jwt_secret_exists: !!process.env.JWT_SECRET
    }
  })
})

// Auth routes with database connection
app.post("/auth/register", async (req, res) => {
  try {
    await connectDB()
    
    const bcrypt = require("bcryptjs")
    const jwt = require("jsonwebtoken")
    const User = require("../models/User")
    const Balance = require("../models/Balance")

    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "Employee",
    })

    await user.save()

    // Initialize default balances
    const defaultBalances = [
      { employeeId: user._id, leaveType: "Sick", balance: 10 },
      { employeeId: user._id, leaveType: "Vacation", balance: 15 },
      { employeeId: user._id, leaveType: "Personal", balance: 5 },
    ]

    for (const balanceData of defaultBalances) {
      await Balance.findOneAndUpdate(
        { employeeId: balanceData.employeeId, leaveType: balanceData.leaveType },
        { balance: balanceData.balance },
        { upsert: true, new: true },
      )
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toPublicJSON(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration", error: error.message })
  }
})

app.post("/auth/login", async (req, res) => {
  try {
    await connectDB()
    
    const User = require("../models/User")
    const jwt = require("jsonwebtoken")

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: user.toPublicJSON(),
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login", error: error.message })
  }
})

// Import other routes for full functionality
app.use("/users", async (req, res, next) => {
  try {
    await connectDB()
    const userRoutes = require("../routes/userRoutes")
    userRoutes(req, res, next)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use("/leaves", async (req, res, next) => {
  try {
    await connectDB()
    const leaveRoutes = require("../routes/leaveRoutes")
    leaveRoutes(req, res, next)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use("/balances", async (req, res, next) => {
  try {
    await connectDB()
    const balanceRoutes = require("../routes/balanceRoutes")
    balanceRoutes(req, res, next)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use("/balance-requests", async (req, res, next) => {
  try {
    await connectDB()
    const balanceRequestRoutes = require("../routes/balanceRequestRoutes")
    balanceRequestRoutes(req, res, next)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use("/notices", async (req, res, next) => {
  try {
    await connectDB()
    const noticeRoutes = require("../routes/noticeRoutes")
    noticeRoutes(req, res, next)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use("/admin", async (req, res, next) => {
  try {
    await connectDB()
    const adminRoutes = require("../routes/adminRoutes")
    adminRoutes(req, res, next)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.use("/wellness", async (req, res, next) => {
  try {
    await connectDB()
    const wellnessRoutes = require("../routes/wellnessRoutes")
    wellnessRoutes(req, res, next)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error)
  res.status(500).json({ 
    error: "Internal server error",
    message: error.message
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path })
})

// Export the serverless function
module.exports = serverless(app)