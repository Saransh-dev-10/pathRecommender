const Profile = require('../models/Profile');
const UserProgress = require('../models/UserProgress');
const AIConversation = require('../models/AIConversation');
const { chatWithCareerAssistant } = require('../services/aiService');

// @desc Send message to AI Career Chatbot Assistant
// @route POST /api/chat
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Please provide a message string' });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    const progress = await UserProgress.findOne({ user: req.user._id });

    let conversation = await AIConversation.findOne({ user: req.user._id });
    if (!conversation) {
      conversation = new AIConversation({ user: req.user._id, messages: [] });
    }

    // Add user message
    conversation.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date()
    });

    const { reply, suggestions } = await chatWithCareerAssistant(
      message, 
      profile, 
      progress, 
      conversation.messages
    );

    // Add AI reply
    conversation.messages.push({
      sender: 'ai',
      text: reply,
      timestamp: new Date(),
      suggestions
    });

    conversation.updatedAt = Date.now();
    await conversation.save();

    res.json({
      reply,
      suggestions,
      conversationId: conversation._id,
      messages: conversation.messages
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get chat history
// @route GET /api/chat/history
const getChatHistory = async (req, res) => {
  try {
    let conversation = await AIConversation.findOne({ user: req.user._id });
    if (!conversation) {
      conversation = { messages: [] };
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChatHistory };
