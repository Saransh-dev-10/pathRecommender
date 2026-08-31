const Project = require('../models/Project');
const Profile = require('../models/Profile');
const UserProgress = require('../models/UserProgress');

// @desc Get project recommendations tailored to skill gaps
// @route GET /api/projects/recommendations
const getProjects = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const progress = await UserProgress.findOne({ user: req.user._id });

    const targetRole = profile ? profile.targetJobRole : 'Full Stack Developer';

    const projects = await Project.find({
      $or: [
        { targetRole: targetRole },
        { targetRole: 'Full Stack Developer' }
      ]
    });

    const projectStatusesMap = new Map();
    (progress?.projectStatuses || []).forEach(ps => {
      projectStatusesMap.set(ps.projectId.toString(), ps.status);
    });

    const userSkillNames = new Set((profile?.skills || []).map(s => s.skillName.toLowerCase()));

    const annotatedProjects = projects.map(proj => {
      const status = projectStatusesMap.get(proj._id.toString()) || 'Not Started';
      // Calculate how many missing skills this project directly addresses
      const skillsAddressed = (proj.skillsDeveloped || []).filter(sk => !userSkillNames.has(sk.toLowerCase()));

      return {
        ...proj.toObject(),
        status,
        skillsAddressed,
        addressedGapsCount: skillsAddressed.length,
        whyRecommended: proj.why || `This project directly addresses ${skillsAddressed.length || 2} of your current skill gaps.`
      };
    });

    res.json({
      targetRole,
      projects: annotatedProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user project status ('Planned', 'In Progress', 'Completed')
// @route PUT /api/projects/:projectId/status
const updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, githubLink } = req.body;

    let progress = await UserProgress.findOne({ user: req.user._id });
    if (!progress) {
      progress = new UserProgress({ user: req.user._id });
    }

    const existingIdx = progress.projectStatuses.findIndex(p => p.projectId.toString() === projectId);
    if (existingIdx !== -1) {
      progress.projectStatuses[existingIdx].status = status;
      if (githubLink !== undefined) progress.projectStatuses[existingIdx].githubLink = githubLink;
      progress.projectStatuses[existingIdx].updatedAt = Date.now();
    } else {
      progress.projectStatuses.push({
        projectId,
        status,
        githubLink: githubLink || ''
      });
    }

    await progress.save();

    res.json({
      message: 'Project status updated successfully',
      projectId,
      status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, updateProjectStatus };
