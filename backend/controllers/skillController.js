const Profile = require('../models/Profile');
const { searchSkills, validateSkill, normalizeSkillName, levelToProficiencyScore } = require('../services/skillValidationService');
const { generateSkillGapAnalysis } = require('../services/recommendationEngine');

// @desc Search recognized skills taxonomy for autocomplete
// @route GET /api/skills/search
const searchSkillTaxonomy = async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit, 10) || 12;
    const results = await searchSkills(query, limit);
    res.json({ success: true, skills: results });
  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Validate a skill without saving
// @route POST /api/skills/validate
const checkSkillValidity = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill || !skill.trim()) {
      return res.status(400).json({ success: false, isValid: false, message: 'Please provide a skill name.' });
    }

    const validation = await validateSkill(skill);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        isValid: false,
        message: validation.message || 'Please select a valid recognized skill.'
      });
    }

    res.json({
      success: true,
      isValid: true,
      canonicalName: validation.canonicalName,
      category: validation.category,
      source: validation.source
    });
  } catch (error) {
    console.error('Validate skill error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add a validated skill with proficiency to authenticated user's profile
// @route POST /api/skills
const addManualSkill = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skill, level = 'Intermediate' } = req.body;

    if (!skill || typeof skill !== 'string' || !skill.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid skill name.'
      });
    }

    // 1. Strict Validation against taxonomy and AI
    const validation = await validateSkill(skill.trim());
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message || 'Please select a valid recognized skill.'
      });
    }

    const canonicalName = validation.canonicalName;
    const category = validation.category || 'General';

    // 2. Fetch User Profile
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId, skills: [] });
    }

    // 3. Duplicate Prevention via normalized comparison
    const normCanonical = normalizeSkillName(canonicalName);
    const alreadyExists = (profile.skills || []).some(
      s => normalizeSkillName(s.skillName) === normCanonical
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        alreadyExists: true,
        message: `${canonicalName} is already in your skills.`
      });
    }

    // 4. Map user-selected level & proficiency
    let assignedLevel = level;
    let initialStatus = 'Not Assessed';

    if (level === 'Not sure' || level === 'Not Assessed') {
      assignedLevel = 'Beginner';
      initialStatus = 'Not Assessed';
    }

    const newSkillEntry = {
      skillName: canonicalName,
      category: category,
      level: assignedLevel,
      source: 'Profile',
      status: initialStatus,
      lastUpdated: new Date()
    };

    profile.skills.push(newSkillEntry);
    profile.updatedAt = Date.now();
    await profile.save();

    // 5. Recalculate skill gap analysis
    const skillAnalysis = generateSkillGapAnalysis(profile);

    res.status(201).json({
      success: true,
      message: `Successfully added ${canonicalName} to your skills profile.`,
      skill: newSkillEntry,
      skills: profile.skills,
      skillAnalysis
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Remove a skill from authenticated user's profile
// @route DELETE /api/skills/:skillName
const removeSkill = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skillName } = req.params;

    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    const normTarget = normalizeSkillName(decodeURIComponent(skillName));
    profile.skills = (profile.skills || []).filter(
      s => normalizeSkillName(s.skillName) !== normTarget
    );

    profile.updatedAt = Date.now();
    await profile.save();

    const skillAnalysis = generateSkillGapAnalysis(profile);

    res.json({
      success: true,
      message: `Skill removed successfully.`,
      skills: profile.skills,
      skillAnalysis
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchSkillTaxonomy,
  checkSkillValidity,
  addManualSkill,
  removeSkill
};
