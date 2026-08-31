const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
  skillWeight: { type: Number, default: 1 }
}, { _id: false });

const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skillName: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  questions: [QuestionSchema],
  durationMinutes: { type: Number, default: 15 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
