const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Please provide a question'],
    trim: true,
    maxlength: [500, 'Question cannot be more than 500 characters']
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  studentTag: {
    type: String,
    required: true,
    description: 'Anonymous identifier like "Student 1", "Student 2"'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: String,
    description: 'Array of student tags who upvoted'
  }],
  status: {
    type: String,
    enum: ['pending', 'answered', 'rejected'],
    default: 'pending',
    description: 'pending: awaiting action, answered: marked as answered, rejected: hidden'
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportedBy: [{
    type: String,
    description: 'Array of student tags who reported'
  }],
  reportCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date
  }
});

// Index for faster queries
questionSchema.index({ room: 1, createdAt: -1 });
questionSchema.index({ room: 1, upvotes: -1 });

module.exports = mongoose.model('Question', questionSchema);
