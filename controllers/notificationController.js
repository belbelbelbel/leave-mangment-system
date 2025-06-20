const Notification = require("../models/Notification")

// Create notification
const createNotification = async (userId, title, message, type = "info", data = {}) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      data,
    })
    await notification.save()
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50)

    res.json(notifications)
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({ message: "Server error while fetching notifications." })
  }
}

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params

    await Notification.findByIdAndUpdate(id, {
      isRead: true,
      readAt: new Date(),
    })

    res.json({ message: "Notification marked as read" })
  } catch (error) {
    console.error("Mark as read error:", error)
    res.status(500).json({ message: "Server error while marking notification as read." })
  }
}

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      },
    )

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Mark all as read error:", error)
    res.status(500).json({ message: "Server error while marking all notifications as read." })
  }
}

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    })

    res.json({ count })
  } catch (error) {
    console.error("Get unread count error:", error)
    res.status(500).json({ message: "Server error while fetching unread count." })
  }
}

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
}
