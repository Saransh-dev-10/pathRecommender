const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardData, addSkillToPath } = require('../controllers/dashboardController');

router.get('/', protect, getDashboardData);
router.post('/add-to-path', protect, addSkillToPath);

module.exports = router;
