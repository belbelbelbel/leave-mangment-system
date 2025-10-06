const express = require("express")
const serverless = require("serverless-http")

// Simple test function first
const app = express()

app.use(express.json())

// Basic test endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Basic API test working",
    timestamp: new Date().toISOString(),
    env_check: {
      mongodb_uri: process.env.MONGODB_URI ? "exists" : "missing",
      jwt_secret: process.env.JWT_SECRET ? "exists" : "missing"
    }
  })
})

// Simple test auth endpoint
app.post("/auth/test", (req, res) => {
  res.json({ 
    message: "Auth route test working",
    body: req.body,
    env_vars: {
      mongodb_uri_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      jwt_secret_length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
    }
  })
})

module.exports = serverless(app)