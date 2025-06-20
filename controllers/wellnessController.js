const WellnessArticle = require("../models/WellnessArticle")
const WellnessEvent = require("../models/WellnessEvent")

// Wellness Articles Controllers

// Get all articles (public)
const getAllArticles = async (req, res) => {
  try {
    const { category, search, limit = 10, page = 1 } = req.query

    const query = { isPublished: true }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const articles = await WellnessArticle.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await WellnessArticle.countDocuments(query)

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get articles error:", error)
    res.status(500).json({ message: "Server error while fetching articles." })
  }
}

// Get single article
const getArticleById = async (req, res) => {
  try {
    const article = await WellnessArticle.findById(req.params.id).populate("author", "name")

    if (!article || !article.isPublished) {
      return res.status(404).json({ message: "Article not found." })
    }

    // Increment view count
    article.views += 1
    await article.save()

    res.json(article)
  } catch (error) {
    console.error("Get article error:", error)
    res.status(500).json({ message: "Server error while fetching article." })
  }
}

// Create article (Admin)
const createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, imageUrl, readTime } = req.body

    const article = new WellnessArticle({
      title,
      content,
      excerpt,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      imageUrl,
      readTime,
      author: req.user._id,
    })

    await article.save()
    await article.populate("author", "name")

    res.status(201).json({
      message: "Article created successfully",
      article,
    })
  } catch (error) {
    console.error("Create article error:", error)
    res.status(500).json({ message: "Server error while creating article." })
  }
}

// Update article (Admin)
const updateArticle = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, imageUrl, readTime, isPublished } = req.body

    const article = await WellnessArticle.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: "Article not found." })
    }

    article.title = title || article.title
    article.content = content || article.content
    article.excerpt = excerpt || article.excerpt
    article.category = category || article.category
    article.tags = tags ? tags.split(",").map((tag) => tag.trim()) : article.tags
    article.imageUrl = imageUrl !== undefined ? imageUrl : article.imageUrl
    article.readTime = readTime || article.readTime
    article.isPublished = isPublished !== undefined ? isPublished : article.isPublished

    await article.save()
    await article.populate("author", "name")

    res.json({
      message: "Article updated successfully",
      article,
    })
  } catch (error) {
    console.error("Update article error:", error)
    res.status(500).json({ message: "Server error while updating article." })
  }
}

// Delete article (Admin)
const deleteArticle = async (req, res) => {
  try {
    const article = await WellnessArticle.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: "Article not found." })
    }

    await WellnessArticle.findByIdAndDelete(req.params.id)

    res.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Delete article error:", error)
    res.status(500).json({ message: "Server error while deleting article." })
  }
}

// Wellness Events Controllers

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const { category, upcoming, limit = 10, page = 1 } = req.query

    const query = { isActive: true }

    if (category && category !== "all") {
      query.category = category
    }

    if (upcoming === "true") {
      query.date = { $gte: new Date() }
    }

    const events = await WellnessEvent.find(query)
      .populate("organizer", "name")
      .populate("registrations.user", "name email")
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await WellnessEvent.countDocuments(query)

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get events error:", error)
    res.status(500).json({ message: "Server error while fetching events." })
  }
}

// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await WellnessEvent.findById(req.params.id)
      .populate("organizer", "name")
      .populate("registrations.user", "name email")

    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found." })
    }

    res.json(event)
  } catch (error) {
    console.error("Get event error:", error)
    res.status(500).json({ message: "Server error while fetching event." })
  }
}

// Create event (Admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, startTime, endTime, location, maxParticipants, imageUrl } = req.body

    const event = new WellnessEvent({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      maxParticipants,
      imageUrl,
      organizer: req.user._id,
    })

    await event.save()
    await event.populate("organizer", "name")

    res.status(201).json({
      message: "Event created successfully",
      event,
    })
  } catch (error) {
    console.error("Create event error:", error)
    res.status(500).json({ message: "Server error while creating event." })
  }
}

// Update event (Admin)
const updateEvent = async (req, res) => {
  try {
    const { title, description, category, date, startTime, endTime, location, maxParticipants, imageUrl, isActive } =
      req.body

    const event = await WellnessEvent.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found." })
    }

    event.title = title || event.title
    event.description = description || event.description
    event.category = category || event.category
    event.date = date || event.date
    event.startTime = startTime || event.startTime
    event.endTime = endTime || event.endTime
    event.location = location || event.location
    event.maxParticipants = maxParticipants !== undefined ? maxParticipants : event.maxParticipants
    event.imageUrl = imageUrl !== undefined ? imageUrl : event.imageUrl
    event.isActive = isActive !== undefined ? isActive : event.isActive

    await event.save()
    await event.populate("organizer", "name")

    res.json({
      message: "Event updated successfully",
      event,
    })
  } catch (error) {
    console.error("Update event error:", error)
    res.status(500).json({ message: "Server error while updating event." })
  }
}

// Delete event (Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await WellnessEvent.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found." })
    }

    await WellnessEvent.findByIdAndDelete(req.params.id)

    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Delete event error:", error)
    res.status(500).json({ message: "Server error while deleting event." })
  }
}

// Register for event (Employee)
const registerForEvent = async (req, res) => {
  try {
    const event = await WellnessEvent.findById(req.params.id)
    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found." })
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: "Cannot register for past events." })
    }

    // Check if user is already registered
    const existingRegistration = event.registrations.find(
      (reg) => reg.user.toString() === req.user._id.toString() && reg.status === "Registered",
    )

    if (existingRegistration) {
      return res.status(400).json({ message: "You are already registered for this event." })
    }

    // Check if event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full." })
    }

    // Add registration
    event.registrations.push({
      user: req.user._id,
      status: "Registered",
    })

    await event.save()

    res.json({
      message: "Successfully registered for event",
      event,
    })
  } catch (error) {
    console.error("Register for event error:", error)
    res.status(500).json({ message: "Server error while registering for event." })
  }
}

// Unregister from event (Employee)
const unregisterFromEvent = async (req, res) => {
  try {
    const event = await WellnessEvent.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found." })
    }

    // Find and update registration
    const registration = event.registrations.find(
      (reg) => reg.user.toString() === req.user._id.toString() && reg.status === "Registered",
    )

    if (!registration) {
      return res.status(400).json({ message: "You are not registered for this event." })
    }

    registration.status = "Cancelled"
    await event.save()

    res.json({
      message: "Successfully unregistered from event",
      event,
    })
  } catch (error) {
    console.error("Unregister from event error:", error)
    res.status(500).json({ message: "Server error while unregistering from event." })
  }
}

// Get user's registered events
const getMyEvents = async (req, res) => {
  try {
    const events = await WellnessEvent.find({
      "registrations.user": req.user._id,
      "registrations.status": "Registered",
      isActive: true,
    })
      .populate("organizer", "name")
      .sort({ date: 1 })

    res.json(events)
  } catch (error) {
    console.error("Get my events error:", error)
    res.status(500).json({ message: "Server error while fetching your events." })
  }
}

module.exports = {
  // Articles
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,

  // Events
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents,
}
