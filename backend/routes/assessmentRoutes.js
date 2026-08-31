const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserAssessments,
  getSkillAssessment,
  submitAssessment,
  retakeAssessment,
  getAssessmentHistory
} = require('../controllers/assessmentController');

router.get('/', protect, getUserAssessments);
router.get('/skill/:skillName', protect, getSkillAssessment);
router.get('/history/:skillName', protect, getAssessmentHistory);
router.post('/retake', protect, retakeAssessment);
router.post('/:id/submit', protect, submitAssessment);
router.post('/submit', protect, submitAssessment);

module.exports = router;
