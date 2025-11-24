const mongoose = require("mongoose")
const Leave = require("../models/Leave")
require("dotenv").config()

async function fixExistingLeaves() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")
    const leavesWithoutDays = await Leave.find({
      $or: [{ requestedDays: { $exists: false } }, { requestedDays: null }, { requestedDays: 0 }],
    })

    console.log(`Found ${leavesWithoutDays.length} leaves without requestedDays`)

    // Update each leave
    for (const leave of leavesWithoutDays) {
      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)
      const timeDiff = end.getTime() - start.getTime()
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

      await Leave.findByIdAndUpdate(leave._id, { requestedDays: days })
      console.log(`✅ Updated leave ${leave._id} with ${days} days`)
    }

    console.log("✅ All existing leaves have been updated!")
    process.exit(0)
  } catch (error) {
    console.error("Error fixing leaves:", error)
    process.exit(1)
  }
}

fixExistingLeaves()
