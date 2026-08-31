const mongoose = require('mongoose');

const CareerMapNodeSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  category: { type: String, default: '' },
  parentIds: [{ type: String }],
  requiredSkills: [{ type: String }],
  unlockedRoles: [{ type: String }],
  description: { type: String, default: '' },
  averageSalary: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('CareerMapNode', CareerMapNodeSchema);
