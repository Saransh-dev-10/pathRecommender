const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  suggestions: [{ type: String }]
}, { _id: false });

const AIConversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Career Guidance Chat' },
  messages: [MessageSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIConversation', AIConversationSchema);
