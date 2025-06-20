const User = require("../models/User")
const Leave = require("../models/Leave")
const WellnessEvent = require("../models/WellnessEvent")
const WellnessArticle = require("../models/WellnessArticle")

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Leave statistics
    const totalLeaves = await Leave.countDocuments()
    const pendingLeaves = await Leave.countDocuments({ status: "Pending" })
    const approvedLeaves = await Leave.countDocuments({ status: "Approved" })
    const rejectedLeaves = await Leave.countDocuments({ status: "Rejected" })

    // User statistics
    const totalUsers = await User.countDocuments()
    const totalEmployees = await User.countDocuments({ role: "Employee" })
    const totalAdmins = await User.countDocuments({ role: "Admin" })

    // Wellness statistics
    const totalArticles = await WellnessArticle.countDocuments({ isPublished: true })
    const totalEvents = await WellnessEvent.countDocuments({ isActive: true })
    const upcomingEvents = await WellnessEvent.countDocuments({
      isActive: true,
      date: { $gte: new Date() },
    })

    // Monthly statistics
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyLeaves = await Leave.countDocuments({
      createdAt: { $gte: currentMonth },
    })

    const monthlyApproved = await Leave.countDocuments({
      status: "Approved",
      approvedAt: { $gte: currentMonth },
    })

    res.json({
      pending: pendingLeaves,
      approved: approvedLeaves,
      rejected: rejectedLeaves,
      totalLeaves,
      totalUsers,
      totalEmployees,
      totalAdmins,
      totalArticles,
      totalEvents,
      upcomingEvents,
      monthlyLeaves,
      monthlyApproved,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({ message: "Server error while fetching dashboard statistics." })
  }
}

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    const recentLeaves = await Leave.find().populate("employeeId", "name email").sort({ createdAt: -1 }).limit(10)

    const recentUsers = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).limit(5)

    res.json({
      recentLeaves,
      recentUsers,
    })
  } catch (error) {
    console.error("Get recent activities error:", error)
    res.status(500).json({ message: "Server error while fetching recent activities." })
  }
}

module.exports = {
  getDashboardStats,
  getRecentActivities,
}
