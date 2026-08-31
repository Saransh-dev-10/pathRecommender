const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, default: '#' },
  type: { type: String, enum: ['Video', 'Article', 'Documentation', 'Interactive', 'Course'], default: 'Article' },
  estimatedMinutes: { type: Number, default: 30 }
}, { _id: false });

const QuizQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' }
}, { _id: false });

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  topic: { type: String, required: true },
  category: { type: String, default: 'Core' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  prerequisites: [{ type: String }],
  whyRecommended: { type: String, default: '' },
  estimatedHours: { type: Number, default: 5 },
  resources: [ResourceSchema],
  practiceTask: { type: String, default: '' },
  quiz: [QuizQuestionSchema],
  isRemediation: { type: Boolean, default: false },
  parentTopicId: { type: String, default: null }
}, { _id: false });

const LearningPathSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  learningGoal: { type: String, required: true },
  generatedForGoal: { type: String, required: true },
  goalVersion: { type: Number, default: 1 },
  description: { type: String, default: '' },
  nodes: [NodeSchema],
  currentNodeId: { type: String, default: null },
  overallProgress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LearningPath', LearningPathSchema);
