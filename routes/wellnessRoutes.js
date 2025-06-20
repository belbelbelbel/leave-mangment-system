const express = require("express")
const router = express.Router()
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents,
} = require("../controllers/wellnessController")
const auth = require("../middleware/auth")
const { requireAdmin } = require("../middleware/role")

// Article routes
router.get("/articles", auth, getAllArticles)
router.get("/articles/:id", auth, getArticleById)
router.post("/articles", auth, requireAdmin, createArticle)
router.put("/articles/:id", auth, requireAdmin, updateArticle)
router.delete("/articles/:id", auth, requireAdmin, deleteArticle)

// Event routes
router.get("/events", auth, getAllEvents)
router.get("/events/:id", auth, getEventById)
router.post("/events", auth, requireAdmin, createEvent)
router.put("/events/:id", auth, requireAdmin, updateEvent)
router.delete("/events/:id", auth, requireAdmin, deleteEvent)

// Event registration routes (Employee)
router.post("/events/:id/register", auth, registerForEvent)
router.post("/events/:id/unregister", auth, unregisterFromEvent)
router.get("/my-events", auth, getMyEvents)

module.exports = router
