const mongoose = require('mongoose');

const GradedQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
  topic: { type: String, default: 'General' },
  difficulty: { type: String, default: 'Intermediate' },
  userAnswer: { type: Number, default: null },
  isCorrect: { type: Boolean, default: false }
}, { _id: false });

const AssessmentResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  moduleId: { type: String, default: null },
  learningPathNodeId: { type: String, default: null },
  attemptNumber: { type: Number, default: 1 },
  score: { type: Number, required: true }, // percentage 0-100
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  questionIds: [{ type: String }],
  weakTopics: [{ type: String }],
  strongTopics: [{ type: String }],
  proficiencyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true },
  difficultyDistribution: {
    beginner: { type: Number, default: 0 },
    intermediate: { type: Number, default: 0 },
    advanced: { type: Number, default: 0 }
  },
  gradedQuestions: [GradedQuestionSchema],
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now }
});

AssessmentResultSchema.index({ userId: 1, skill: 1, attemptNumber: 1 });
AssessmentResultSchema.index({ userId: 1, moduleId: 1 });

module.exports = mongoose.model('AssessmentResult', AssessmentResultSchema);
