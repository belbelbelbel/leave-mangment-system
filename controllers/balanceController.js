const Balance = require("../models/Balance")
const User = require("../models/User")
const Leave = require("../models/Leave")
const BalanceRequest = require("../models/BalanceRequest")

// Get user's leave balance (Employee)
const getMyBalance = async (req, res) => {
  try {
    console.log("🔍 Getting balance for user:", req.user._id)

    let balances = await Balance.find({ employeeId: req.user._id })
    console.log("📊 Found balances:", balances)

    // If no balances exist, create them
    if (balances.length === 0) {
      console.log("🔧 No balances found, creating default balances...")

      const defaultBalances = [
        { employeeId: req.user._id, leaveType: "Sick", balance: 10 },
        { employeeId: req.user._id, leaveType: "Vacation", balance: 15 },
        { employeeId: req.user._id, leaveType: "Personal", balance: 5 },
      ]

      // Create all balances
      for (const balanceData of defaultBalances) {
        await Balance.create(balanceData)
      }

      // Fetch the newly created balances
      balances = await Balance.find({ employeeId: req.user._id })
      console.log("✅ Created new balances:", balances)
    }

    // Format response
    const formattedBalance = {
      sick: 0,
      vacation: 0,
      personal: 0,
    }

    balances.forEach((balance) => {
      const leaveType = balance.leaveType.toLowerCase()
      formattedBalance[leaveType] = balance.balance
    })

    console.log("📤 Sending formatted balance:", formattedBalance)
    res.json(formattedBalance)
  } catch (error) {
    console.error("❌ Get balance error:", error)
    res.status(500).json({ message: "Server error while fetching balance." })
  }
}

// Initialize default balances for new user
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
      console.log(`Balance for ${balanceData.leaveType} initialized for user ${employeeId}`)
    }

    console.log(`✅ Initialized balances for employee ${employeeId}`)
  } catch (error) {
    console.error("❌ Initialize balances error:", error)
  }
}

// Get all balances (Admin) - Fixed version
const getAllBalances = async (req, res) => {
  try {
    // Get all users first
    const users = await User.find({ role: "Employee" }).select("name email")

    // Get all balances
    const balances = await Balance.find().populate("employeeId", "name email")

    // Create a structured response
    const result = []

    for (const user of users) {
      const userBalances = balances.filter((b) => b.employeeId && b.employeeId._id.toString() === user._id.toString())

      const balanceData = {
        employee: user,
        balances: {
          sick: 0,
          vacation: 0,
          personal: 0,
        },
      }

      userBalances.forEach((balance) => {
        balanceData.balances[balance.leaveType.toLowerCase()] = balance.balance
      })

      // If user has no balances, initialize them
      if (userBalances.length === 0) {
        await initializeBalances(user._id)
        balanceData.balances = { sick: 10, vacation: 15, personal: 5 }
      }

      result.push(balanceData)
    }

    res.json(result)
  } catch (error) {
    console.error("Get all balances error:", error)
    res.status(500).json({ message: "Server error while fetching balances." })
  }
}

// Update user's leave balance (Admin)
const updateBalance = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { leaveType, balance } = req.body

    if (!["Sick", "Vacation", "Personal"].includes(leaveType)) {
      return res.status(400).json({ message: "Invalid leave type." })
    }

    if (balance < 0) {
      return res.status(400).json({ message: "Balance cannot be negative." })
    }

    // Check if user exists
    const user = await User.findById(employeeId)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    // Update or create balance
    const updatedBalance = await Balance.findOneAndUpdate(
      { employeeId, leaveType },
      { balance },
      { upsert: true, new: true },
    ).populate("employeeId", "name email")

    res.json({
      message: "Leave balance updated successfully",
      balance: updatedBalance,
    })
  } catch (error) {
    console.error("Update balance error:", error)
    res.status(500).json({ message: "Server error while updating balance." })
  }
}

// Request balance increase (Employee) - Simplified without notifications
const requestBalanceIncrease = async (req, res) => {
  try {
    const { leaveType, requestedAmount, reason } = req.body
    const employeeId = req.user._id

    if (!["Sick", "Vacation", "Personal"].includes(leaveType)) {
      return res.status(400).json({ message: "Invalid leave type." })
    }

    if (!requestedAmount || requestedAmount <= 0) {
      return res.status(400).json({ message: "Requested amount must be greater than 0." })
    }

    // Get employee details
    const employee = await User.findById(employeeId)

    // Create balance request
    const balanceRequest = new BalanceRequest({
      employeeId,
      leaveType,
      requestedAmount,
      reason: reason || "No reason provided",
    })

    await balanceRequest.save()

    console.log(`✅ Balance increase request created for ${employee.name}: ${requestedAmount} ${leaveType} days`)

    res.status(201).json({
      message: "Balance increase request submitted successfully",
      request: balanceRequest,
    })
  } catch (error) {
    console.error("Request balance increase error:", error)
    res.status(500).json({ message: "Server error while requesting balance increase." })
  }
}

// Get real-time balance with recent usage
const getBalanceWithUsage = async (req, res) => {
  try {
    const employeeId = req.user._id

    // Get current balances
    const balances = await Balance.find({ employeeId })

    // Get recent approved leaves to show usage
    const recentLeaves = await Leave.find({
      employeeId,
      status: "Approved",
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    })
      .sort({ createdAt: -1 })
      .limit(5)

    // Format response
    const formattedBalance = {
      sick: 0,
      vacation: 0,
      personal: 0,
    }

    balances.forEach((balance) => {
      formattedBalance[balance.leaveType.toLowerCase()] = balance.balance
    })

    // If no balances exist, create them
    if (balances.length === 0) {
      await initializeBalances(employeeId)
      formattedBalance.sick = 10
      formattedBalance.vacation = 15
      formattedBalance.personal = 5
    }

    res.json({
      balances: formattedBalance,
      recentUsage: recentLeaves,
      lastUpdated: new Date(),
    })
  } catch (error) {
    console.error("Get balance with usage error:", error)
    res.status(500).json({ message: "Server error while fetching balance." })
  }
}

module.exports = {
  getMyBalance,
  getAllBalances,
  updateBalance,
  initializeBalances,
  requestBalanceIncrease,
  getBalanceWithUsage,
}
