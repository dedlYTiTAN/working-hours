const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clockInTime: {
    type: Date,
    required: true
  },
  clockOutTime: {
    type: Date,
    default: null
  },
  totalHours: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  }
}, {
  timestamps: true
});

// Calculate total hours when clock out time is set
shiftSchema.pre('save', function(next) {
  if (this.clockOutTime && this.clockInTime) {
    const diffInMs = this.clockOutTime - this.clockInTime;
    this.totalHours = Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
    this.isActive = false;
  }
  next();
});

// Index for efficient queries
shiftSchema.index({ userId: 1, date: -1 });
shiftSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Shift', shiftSchema);
