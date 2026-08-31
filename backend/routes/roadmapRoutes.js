const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRoadmap,
  getTopicDetails,
  updateTopicProgress,
  completeNode,
  submitQuiz,
  regenerateRoadmap
} = require('../controllers/roadmapController');

router.get('/', protect, getRoadmap);
router.get('/topic/:topicId', protect, getTopicDetails);
router.get('/module/:topicId', protect, getTopicDetails);
router.get('/modules/:topicId', protect, getTopicDetails);
router.post('/topic/:topicId/progress', protect, updateTopicProgress);
router.post('/module/:topicId/progress', protect, updateTopicProgress);
router.post('/modules/:topicId/progress', protect, updateTopicProgress);
router.post('/complete/:nodeId', protect, completeNode);
router.post('/quiz/submit', protect, submitQuiz);
router.post('/quiz/:nodeId', protect, submitQuiz);
router.post('/regenerate', protect, regenerateRoadmap);

module.exports = router;
