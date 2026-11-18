const chatbotService = require('../services/chatbotService');

// @desc    Process chatbot natural language query
// @route   POST /api/chatbot/query
// @access  Public / Private
exports.askChatbot = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message string is required' });
    }

    const response = await chatbotService.processChatbotQuery(message, req.user || null);

    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
};
