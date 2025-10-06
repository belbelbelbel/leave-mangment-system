const express = require("express")
const serverless = require("serverless-http")

const app = express()
app.use(express.json())
app.get("/", (req, res) => {
  try {
    res.json({
      message: "Basic API test - Step 1",
      timestamp: new Date().toISOString(),
      status: "Working",
      environment_check: {
        mongodb_uri: process.env.MONGODB_URI ? "exists" : "missing",
        jwt_secret: process.env.JWT_SECRET ? "exists" : "missing",
        mongodb_uri_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
        jwt_secret_length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


app.post("/auth/test", (req, res) => {
  try {
    res.json({
      message: "Auth route test working - Step 2",
      body: req.body,
      env_status: {
        mongodb_uri: process.env.MONGODB_URI ? "Set" : "Missing",
        jwt_secret: process.env.JWT_SECRET ? "Set" : "Missing"
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Test if we can import models without connecting to database
app.get("/test-models", (req, res) => {
  try {
    // Try importing a model
    const User = require("../models/User")
    res.json({
      message: "Model import test working - Step 3",
      user_model: User ? "imported successfully" : "failed to import"
    })
  } catch (error) {
    res.status(500).json({
      message: "Model import failed - Step 3",
      error: error.message
    })
  }
})

// Export the serverless function
module.exports = serverless(app)