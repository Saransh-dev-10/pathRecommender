const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProjects, updateProjectStatus } = require('../controllers/projectController');

router.get('/recommendations', protect, getProjects);
router.put('/:projectId/status', protect, updateProjectStatus);

module.exports = router;
