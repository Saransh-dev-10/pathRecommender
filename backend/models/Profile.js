const mongoose = require('mongoose');

const SkillEntrySchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  category: { type: String, default: 'General' },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  experienceYears: { type: Number, default: 0 },
  source: { type: String, enum: ['Profile', 'Resume', 'Assessment', 'AI Extracted'], default: 'Profile' },
  status: { type: String, enum: ['Verified', 'Developing', 'Not Assessed'], default: 'Not Assessed' },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

const ProjectEntrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' }
}, { _id: false });

const CertificationEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, default: '' },
  year: { type: Number }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  education: {
    degree: { type: String, default: '' },
    branch: { type: String, default: '' },
    graduationYear: { type: Number, default: null },
    college: { type: String, default: '' }
  },
  experienceLevel: { 
    type: String, 
    enum: ['Beginner', 'Entry Level', 'Intermediate', 'Experienced', 'Senior'],
    default: 'Beginner'
  },
  skills: [SkillEntrySchema],
  softSkills: [{ type: String }],
  interests: [{ type: String }],

  // Learning-focused fields (replacing career fields)
  learningGoal: { type: String, default: null },
  dailyLearningMinutes: { type: Number, default: 60 },
  weeklyLearningHours: { type: Number, default: 10 },
  difficultyPreference: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  theoryVsPractice: { type: String, enum: ['Theory', 'Balanced', 'Practice'], default: 'Balanced' },
  projectBased: { type: Boolean, default: true },

  projects: [ProjectEntrySchema],
  certifications: [CertificationEntrySchema],
  resumeText: { type: String, default: '' },
  resumeFileName: { type: String, default: '' },
  onboardingCompleted: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);
