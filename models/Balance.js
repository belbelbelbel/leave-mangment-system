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


balanceSchema.index({ employeeId: 1, leaveType: 1 }, { unique: true });

balanceSchema.virtual('employeeName', {
    ref: 'User',
    localField: 'employeeId',
    foreignField: '_id',
    justOne: true,
    options: { select: 'name' }
});


balanceSchema.set('toJSON', { virtuals: true });
balanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Balance', balanceSchema); 