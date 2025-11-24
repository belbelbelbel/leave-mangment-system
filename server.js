const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "frontend")))

// Database connection
const connectDB = require("./config/db")
// Connect to database (non-blocking - server will start even if DB fails initially)
connectDB().catch((err) => {
  console.error("Initial database connection failed, but server will continue:", err.message)
  console.log("Note: Database operations will fail until connection is established")
})

// Routes
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const leaveRoutes = require("./routes/leaveRoutes")
const balanceRoutes = require("./routes/balanceRoutes")
const balanceRequestRoutes = require("./routes/balanceRequestRoutes")
const noticeRoutes = require("./routes/noticeRoutes")
const adminRoutes = require("./routes/adminRoutes")
const wellnessRoutes = require("./routes/wellnessRoutes")

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/leaves", leaveRoutes)
app.use("/api/balances", balanceRoutes)
app.use("/api/balance-requests", balanceRequestRoutes)
app.use("/api/notices", noticeRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/wellness", wellnessRoutes)

// Serve frontend - root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
