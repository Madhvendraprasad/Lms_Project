const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Progress = require('../models/Progress');

// Mark lesson completed
router.post('/lesson', auth, async (req, res) => {
  const { courseId, lessonIndex } = req.body;
  let progress = await Progress.findOne({ user: req.user.id, course: courseId });

  if (!progress) {
    progress = new Progress({ user: req.user.id, course: courseId, completedLessons: [] });
  }

  if (!progress.completedLessons.includes(lessonIndex))
    progress.completedLessons.push(lessonIndex);

  await progress.save();
  res.json(progress);
});

// Submit quiz
router.post('/quiz', auth, async (req, res) => {
  const { courseId, quizIndex, score } = req.body;
  let progress = await Progress.findOne({ user: req.user.id, course: courseId });

  if (!progress) {
    progress = new Progress({ user: req.user.id, course: courseId, quizAttempts: [] });
  }

  progress.quizAttempts.push({ quizIndex, score });
  await progress.save();
  res.json(progress);
});

// Get progress
router.get('/:courseId', auth, async (req, res) => {
  const progress = await Progress.findOne({ user: req.user.id, course: req.params.courseId });
  res.json(progress);
});

module.exports = router;
