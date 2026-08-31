const Profile = require('../models/Profile');
const AssessmentResult = require('../models/AssessmentResult');
const { getOrGenerateAssessment, gradeAssessment } = require('../services/assessmentService');

// @desc Get user-tailored assessments matching their actual skills
// @route GET /api/assessments
const getUserAssessments = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const userSkills = profile?.skills || [];

    if (userSkills.length === 0) {
      return res.json({
        hasSkills: false,
        message: 'Add skills to your profile to unlock custom skill assessments.',
        assessments: []
      });
    }

    // Build assessments tailored to each actual skill with >= 15 questions
    const assessments = await Promise.all(
      userSkills.map(async (s) => {
        const assessment = await getOrGenerateAssessment({
          userId: req.user._id,
          skillName: s.skillName,
          userCurrentLevel: s.level || 'Intermediate'
        });

        return {
          ...assessment,
          userCurrentLevel: s.level || 'Intermediate',
          category: s.category || 'Technical'
        };
      })
    );

    res.json({
      hasSkills: true,
      assessments
    });
  } catch (error) {
    console.error('[AssessmentController] getUserAssessments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get a specific assessment for a skill or learning path module
// @route GET /api/assessments/skill/:skillName
const getSkillAssessment = async (req, res) => {
  try {
    const { skillName } = req.params;
    const { moduleId, learningPathNodeId } = req.query;
    const profile = await Profile.findOne({ user: req.user._id });

    const userSkill = (profile?.skills || []).find(
      s => s.skillName.toLowerCase() === skillName.toLowerCase()
    );

    const assessment = await getOrGenerateAssessment({
      userId: req.user._id,
      skillName,
      moduleId,
      learningPathNodeId,
      userCurrentLevel: userSkill?.level || 'Intermediate'
    });

    res.json(assessment);
  } catch (error) {
    console.error('[AssessmentController] getSkillAssessment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Submit assessment, score, save result, and update user skill level in MongoDB
// @route POST /api/assessments/:id/submit
const submitAssessment = async (req, res) => {
  try {
    const { skillName, moduleId, learningPathNodeId, answers, questions: clientQuestions } = req.body;

    if (!skillName) {
      return res.status(400).json({ message: 'Skill name is required for grading.' });
    }

    const gradingResult = await gradeAssessment({
      userId: req.user._id,
      skillName,
      moduleId,
      learningPathNodeId,
      answers: answers || {},
      clientQuestions: clientQuestions || []
    });

    res.json(gradingResult);
  } catch (error) {
    console.error('[AssessmentController] submitAssessment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Retake assessment with a guaranteed new question set
// @route POST /api/assessments/retake
const retakeAssessment = async (req, res) => {
  try {
    const { skillName, moduleId, learningPathNodeId } = req.body;
    if (!skillName) {
      return res.status(400).json({ message: 'Skill name is required to retake assessment.' });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    const userSkill = (profile?.skills || []).find(
      s => s.skillName.toLowerCase() === skillName.toLowerCase()
    );

    const newAttemptAssessment = await getOrGenerateAssessment({
      userId: req.user._id,
      skillName,
      moduleId,
      learningPathNodeId,
      userCurrentLevel: userSkill?.level || 'Intermediate'
    });

    res.json({
      message: `Generated new Question Set (Attempt #${newAttemptAssessment.attemptNumber}) for ${skillName}`,
      assessment: newAttemptAssessment
    });
  } catch (error) {
    console.error('[AssessmentController] retakeAssessment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get attempt history for a specific skill/module
// @route GET /api/assessments/history/:skillName
const getAssessmentHistory = async (req, res) => {
  try {
    const { skillName } = req.params;
    const history = await AssessmentResult.find({
      userId: req.user._id,
      skill: skillName
    }).sort({ completedAt: -1 });

    res.json({
      skillName,
      totalAttempts: history.length,
      history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserAssessments,
  getSkillAssessment,
  submitAssessment,
  retakeAssessment,
  getAssessmentHistory
};
