const BalanceRequest = require("../models/BalanceRequest")
const Balance = require("../models/Balance")
const User = require("../models/User")

// Get all balance requests (Admin)
const getAllBalanceRequests = async (req, res) => {
  try {
    console.log("🔍 Getting all balance requests...")
    const requests = await BalanceRequest.find().populate("employeeId", "name email").sort({ createdAt: -1 })
    console.log("📊 Found requests:", requests.length)
    res.json(requests)
  } catch (error) {
    console.error("❌ Get balance requests error:", error)
    res.status(500).json({ message: "Server error while fetching balance requests.", error: error.message })
  }
}

// Update balance request status (Admin)
const updateBalanceRequestStatus = async (req, res) => {
  try {
    console.log("🔄 Processing balance request status update...")
    console.log("Request ID:", req.params.id)
    console.log("Request body:", req.body)
    console.log("User:", req.user?.name || req.user?.email)

    const { id } = req.params
    const { status, notes } = req.body

    if (!["Approved", "Rejected"].includes(status)) {
      console.log("❌ Invalid status:", status)
      return res.status(400).json({ message: "Invalid status. Must be Approved or Rejected." })
    }

    console.log("🔍 Finding balance request...")
    const request = await BalanceRequest.findById(id).populate("employeeId")
    if (!request) {
      console.log("❌ Balance request not found for ID:", id)
      return res.status(404).json({ message: "Balance request not found." })
    }

    console.log("📋 Found request:", {
      id: request._id,
      employee: request.employeeId?.name,
      status: request.status,
      leaveType: request.leaveType,
      amount: request.requestedAmount,
    })

    if (request.status !== "Pending") {
      console.log("❌ Request already processed, current status:", request.status)
      return res.status(400).json({ message: "Balance request has already been processed." })
    }

    // Update request status
    console.log("📝 Updating request status to:", status)
    request.status = status
    request.approvedBy = req.user._id
    request.approvedAt = new Date()
    if (notes) request.notes = notes

    // If approved, update the balance
    if (status === "Approved") {
      console.log(
        `✅ Approving request: ${request.requestedAmount} ${request.leaveType} days for ${request.employeeId.name}`,
      )

      console.log("🔍 Looking for existing balance...")
      let balance = await Balance.findOne({
        employeeId: request.employeeId._id,
        leaveType: request.leaveType,
      })

      if (balance) {
        console.log("📊 Found existing balance:", balance.balance)
        balance.balance += request.requestedAmount
        await balance.save()
        console.log("✅ Updated balance to:", balance.balance)
      } else {
        console.log("🆕 Creating new balance record...")
        balance = await Balance.create({
          employeeId: request.employeeId._id,
          leaveType: request.leaveType,
          balance: request.requestedAmount,
        })
        console.log("✅ Created new balance:", balance.balance)
      }
    } else {
      console.log(`❌ Rejecting request for ${request.employeeId.name}`)
    }

    console.log("💾 Saving request...")
    await request.save()
    console.log("✅ Request saved successfully")

    res.json({
      message: `Balance request ${status.toLowerCase()} successfully`,
      request,
    })
  } catch (error) {
    console.error("❌ Update balance request status error:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({
      message: "Server error while updating balance request status.",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// Get my balance requests (Employee)
const getMyBalanceRequests = async (req, res) => {
  try {
    const requests = await BalanceRequest.find({ employeeId: req.user._id }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (error) {
    console.error("Get my balance requests error:", error)
    res.status(500).json({ message: "Server error while fetching balance requests." })
  }
}

module.exports = {
  getAllBalanceRequests,
  updateBalanceRequestStatus,
  getMyBalanceRequests,
}
