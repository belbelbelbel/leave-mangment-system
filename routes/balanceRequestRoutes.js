const express = require("express")
const router = express.Router()
const {
  getAllBalanceRequests,
  updateBalanceRequestStatus,
  getMyBalanceRequests,
} = require("../controllers/balanceRequestController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { requireAdmin } = require("../middleware/role")

// Employee routes
router.get("/my-requests", authMiddleware, getMyBalanceRequests)

// Admin routes
router.get("/all", authMiddleware, requireAdmin, getAllBalanceRequests)
router.put("/update-status/:id", authMiddleware, requireAdmin, updateBalanceRequestStatus)

module.exports = router
