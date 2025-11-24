const User = require("../models/User")
const Balance = require("../models/Balance")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" })
}

const initializeBalances = async (employeeId) => {
  try {
    const defaultBalances = [
      { employeeId, leaveType: "Sick", balance: 10 },
      { employeeId, leaveType: "Vacation", balance: 15 },
      { employeeId, leaveType: "Personal", balance: 5 },
    ]

    for (const balanceData of defaultBalances) {
      await Balance.findOneAndUpdate(
        { employeeId: balanceData.employeeId, leaveType: balanceData.leaveType },
        { balance: balanceData.balance },
        { upsert: true, new: true },
      )
    }

    console.log(`✅ Initialized balances for user ${employeeId}`)
  } catch (error) {
    console.error("❌ Initialize balances error:", error)
  }
}

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required.",
        received: { name: !!name, email: !!email, password: !!password }
      })
    }

    // Check if database is connected
    const mongoose = require('mongoose')
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected. ReadyState:', mongoose.connection.readyState)
      return res.status(500).json({ 
        message: "Database connection error. Please try again later.",
        error: "Database not connected"
      })
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
    console.log(`User created: ${user._id} (${user.email})`)

    // 🔥 CREATE BALANCES IMMEDIATELY AFTER USER CREATION
    await initializeBalances(user._id)
    console.log(`initializeBalances called for user ${user._id}`)

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: "User registered successfully with default leave balances",
      token,
      user: user.toPublicJSON(),
    })
  } catch (error) {
    console.error("Registration error:", error)
    console.error("Error stack:", error.stack)
    console.error("Error name:", error.name)
    console.error("Error message:", error.message)
    
    // Provide more helpful error messages
    let errorMessage = "Server error during registration."
    if (error.name === 'MongoServerError' && error.code === 11000) {
      errorMessage = "User already exists with this email."
    } else if (error.name === 'ValidationError') {
      errorMessage = "Validation error: " + Object.values(error.errors).map(e => e.message).join(', ')
    } else if (error.message.includes('connection')) {
      errorMessage = "Database connection error. Please check your MongoDB connection."
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if database is connected
    const mongoose = require('mongoose')
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected. ReadyState:', mongoose.connection.readyState)
      return res.status(500).json({ 
        message: "Database connection error. Please try again later.",
        error: "Database not connected"
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      console.log(`❌ Login attempt failed: User not found for email: ${email}`)
      return res.status(400).json({ message: "Invalid email or password." })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      console.log(`❌ Login attempt failed: Invalid password for email: ${email}`)
      return res.status(400).json({ message: "Invalid email or password." })
    }

    // Check if user has balances, if not create them
    const existingBalances = await Balance.find({ employeeId: user._id })
    if (existingBalances.length === 0) {
      console.log(`🔧 User ${user.email} has no balances, creating them...`)
      await initializeBalances(user._id)
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: user.toPublicJSON(),
    })
  } catch (error) {
    console.error("Login error:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({ 
      message: "Server error during login.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({ message: "Server error." })
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
}
