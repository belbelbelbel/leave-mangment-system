const express = require("express")
const router = express.Router()
const {
  getMyBalance,
  getAllBalances,
  updateBalance,
  requestBalanceIncrease,
  getBalanceWithUsage,
} = require("../controllers/balanceController")
const auth = require("../middleware/auth")
const { requireAdmin } = require("../middleware/role")

// Employee routes
router.get("/", auth, getMyBalance)
router.get("/with-usage", auth, getBalanceWithUsage)
router.post("/request-increase", auth, requestBalanceIncrease)

// Admin routes
router.get("/all", auth, requireAdmin, getAllBalances)
router.put("/update/:employeeId", auth, requireAdmin, updateBalance)

module.exports = router
