const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
noticeSchema.index({ postedDate: -1 });
noticeSchema.index({ isActive: 1 });

// Virtual for poster name
noticeSchema.virtual('posterName', {
  ref: 'User',
  localField: 'postedBy',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name' }
});

// Ensure virtuals are serialized
noticeSchema.set('toJSON', { virtuals: true });
noticeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Notice', noticeSchema);
