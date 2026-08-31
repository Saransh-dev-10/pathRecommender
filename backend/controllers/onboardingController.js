const pdfParse = require('pdf-parse');
const Profile = require('../models/Profile');
const UserProgress = require('../models/UserProgress');
const LearningPath = require('../models/LearningPath');
const { parseResumeText } = require('../services/aiService');
const { generatePersonalizedRoadmap } = require('../services/recommendationEngine');

// @desc Parse Resume PDF/text to extract skills and experience
// @route POST /api/onboarding/parse-resume
const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF or TXT resume file.' });
    }

    let textContent = '';
    if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
      try {
        const parsedPdf = await pdfParse(req.file.buffer);
        textContent = parsedPdf.text;
      } catch (pdfErr) {
        console.warn("pdf-parse fallback reading buffer as text:", pdfErr.message);
        textContent = req.file.buffer.toString('utf8');
      }
    } else {
      textContent = req.file.buffer.toString('utf8');
    }

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract readable text from uploaded file.' });
    }

    const extractedData = await parseResumeText(textContent);

    res.json({
      message: 'Resume analyzed successfully',
      fileName: req.file.originalname,
      extractedData,
      rawTextLength: textContent.length
    });
  } catch (error) {
    console.error('Parse resume error:', error);
    res.status(500).json({ message: error.message || 'Error processing resume file' });
  }
};

// @desc Complete onboarding and save profile
// @route POST /api/onboarding/complete
const saveOnboardingProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      education,
      experienceLevel,
      skills,
      softSkills,
      interests,
      learningGoal,
      dailyLearningMinutes,
      weeklyLearningHours,
      difficultyPreference,
      theoryVsPractice,
      projectBased,
      projects,
      certifications,
      resumeText,
      resumeFileName
    } = req.body;

    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId });
    }

    profile.education = education || profile.education;
    profile.experienceLevel = experienceLevel || profile.experienceLevel;

    // Validate and canonicalize all submitted skills
    if (skills && Array.isArray(skills)) {
      const validatedSkills = [];
      const seenSkills = new Set();
      const { validateSkill, normalizeSkillName } = require('../services/skillValidationService');

      for (const s of skills) {
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
              status: 'Not Assessed',
              lastUpdated: new Date()
            });
          }
        }
      }
      profile.skills = validatedSkills;
    } else {
      profile.skills = profile.skills || [];
    }

    profile.softSkills = softSkills || profile.softSkills;
    profile.interests = interests || profile.interests;
    profile.learningGoal = learningGoal || profile.learningGoal;
    profile.dailyLearningMinutes = dailyLearningMinutes || profile.dailyLearningMinutes;
    profile.weeklyLearningHours = weeklyLearningHours || profile.weeklyLearningHours;
    profile.difficultyPreference = difficultyPreference || profile.difficultyPreference;
    profile.theoryVsPractice = theoryVsPractice || profile.theoryVsPractice;
    profile.projectBased = projectBased !== undefined ? projectBased : profile.projectBased;
    profile.projects = projects || profile.projects;
    profile.certifications = certifications || profile.certifications;
    if (resumeText) profile.resumeText = resumeText;
    if (resumeFileName) profile.resumeFileName = resumeFileName;
    profile.onboardingCompleted = true;
    profile.updatedAt = Date.now();

    await profile.save();

    // Ensure UserProgress document exists
    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      await UserProgress.create({
        user: userId,
        completedNodes: []
      });
    }

    // Generate personalized learning path if goal is set
    let userPath = null;
    if (profile.learningGoal) {
      const personalizedNodes = generatePersonalizedRoadmap(profile);
      await LearningPath.deleteMany({ user: userId });
      userPath = await LearningPath.create({
        user: userId,
        learningGoal: profile.learningGoal,
        generatedForGoal: profile.learningGoal,
        goalVersion: 1,
        description: `Personalized learning path for ${profile.learningGoal}`,
        nodes: personalizedNodes
      });
    }

    res.json({
      message: 'Onboarding completed successfully',
      profile,
      roadmap: userPath
    });
  } catch (error) {
    console.error('Save onboarding error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { parseResume, saveOnboardingProfile };
