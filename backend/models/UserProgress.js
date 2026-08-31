const mongoose = require('mongoose');

const QuizResultEntrySchema = new mongoose.Schema({
  topicId: { type: String, required: true },
  scorePercentage: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now },
  remediationInserted: { type: Boolean, default: false }
}, { _id: false });

const UserProjectStatusSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], default: 'Planned' },
  githubLink: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const CustomRemediationNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  topic: { type: String, required: true },
  category: { type: String, default: 'Remediation' },
  difficulty: { type: String, default: 'Beginner' },
  prerequisites: [{ type: String }],
  whyRecommended: { type: String, default: '' },
  estimatedHours: { type: Number, default: 2 },
  parentTopicId: { type: String, required: true },
  resources: [{
    title: String,
    url: String,
    type: { type: String, default: 'Article' }
  }],
  practiceTask: { type: String, default: '' }
}, { _id: false });

const ModuleStudyProgressSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  completedTopics: [{ type: String }],
  completedPracticeTasks: [{ type: String }],
  notes: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  completedNodes: [{ type: String }],
  quizResults: [QuizResultEntrySchema],
  projectStatuses: [UserProjectStatusSchema],
  customRemediationNodes: [CustomRemediationNodeSchema],
  moduleStudyProgress: [ModuleStudyProgressSchema],
  weeklyActivity: [{
    day: { type: String }, // e.g. Mon, Tue
    hoursSpent: { type: Number, default: 0 },
    nodesCompleted: { type: Number, default: 0 }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
