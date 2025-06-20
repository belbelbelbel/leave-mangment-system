const mongoose = require("mongoose")

const wellnessEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Workshop", "Fitness", "Mental Health", "Team Building", "Nutrition", "Wellness Challenge"],
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    maxParticipants: {
      type: Number,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registrations: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["Registered", "Cancelled", "Attended"],
          default: "Registered",
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for current participants count
wellnessEventSchema.virtual("currentParticipants").get(function () {
  return this.registrations.filter((reg) => reg.status === "Registered").length
})

// Ensure virtual fields are serialized
wellnessEventSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("WellnessEvent", wellnessEventSchema)
