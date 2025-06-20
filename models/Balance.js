const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Sick', 'Vacation', 'Personal'],
        required: true
    },
    balance: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index to ensure unique balance per employee and leave type
balanceSchema.index({ employeeId: 1, leaveType: 1 }, { unique: true });

// Virtual for employee name
balanceSchema.virtual('employeeName', {
    ref: 'User',
    localField: 'employeeId',
    foreignField: '_id',
    justOne: true,
    options: { select: 'name' }
});

// Ensure virtuals are serialized
balanceSchema.set('toJSON', { virtuals: true });
balanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Balance', balanceSchema); 