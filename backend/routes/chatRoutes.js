const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

router.post('/', protect, sendMessage);
router.get('/history', protect, getChatHistory);

module.exports = router;
