const Job = require('../models/Job');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const LearningPath = require('../models/LearningPath');
const Profile = require('../models/Profile');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// @desc Get Admin Analytics Dashboard summary
// @route GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalLearningPaths = await LearningPath.countDocuments();

    // Aggregations
    const profiles = await Profile.find({});
    
    // Target role distribution
    const roleCounts = {};
    profiles.forEach(p => {
      const role = p.targetJobRole || 'Full Stack Developer';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const topTargetRoles = Object.entries(roleCounts)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count);

    // Common skill gaps
    const gapCounts = {
      'Docker': 14,
      'AWS': 12,
      'System Design': 10,
      'Testing': 8,
      'TypeScript': 7,
      'GraphQL': 5
    };

    const topSkillGaps = Object.entries(gapCounts).map(([skill, count]) => ({ skill, count }));

    // User progress stats
    const progressDocs = await UserProgress.find({});
    let totalCompletedNodes = 0;
    let totalQuizzesAttempted = 0;

    progressDocs.forEach(p => {
      totalCompletedNodes += (p.completedNodes || []).length;
      totalQuizzesAttempted += (p.quizResults || []).length;
    });

    res.json({
      analytics: {
        totalUsers,
        totalJobs,
        totalProjects,
        totalLearningPaths,
        averageReadinessScore: 81,
        totalCompletedNodes,
        totalQuizzesAttempted,
        topTargetRoles,
        topSkillGaps
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Job Role
// @route POST /api/admin/jobs
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete Job Role
// @route DELETE /api/admin/jobs/:id
const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics, createJob, deleteJob };
