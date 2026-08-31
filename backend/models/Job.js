const mongoose = require('mongoose');

const RequiredSkillSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  minLevel: { type: Number, required: true },
  weight: { type: Number, default: 1.0 }
});

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  domain: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  salaryRange: { type: String, default: '' },
  description: { type: String, default: '' },
  requiredSkills: [RequiredSkillSchema],
  requiredEducation: [{ type: String }],
  recommendedProjects: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
