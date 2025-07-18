const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  completedLessons: [Number],
  quizAttempts: [{
    quizIndex: Number,
    score: Number,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Progress', progressSchema);
