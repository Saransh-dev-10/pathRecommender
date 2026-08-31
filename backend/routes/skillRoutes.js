const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchSkillTaxonomy,
  checkSkillValidity,
  addManualSkill,
  removeSkill
} = require('../controllers/skillController');

// Search is accessible to help autocomplete
router.get('/search', searchSkillTaxonomy);

// Skill validation endpoint
router.post('/validate', checkSkillValidity);

// Protected skill modifications
router.post('/', protect, addManualSkill);
router.delete('/:skillName', protect, removeSkill);

module.exports = router;
