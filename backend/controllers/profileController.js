const Profile = require('../models/Profile');
const { generateSkillGapAnalysis } = require('../services/recommendationEngine');

// @desc Get current user profile and skill analysis
// @route GET /api/profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email avatar role');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please complete onboarding.' });
    }

    const skillAnalysis = generateSkillGapAnalysis(profile);

    res.json({
      profile,
      skillAnalysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile details
// @route PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const fieldsToUpdate = [
      'education', 'experienceLevel', 'skills', 'softSkills', 'interests',
      'learningGoal', 'dailyLearningMinutes', 'weeklyLearningHours',
      'difficultyPreference', 'theoryVsPractice', 'projectBased',
      'projects', 'certifications'
    ];

    // If skills are provided, validate and canonicalize each skill entry
    if (req.body.skills && Array.isArray(req.body.skills)) {
      const validatedSkills = [];
      const seenSkills = new Set();
      const { validateSkill, normalizeSkillName } = require('../services/skillValidationService');

      for (const s of req.body.skills) {
        const rawName = typeof s === 'string' ? s : s.skillName;
        if (!rawName || !rawName.trim()) continue;

        const val = await validateSkill(rawName);
        if (val.isValid && val.canonicalName) {
          const norm = normalizeSkillName(val.canonicalName);
          if (!seenSkills.has(norm)) {
            seenSkills.add(norm);
            validatedSkills.push({
              skillName: val.canonicalName,
              category: val.category || (typeof s === 'object' ? s.category : 'General') || 'General',
              level: (typeof s === 'object' && s.level) ? s.level : 'Intermediate',
              experienceYears: (typeof s === 'object' && s.experienceYears) ? s.experienceYears : 0,
              source: (typeof s === 'object' && s.source) ? s.source : 'Profile',
              status: (typeof s === 'object' && s.status) ? s.status : 'Not Assessed',
              lastUpdated: (typeof s === 'object' && s.lastUpdated) ? s.lastUpdated : new Date()
            });
          }
        }
      }
      profile.skills = validatedSkills;
    }

    const oldGoal = profile.learningGoal;

    fieldsToUpdate.forEach(field => {
      if (field !== 'skills' && req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    profile.updatedAt = Date.now();
    await profile.save();

    // CRITICAL: If learning goal changed, automatically invalidate & regenerate learning path
    const LearningPath = require('../models/LearningPath');
    const UserProgress = require('../models/UserProgress');
    const { generatePersonalizedRoadmap } = require('../services/recommendationEngine');

    if (profile.learningGoal && profile.learningGoal !== oldGoal) {
      console.log(`[ProfileUpdate] Learning goal changed from "${oldGoal}" to "${profile.learningGoal}". Regenerating roadmap...`);
      const newNodes = generatePersonalizedRoadmap(profile);

      await LearningPath.deleteMany({ user: req.user._id });
      await LearningPath.create({
        user: req.user._id,
        learningGoal: profile.learningGoal,
        generatedForGoal: profile.learningGoal,
        goalVersion: 1,
        description: `Personalized learning path for ${profile.learningGoal}`,
        nodes: newNodes
      });

      await UserProgress.findOneAndUpdate(
        { user: req.user._id },
        { completedNodes: [], customRemediationNodes: [] },
        { upsert: true }
      );
    }

    const skillAnalysis = generateSkillGapAnalysis(profile);

    res.json({
      message: 'Profile updated successfully',
      profile,
      skillAnalysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
