const express = require("express")
const router = express.Router()
const { getDashboardStats, getRecentActivities } = require("../controllers/adminController")
const auth = require("../middleware/auth")
const { requireAdmin } = require("../middleware/role")

router.get("/stats", auth, requireAdmin, getDashboardStats)
router.get("/activities", auth, requireAdmin, getRecentActivities)

module.exports = router
