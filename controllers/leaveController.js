const Leave = require("../models/Leave")
const Balance = require("../models/Balance")
const User = require("../models/User")
const { createNotification } = require("./notificationController")
const { sendLeaveRequestNotification, sendLeaveStatusUpdate } = require("./emailController")

// Apply for leave (Employee)
const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, leaveType, description } = req.body
    const employeeId = req.user._id

    // Validate dates
    if (new Date(startDate) < new Date()) {
      return res.status(400).json({ message: "Start date cannot be in the past." })
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date must be after start date." })
    }

    // Calculate leave days (including both start and end dates)
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

    // Check leave balance
    const balance = await Balance.findOne({ employeeId, leaveType })
    if (!balance || balance.balance < days) {
      return res.status(400).json({
        message: `Insufficient leave balance. You need ${days} days but only have ${balance?.balance || 0} days available.`,
      })
    }

    // Create leave request
    const leave = new Leave({
      employeeId,
      startDate,
      endDate,
      leaveType,
      description,
      requestedDays: days, // Store the number of days requested
    })

    await leave.save()

    // Get employee details
    const employee = await User.findById(employeeId)

    // Send email notification to admin
    await sendLeaveRequestNotification(leave, employee)

    // Create notification for admin
    const admins = await User.find({ role: "Admin" })
    for (const admin of admins) {
      await createNotification(
        admin._id,
        "New Leave Request",
        `${employee.name} has submitted a ${leaveType} leave request for ${days} days`,
        "info",
        { leaveId: leave._id, employeeId },
      )
    }

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave,
      requestedDays: days,
    })
  } catch (error) {
    console.error("Apply leave error:", error)
    res.status(500).json({ message: "Server error while applying for leave." })
  }
}

// Update leave status (Admin) - Fixed to handle missing requestedDays
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be Approved or Rejected." })
    }

    const leave = await Leave.findById(id).populate("employeeId")
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found." })
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Leave request has already been processed." })
    }

    // Calculate leave days if requestedDays is missing
    let days = leave.requestedDays
    if (!days) {
      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)
      const timeDiff = end.getTime() - start.getTime()
      days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

      // Update the leave record with calculated days
      leave.requestedDays = days
    }

    // Update leave status
    leave.status = status
    leave.approvedBy = req.user._id
    leave.approvedAt = new Date()

    // If approved, deduct from balance
    if (status === "Approved") {
      const balance = await Balance.findOne({
        employeeId: leave.employeeId._id,
        leaveType: leave.leaveType,
      })

      if (balance) {
        if (balance.balance < days) {
          return res.status(400).json({
            message: `Cannot approve. Employee only has ${balance.balance} days but requested ${days} days.`,
          })
        }

        balance.balance -= days
        await balance.save()

        console.log(
          `✅ Deducted ${days} ${leave.leaveType} days from ${leave.employeeId.name}. New balance: ${balance.balance}`,
        )
      }
    }

    // Save the leave with updated requestedDays
    await leave.save()

    // Send email notification to employee (will log to console if email not configured)
    try {
      await sendLeaveStatusUpdate(leave, leave.employeeId, status)
    } catch (emailError) {
      console.log(`📧 Email notification would be sent to ${leave.employeeId.email}: Leave ${status}`)
    }

    // Create notification for employee
    await createNotification(
      leave.employeeId._id,
      `Leave Request ${status}`,
      `Your ${leave.leaveType} leave request for ${days} days has been ${status.toLowerCase()}`,
      status === "Approved" ? "success" : "warning",
      { leaveId: leave._id },
    )

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave,
      daysDeducted: status === "Approved" ? days : 0,
    })
  } catch (error) {
    console.error("Update leave status error:", error)
    res.status(500).json({ message: "Server error while updating leave status." })
  }
}

// Get user's leave history (Employee)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 })

    res.json(leaves)
  } catch (error) {
    console.error("Get my leaves error:", error)
    res.status(500).json({ message: "Server error while fetching leaves." })
  }
}

// Get all leaves (Admin)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employeeId", "name email").sort({ createdAt: -1 })

    res.json(leaves)
  } catch (error) {
    console.error("Get all leaves error:", error)
    res.status(500).json({ message: "Server error while fetching leaves." })
  }
}

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
}
