// models/LeaveRequest.js
const mongoose = require("mongoose")

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Sick", "Vacation", "Personal"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    requestedDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    document: {
      type: String,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for employee name
leaveSchema.virtual("employeeName", {
  ref: "User",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
  options: { select: "name" },
})

// Ensure virtuals are serialized
leaveSchema.set("toJSON", { virtuals: true })
leaveSchema.set("toObject", { virtuals: true })

// Index for better query performance
leaveSchema.index({ employeeId: 1, status: 1 })
leaveSchema.index({ startDate: 1, endDate: 1 })

module.exports = mongoose.model("Leave", leaveSchema)
