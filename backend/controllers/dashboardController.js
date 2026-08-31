const Profile = require('../models/Profile');
const LearningPath = require('../models/LearningPath');
const UserProgress = require('../models/UserProgress');
const AssessmentResult = require('../models/AssessmentResult');
const { generateSkillGapAnalysis, normalizeSkill, levelToNumber } = require('../services/recommendationEngine');

/**
 * Normalize a skill name for comparison.
 * Reuses the backend normalizeSkill but also handles common aliases.
 */
const normalizeForComparison = (s) => normalizeSkill(s);

/**
 * Convert skill level to a percentage for visualization
 */
const levelToPercentage = (level) => {
  const map = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 95
  };
  if (typeof level === 'string') return map[level] || 0;
  if (typeof level === 'number') return Math.min(100, Math.round(level * 10));
  return 0;
};

// @desc    Get consolidated dashboard data for the authenticated user
// @route   GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all data in parallel
    const [profile, learningPath, userProgress, assessmentResults] = await Promise.all([
      Profile.findOne({ user: userId }),
      LearningPath.findOne({ user: userId }),
      UserProgress.findOne({ user: userId }),
      AssessmentResult.find({ userId }).sort({ completedAt: -1 })
    ]);

    // Handle no profile case
    if (!profile) {
      return res.json({
        hasProfile: false,
        message: 'Complete onboarding to see your dashboard.',
        kpis: null,
        skillProfile: [],
        learningProgress: null,
        skillsToStrengthen: [],
        weeklyActivity: []
      });
    }

    const userSkills = profile.skills || [];
    const learningGoal = profile.learningGoal || null;

    // Check if learning path is stale
    let currentPath = learningPath;
    if (learningGoal && (!currentPath || currentPath.learningGoal !== learningGoal || currentPath.generatedForGoal !== learningGoal)) {
      const { generatePersonalizedRoadmap } = require('../services/recommendationEngine');
      const generatedNodes = generatePersonalizedRoadmap(profile);

      await LearningPath.deleteMany({ user: userId });
      currentPath = await LearningPath.create({
        user: userId,
        learningGoal: learningGoal,
        generatedForGoal: learningGoal,
        goalVersion: (learningPath?.goalVersion || 0) + 1,
        description: `Personalized learning path for ${learningGoal}`,
        nodes: generatedNodes
      });
    }

    // --- Build node status maps ---
    const completedNodeIds = new Set((userProgress?.completedNodes) || []);
    const pathNodes = currentPath?.nodes || [];

    // Build a set of normalized skill names already in the learning path
    const pathSkillsNormalized = new Set();
    pathNodes.forEach(node => {
      pathSkillsNormalized.add(normalizeForComparison(node.topic));
      if (node.relatedSkills) {
        node.relatedSkills.forEach(rs => pathSkillsNormalized.add(normalizeForComparison(rs)));
      }
    });

    // Build a set of normalized user skill names
    const userSkillsNormalized = new Set(
      userSkills.map(s => normalizeForComparison(s.skillName))
    );

    // --- KPIs ---
    const skillsIdentified = userSkills.length;
    const skillsVerified = userSkills.filter(s => s.status === 'Verified').length;

    const completedNodesCount = pathNodes.filter(n => completedNodeIds.has(n.id)).length;
    const totalNodes = pathNodes.length;
    const pathProgressPercentage = totalNodes > 0
      ? Math.round((completedNodesCount / totalNodes) * 100)
      : 0;

    // Skill gap analysis (reuse existing engine)
    const skillAnalysis = generateSkillGapAnalysis(profile);

    // Filter missing skills: remove those already in learning path
    const filteredMissingSkills = (skillAnalysis.missingSkills || []).filter(skill => {
      const normalized = normalizeForComparison(skill);
      return !pathSkillsNormalized.has(normalized);
    });

    const assessmentsCompleted = assessmentResults.length;

    // Learning streak: check weeklyActivity for consecutive days with activity
    const weeklyActivity = userProgress?.weeklyActivity || [];
    let learningStreak = null;
    if (weeklyActivity.length > 0) {
      const activeDays = weeklyActivity.filter(d => d.hoursSpent > 0 || d.nodesCompleted > 0);
      learningStreak = activeDays.length > 0 ? activeDays.length : null;
    }

    const kpis = {
      skillsIdentified,
      skillsVerified,
      pathProgress: {
        completed: completedNodesCount,
        total: totalNodes,
        percentage: pathProgressPercentage
      },
      skillsToStrengthen: filteredMissingSkills.length,
      assessmentsCompleted,
      learningStreak
    };

    // --- Skill Profile (for radar chart and skill cards) ---
    const skillProfile = userSkills.map(s => {
      // Check if this skill has assessment results
      const latestAssessment = assessmentResults.find(
        ar => normalizeForComparison(ar.skill) === normalizeForComparison(s.skillName)
      );

      return {
        skillName: s.skillName,
        category: s.category || 'General',
        level: s.level || 'Not Assessed',
        proficiency: latestAssessment ? latestAssessment.score : levelToPercentage(s.level),
        source: s.source || 'Profile',
        status: s.status || 'Not Assessed',
        isInPath: pathSkillsNormalized.has(normalizeForComparison(s.skillName)),
        assessmentScore: latestAssessment ? latestAssessment.score : null,
        assessmentLevel: latestAssessment ? latestAssessment.proficiencyLevel : null,
        lastUpdated: s.lastUpdated
      };
    });

    // --- Learning Progress ---
    let learningProgress = null;
    if (pathNodes.length > 0) {
      const completedNodes = [];
      const inProgressNodes = [];
      const upcomingNodes = [];

      pathNodes.forEach(node => {
        const isCompleted = completedNodeIds.has(node.id);
        const prereqs = node.prerequisites || [];
        const isLocked = prereqs.length > 0 && !prereqs.every(p => completedNodeIds.has(p));

        const nodeObj = {
          id: node.id,
          topic: node.topic,
          category: node.category,
          difficulty: node.difficulty,
          estimatedHours: node.estimatedHours
        };

        if (isCompleted) {
          completedNodes.push(nodeObj);
        } else if (!isLocked) {
          inProgressNodes.push(nodeObj);
        } else {
          upcomingNodes.push(nodeObj);
        }
      });

      // Current node = first available (not completed, not locked)
      const currentNode = inProgressNodes[0] || null;
      // Next node = second available or first upcoming
      const nextNode = inProgressNodes[1] || upcomingNodes[0] || null;

      learningProgress = {
        completed: completedNodes,
        inProgress: inProgressNodes,
        upcoming: upcomingNodes,
        currentNode,
        nextNode
      };
    }

    // --- Skills to Strengthen (detailed cards) ---
    const skillsToStrengthen = filteredMissingSkills.map(skill => {
      // Determine category and context
      const helpsLearn = [];
      if (normalizeForComparison(skill).includes('database') || 
          normalizeForComparison(skill).includes('sql') ||
          normalizeForComparison(skill).includes('postgre') ||
          normalizeForComparison(skill).includes('mongo')) {
        helpsLearn.push('Database design', 'Data querying', 'Data persistence');
      } else if (normalizeForComparison(skill).includes('docker') ||
                 normalizeForComparison(skill).includes('devops') ||
                 normalizeForComparison(skill).includes('kubernetes')) {
        helpsLearn.push('Containerization', 'Deployment', 'Infrastructure');
      } else if (normalizeForComparison(skill).includes('test')) {
        helpsLearn.push('Code reliability', 'Automated testing', 'Quality assurance');
      } else if (normalizeForComparison(skill).includes('react') ||
                 normalizeForComparison(skill).includes('frontend') ||
                 normalizeForComparison(skill).includes('css') ||
                 normalizeForComparison(skill).includes('html')) {
        helpsLearn.push('UI development', 'Component design', 'User experience');
      } else {
        helpsLearn.push('Software development', 'Problem solving', 'Professional growth');
      }

      return {
        skillName: skill,
        currentLevel: 'Not assessed',
        whyItMatters: `${skill} strengthens your capabilities for your ${learningGoal || 'learning'} path.`,
        helpsLearn,
        isAlreadyInPath: false
      };
    });

    // --- Response ---
    res.json({
      hasProfile: true,
      learningGoal,
      learningGoalDescription: learningPath?.description || null,
      userName: req.user.name,
      kpis,
      skillProfile,
      learningProgress,
      skillsToStrengthen,
      weeklyActivity: weeklyActivity.length > 0 ? weeklyActivity : null,
      assessmentResults: assessmentResults.slice(0, 5).map(ar => ({
        skill: ar.skill,
        score: ar.score,
        proficiencyLevel: ar.proficiencyLevel,
        completedAt: ar.completedAt
      }))
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a skill to the user's learning path (creates a learning node)
// @route   POST /api/dashboard/add-to-path
const addSkillToPath = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skillName } = req.body;

    if (!skillName || !skillName.trim()) {
      return res.status(400).json({ message: 'Skill name is required.' });
    }

    const normalizedInput = normalizeForComparison(skillName);

    // Get user's learning path
    let learningPath = await LearningPath.findOne({ user: userId });
    if (!learningPath) {
      const profile = await Profile.findOne({ user: userId });
      return res.status(400).json({
        message: 'No learning path exists. Please set a learning goal first.',
        alreadyExists: false
      });
    }

    // Check if skill already exists in path (normalized comparison)
    const existsInPath = learningPath.nodes.some(node => {
      if (normalizeForComparison(node.topic) === normalizedInput) return true;
      if (node.relatedSkills && node.relatedSkills.some(rs => normalizeForComparison(rs) === normalizedInput)) return true;
      return false;
    });

    if (existsInPath) {
      return res.json({
        alreadyExists: true,
        message: `${skillName} already exists in your learning path.`
      });
    }

    // Create a new learning node for this skill
    const newNodeId = `added-${normalizedInput}-${Date.now()}`;
    const lastNode = learningPath.nodes[learningPath.nodes.length - 1];

    const newNode = {
      id: newNodeId,
      topic: skillName,
      category: 'Added Skill',
      difficulty: 'Intermediate',
      prerequisites: lastNode ? [lastNode.id] : [],
      whyRecommended: `You identified ${skillName} as a skill to strengthen for your ${learningPath.learningGoal} learning path.`,
      estimatedHours: 5,
      relatedSkills: [normalizedInput],
      resources: [
        { title: `${skillName} — Learning Guide`, url: '#', type: 'Documentation', estimatedMinutes: 45 },
        { title: `${skillName} — Hands-On Practice`, url: '#', type: 'Interactive', estimatedMinutes: 60 }
      ],
      practiceTask: `Build a project or exercise demonstrating ${skillName} concepts.`,
      quiz: [],
      isRemediation: false,
      parentTopicId: null
    };

    learningPath.nodes.push(newNode);
    learningPath.updatedAt = Date.now();
    await learningPath.save();

    // Also add to profile skills if not already there
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      const existsInProfile = profile.skills.some(
        s => normalizeForComparison(s.skillName) === normalizedInput
      );

      if (!existsInProfile) {
        profile.skills.push({
          skillName,
          category: 'General',
          level: 'Beginner',
          source: 'Profile',
          status: 'Not Assessed',
          lastUpdated: Date.now()
        });
        profile.updatedAt = Date.now();
        await profile.save();
      }
    }

    // Return updated skill gap info
    const skillAnalysis = profile ? generateSkillGapAnalysis(profile) : { missingSkills: [] };

    // Re-compute filtered missing skills
    const pathSkillsNormalized = new Set();
    learningPath.nodes.forEach(node => {
      pathSkillsNormalized.add(normalizeForComparison(node.topic));
      if (node.relatedSkills) {
        node.relatedSkills.forEach(rs => pathSkillsNormalized.add(normalizeForComparison(rs)));
      }
    });

    const remainingGaps = (skillAnalysis.missingSkills || []).filter(
      s => !pathSkillsNormalized.has(normalizeForComparison(s))
    );

    res.json({
      alreadyExists: false,
      message: `${skillName} has been added to your learning path.`,
      addedNode: newNode,
      updatedPathLength: learningPath.nodes.length,
      remainingSkillGaps: remainingGaps
    });

  } catch (error) {
    console.error('Add skill to path error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData, addSkillToPath };
