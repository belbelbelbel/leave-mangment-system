const User = require("../models/User")
const Balance = require("../models/Balance")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" })
}

// Initialize default balances for new user
const initializeBalances = async (employeeId) => {
  try {
    // Create default balances with correct values: Sick=10, Vacation=15, Personal=5
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
    res.status(500).json({ message: "Server error during registration." })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

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
    res.status(500).json({ message: "Server error during login." })
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
