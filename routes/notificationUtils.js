const Notification = require("../models/Notification")

// Create a new notification
const createNotification = async (userId, title, message, type = "info", metadata = {}) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      metadata,
      isRead: false,
      createdAt: new Date(),
    })

    await notification.save()
    console.log(`✅ Notification created for user ${userId}: ${title}`)
    return notification
  } catch (error) {
    console.error("❌ Error creating notification:", error)
    throw error
  }
}

// Mark notification as read
const markAsRead = async (notificationId) => {
  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true })
    console.log(`✅ Notification ${notificationId} marked as read`)
  } catch (error) {
    console.error("❌ Error marking notification as read:", error)
    throw error
  }
}

// Get user notifications
const getUserNotifications = async (userId, limit = 10) => {
  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit)

    return notifications
  } catch (error) {
    console.error("❌ Error fetching notifications:", error)
    throw error
  }
}

// Get unread count
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ userId, isRead: false })
    return count
  } catch (error) {
    console.error("❌ Error getting unread count:", error)
    return 0
  }
}

// Delete old notifications (cleanup)
const cleanupOldNotifications = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      isRead: true,
    })

    console.log(`✅ Cleaned up ${result.deletedCount} old notifications`)
    return result.deletedCount
  } catch (error) {
    console.error("❌ Error cleaning up notifications:", error)
    throw error
  }
}

module.exports = {
  createNotification,
  markAsRead,
  getUserNotifications,
  getUnreadCount,
  cleanupOldNotifications,
}
