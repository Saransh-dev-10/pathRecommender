const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Language', 'Fundamentals', 'System Design', 'Mobile'],
    default: 'Frontend'
  },
  description: { type: String, default: '' },
  prerequisites: [{ type: String }],
  importanceWeight: { type: Number, default: 1.0 }
});

module.exports = mongoose.model('Skill', SkillSchema);
