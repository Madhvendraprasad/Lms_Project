const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Get single course
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.json(course);
});

// Create course (admin assumed)
router.post('/', async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json(course);
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.enrolledCourses.push(req.params.id);
  await user.save();
  res.json({ msg: 'Enrolled' });
});

module.exports = router;
