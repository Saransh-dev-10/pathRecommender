const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { parseResume, saveOnboardingProfile } = require('../controllers/onboardingController');

router.post('/parse-resume', protect, upload.single('resume'), parseResume);
router.post('/complete', protect, saveOnboardingProfile);

module.exports = router;
