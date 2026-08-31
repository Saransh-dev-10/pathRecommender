const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  targetRole: { type: String, required: true },
  skillsDeveloped: [{ type: String }],
  why: { type: String, default: '' },
  deliverables: [{ type: String }],
  estimatedHours: { type: Number, default: 20 },
  architectureSummary: { type: String, default: '' }
});

module.exports = mongoose.model('Project', ProjectSchema);
