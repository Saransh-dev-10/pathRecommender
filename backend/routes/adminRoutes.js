const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAnalytics, createJob, deleteJob } = require('../controllers/adminController');

router.get('/analytics', protect, adminOnly, getAnalytics);
router.post('/jobs', protect, adminOnly, createJob);
router.delete('/jobs/:id', protect, adminOnly, deleteJob);

module.exports = router;
