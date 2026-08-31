const LearningPath = require('../models/LearningPath');
const Profile = require('../models/Profile');
const UserProgress = require('../models/UserProgress');
const { generatePersonalizedRoadmap, generateAdaptiveRemediation } = require('../services/recommendationEngine');
const { getOrGenerateAssessment, gradeAssessment } = require('../services/assessmentService');

// @desc Get personalized learning path for current user
// @route GET /api/roadmap
const getRoadmap = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile || !profile.learningGoal) {
      return res.json({
        hasRoadmap: false,
        learningGoal: null,
        message: 'Choose a learning goal to generate your personalized path.',
        nodes: []
      });
    }

    const currentGoal = profile.learningGoal;
    let userPath = await LearningPath.findOne({ user: req.user._id });

    // CRITICAL: Detect stale learning path where goal doesn't match
    const isStale = !userPath || 
                    userPath.learningGoal !== currentGoal || 
                    userPath.generatedForGoal !== currentGoal ||
                    !userPath.nodes || 
                    userPath.nodes.length === 0;

    if (isStale) {
      console.log(`[RoadmapEngine] Generating fresh path for user goal: "${currentGoal}" (replacing stale path)`);
      const generatedNodes = generatePersonalizedRoadmap(profile);

      await LearningPath.deleteMany({ user: req.user._id });

      userPath = await LearningPath.create({
        user: req.user._id,
        learningGoal: currentGoal,
        generatedForGoal: currentGoal,
        goalVersion: (userPath?.goalVersion || 0) + 1,
        description: `Personalized learning path for ${currentGoal}`,
        nodes: generatedNodes
      });

      // Reset progress for the new goal
      await UserProgress.findOneAndUpdate(
        { user: req.user._id },
        { completedNodes: [], customRemediationNodes: [] },
        { upsert: true }
      );
    }

    let progress = await UserProgress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await UserProgress.create({
        user: req.user._id,
        completedNodes: []
      });
    }

    const completedSet = new Set(progress.completedNodes || []);

    const allNodes = [...(userPath.nodes || [])];
    if (progress.customRemediationNodes && progress.customRemediationNodes.length > 0) {
      progress.customRemediationNodes.forEach(remedNode => {
        const parentIdx = allNodes.findIndex(n => n.id === remedNode.parentTopicId);
        if (parentIdx !== -1) {
          allNodes.splice(parentIdx + 1, 0, remedNode);
        } else {
          allNodes.push(remedNode);
        }
      });
    }

    const nodesWithStatus = allNodes.map(node => {
      const isCompleted = completedSet.has(node.id);
      const prereqs = node.prerequisites || [];
      const isLocked = prereqs.length > 0 && !prereqs.every(p => completedSet.has(p));

      return {
        ...node.toObject ? node.toObject() : node,
        isCompleted,
        isLocked,
        status: isCompleted ? 'Completed' : (isLocked ? 'Locked' : 'Available')
      };
    });

    // Find current node (first non-completed, non-locked)
    const currentNode = nodesWithStatus.find(n => !n.isCompleted && !n.isLocked);
    const completedCount = nodesWithStatus.filter(n => n.isCompleted).length;
    const progressPercentage = Math.round((completedCount / Math.max(1, nodesWithStatus.length)) * 100);

    res.json({
      hasRoadmap: true,
      learningGoal: userPath.learningGoal,
      generatedForGoal: userPath.generatedForGoal,
      goalVersion: userPath.goalVersion || 1,
      description: userPath.description,
      nodes: nodesWithStatus,
      totalNodes: nodesWithStatus.length,
      completedNodesCount: completedCount,
      progressPercentage,
      currentNodeId: currentNode?.id || null,
      weeklyLearningHours: profile.weeklyLearningHours || 10
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ message: error.message });
  }
};

const { generateModuleDetails } = require('../services/moduleDetailsService');

// @desc Get details for a specific roadmap topic/node with dedicated 15-question assessment
// @route GET /api/roadmap/topic/:topicId or /api/learning-path/modules/:moduleId
const getTopicDetails = async (req, res) => {
  try {
    const targetId = req.params.topicId || req.params.moduleId || req.params.id;
    const userPath = await LearningPath.findOne({ user: req.user._id });
    const profile = await Profile.findOne({ user: req.user._id });

    if (!userPath) {
      return res.status(404).json({ success: false, message: 'Learning path not found for this user.' });
    }

    const progress = await UserProgress.findOne({ user: req.user._id });
    const completedSet = new Set(progress?.completedNodes || []);

    const pathNodes = userPath.nodes || [];
    const remediationNodes = progress?.customRemediationNodes || [];

    // Find node matching targetId (by id, _id, or case-insensitive match)
    let nodeIndex = pathNodes.findIndex(n => 
      n.id === targetId || 
      String(n._id) === String(targetId) ||
      (n.id && n.id.toLowerCase() === targetId.toLowerCase())
    );

    let node = nodeIndex !== -1 ? pathNodes[nodeIndex] : null;

    if (!node) {
      node = remediationNodes.find(n => 
        n.id === targetId || 
        String(n._id) === String(targetId) ||
        (n.id && n.id.toLowerCase() === targetId.toLowerCase())
      );
    }

    if (!node) {
      return res.status(404).json({ 
        success: false, 
        message: `Module "${targetId}" not found in your personalized learning path.` 
      });
    }

    // Determine lock status and previous prerequisite node
    let isLocked = false;
    let previousNode = null;
    if (nodeIndex > 0) {
      const prev = pathNodes[nodeIndex - 1];
      if (!completedSet.has(prev.id)) {
        isLocked = true;
        previousNode = {
          id: prev.id,
          title: prev.topic,
          difficulty: prev.difficulty
        };
      }
    }

    // Determine user's skill level vs target level
    const userSkills = profile?.skills || [];
    const matchedSkill = userSkills.find(s => 
      (node.relatedSkills || []).some(rs => rs.toLowerCase() === s.skillName.toLowerCase()) ||
      node.topic.toLowerCase().includes(s.skillName.toLowerCase())
    );

    const currentLevel = matchedSkill?.level || 'Beginner';
    const targetLevel = node.difficulty || 'Intermediate';

    // Generate rich, structured module learning guide
    const learningGuide = await generateModuleDetails({
      targetGoal: profile?.learningGoal || userPath.learningGoal,
      moduleName: node.topic,
      moduleCategory: node.category || 'Core',
      moduleDifficulty: targetLevel,
      whyRecommended: node.whyRecommended,
      estimatedHours: node.estimatedHours || 6,
      userCurrentLevel: currentLevel,
      userSkills
    });

    // Retrieve user study progress for this module
    const userStudy = (progress?.moduleStudyProgress || []).find(msp => 
      msp.moduleId === node.id || msp.moduleId === targetId
    ) || {
      completedTopics: [],
      completedPracticeTasks: []
    };

    // Fetch or generate dedicated 15-question assessment for this module with rotation
    const assessmentData = await getOrGenerateAssessment({
      userId: req.user._id,
      skillName: node.topic,
      moduleId: node.id,
      learningPathNodeId: node.id,
      userCurrentLevel: currentLevel
    });

    const isCompleted = completedSet.has(node.id);

    const moduleData = {
      id: node.id,
      moduleId: node.id,
      title: node.topic,
      topic: node.topic,
      category: node.category || 'Core',
      difficulty: targetLevel,
      estimatedHours: learningGuide.estimatedHours,
      overview: learningGuide.overview,
      whyInPath: learningGuide.whyInPath,
      currentLevel: learningGuide.currentLevel,
      targetLevel: learningGuide.targetLevel,
      currentScore: learningGuide.currentScore,
      targetScore: learningGuide.targetScore,
      skillGapPercentage: learningGuide.skillGapPercentage,
      whatYouWillLearn: learningGuide.whatYouWillLearn,
      topicsToCover: learningGuide.topicsToCover,
      learningObjectives: learningGuide.learningObjectives,
      recommendedStudyOrder: learningGuide.recommendedStudyOrder,
      resources: learningGuide.resources.length > 0 ? learningGuide.resources : (node.resources || []),
      practiceTasks: learningGuide.practiceTasks,
      completedStudyTopics: userStudy.completedTopics || [],
      completedPracticeTasks: userStudy.completedPracticeTasks || [],
      quiz: assessmentData.questions,
      totalQuestions: assessmentData.questions.length,
      attemptNumber: assessmentData.attemptNumber,
      difficultyDistribution: assessmentData.difficultyDistribution,
      previousAttempts: assessmentData.previousAttempts,
      bestScore: assessmentData.bestScore
    };

    res.json({
      success: true,
      isCompleted,
      isLocked,
      previousNode,
      topic: moduleData,
      module: moduleData
    });
  } catch (error) {
    console.error('Get topic details error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user's study checklist & practice task progress for a module
// @route POST /api/roadmap/topic/:topicId/progress
const updateTopicProgress = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { completedTopics, completedPracticeTasks } = req.body;

    let progress = await UserProgress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await UserProgress.create({ user: req.user._id, completedNodes: [] });
    }

    if (!progress.moduleStudyProgress) {
      progress.moduleStudyProgress = [];
    }

    let moduleEntry = progress.moduleStudyProgress.find(msp => msp.moduleId === topicId);
    if (moduleEntry) {
      if (completedTopics !== undefined) moduleEntry.completedTopics = completedTopics;
      if (completedPracticeTasks !== undefined) moduleEntry.completedPracticeTasks = completedPracticeTasks;
      moduleEntry.updatedAt = Date.now();
    } else {
      progress.moduleStudyProgress.push({
        moduleId: topicId,
        completedTopics: completedTopics || [],
        completedPracticeTasks: completedPracticeTasks || [],
        updatedAt: Date.now()
      });
    }

    await progress.save();

    res.json({
      success: true,
      message: 'Topic study progress saved.',
      completedTopics: completedTopics || [],
      completedPracticeTasks: completedPracticeTasks || []
    });
  } catch (error) {
    console.error('Update topic progress error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark a node as completed
// @route POST /api/roadmap/complete/:nodeId
const completeNode = async (req, res) => {
  try {
    const { nodeId } = req.params;
    let progress = await UserProgress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await UserProgress.create({ user: req.user._id, completedNodes: [] });
    }

    if (!progress.completedNodes.includes(nodeId)) {
      progress.completedNodes.push(nodeId);
      await progress.save();
    }

    // Update learning path progress
    const userPath = await LearningPath.findOne({ user: req.user._id });
    if (userPath) {
      const totalNodes = userPath.nodes.length;
      const completedCount = progress.completedNodes.length;
      userPath.overallProgress = Math.round((completedCount / Math.max(1, totalNodes)) * 100);
      userPath.currentNodeId = nodeId;
      userPath.updatedAt = Date.now();
      await userPath.save();
    }

    res.json({ message: 'Node completed', completedNodes: progress.completedNodes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Submit quiz and handle adaptive remediation & proficiency updates
// @route POST /api/roadmap/quiz/submit and POST /api/roadmap/quiz/:nodeId
const submitQuiz = async (req, res) => {
  try {
    const nodeId = req.params.nodeId || req.body.topicId || req.body.nodeId;
    const { answers, questions: clientQuestions } = req.body;

    const userPath = await LearningPath.findOne({ user: req.user._id });
    if (!userPath) return res.status(404).json({ message: 'Learning path not found.' });

    let node = (userPath.nodes || []).find(n => n.id === nodeId);
    if (!node) {
      const progress = await UserProgress.findOne({ user: req.user._id });
      node = progress?.customRemediationNodes?.find(n => n.id === nodeId);
    }

    const topicTitle = node?.topic || req.body.topicName || 'Module Assessment';

    // Grade using centralized assessment service
    const grading = await gradeAssessment({
      userId: req.user._id,
      skillName: topicTitle,
      moduleId: nodeId,
      learningPathNodeId: nodeId,
      answers: answers || {},
      clientQuestions: clientQuestions || []
    });

    const passed = grading.passed;

    let remediationInserted = false;
    let progress = await UserProgress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await UserProgress.create({ user: req.user._id, completedNodes: [] });
    }

    if (passed) {
      // Mark as completed if not already marked
      if (!progress.completedNodes.includes(nodeId)) {
        progress.completedNodes.push(nodeId);
        await progress.save();
      }

      // Update path progress
      const totalNodes = userPath.nodes.length;
      const completedCount = progress.completedNodes.length;
      userPath.overallProgress = Math.round((completedCount / Math.max(1, totalNodes)) * 100);
      userPath.currentNodeId = nodeId;
      userPath.updatedAt = Date.now();
      await userPath.save();
    } else {
      // Adaptive remediation
      const weakAreas = (grading.weakTopics && grading.weakTopics.length > 0)
        ? grading.weakTopics.slice(0, 3)
        : [`${topicTitle} Foundations`];

      const remediationNodes = generateAdaptiveRemediation(nodeId, topicTitle, weakAreas);
      progress.customRemediationNodes = [
        ...(progress.customRemediationNodes || []),
        ...remediationNodes
      ];
      await progress.save();
      remediationInserted = true;
    }

    res.json({
      score: grading.scorePercentage,
      scorePercentage: grading.scorePercentage,
      correctAnswers: grading.correctAnswers,
      totalQuestions: grading.totalQuestions,
      passed,
      proficiencyLevel: grading.proficiencyLevel,
      strongTopics: grading.strongTopics,
      weakTopics: grading.weakTopics,
      results: grading.gradedQuestions,
      gradedQuestions: grading.gradedQuestions,
      remediationInserted,
      message: grading.message
    });
  } catch (error) {
    console.error('Submit topic quiz error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Manually regenerate learning path using latest user skills, assessments, and learning goal
// @route POST /api/roadmap/regenerate
const regenerateRoadmap = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile || !profile.learningGoal) {
      return res.status(400).json({ message: 'Set a learning goal first.' });
    }

    const currentGoal = profile.learningGoal;
    const personalizedNodes = generatePersonalizedRoadmap(profile);

    const oldPath = await LearningPath.findOne({ user: req.user._id });
    const nextVersion = (oldPath?.goalVersion || 0) + 1;

    await LearningPath.deleteMany({ user: req.user._id });

    const userPath = await LearningPath.create({
      user: req.user._id,
      learningGoal: currentGoal,
      generatedForGoal: currentGoal,
      goalVersion: nextVersion,
      description: `Personalized learning path for ${currentGoal}`,
      nodes: personalizedNodes
    });

    // Reset progress
    await UserProgress.findOneAndUpdate(
      { user: req.user._id },
      { completedNodes: [], customRemediationNodes: [] },
      { upsert: true }
    );

    res.json({
      success: true,
      message: `Learning path successfully regenerated for ${currentGoal}.`,
      learningGoal: userPath.learningGoal,
      generatedForGoal: userPath.generatedForGoal,
      goalVersion: userPath.goalVersion,
      nodes: personalizedNodes
    });
  } catch (error) {
    console.error('Regenerate roadmap error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoadmap,
  getTopicDetails,
  updateTopicProgress,
  completeNode,
  submitQuiz,
  regenerateRoadmap
};
