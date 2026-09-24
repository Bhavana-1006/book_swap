const Message = require('../models/Message');
const Request = require('../models/Request');

// @desc    Get messages for a specific exchange request
// @route   GET /api/chat/:requestId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    const isParticipant =
      request.requester.toString() === req.user.id ||
      request.owner.toString() === req.user.id ||
      req.user.role === 'ADMIN';

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this chat' });
    }

    const messages = await Message.find({ relatedRequest: requestId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('[Get Messages Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving messages' });
  }
};

// @desc    Send a message via HTTP fallback / persistence
// @route   POST /api/chat/:requestId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    const isRequester = request.requester.toString() === req.user.id;
    const isOwner = request.owner.toString() === req.user.id;

    if (!isRequester && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to send messages in this exchange' });
    }

    const recipient = isRequester ? request.owner : request.requester;

    const message = await Message.create({
      relatedRequest: requestId,
      sender: req.user.id,
      recipient,
      content: content.trim()
    });

    await message.populate('sender', 'name profileImage');

    return res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('[Send Message Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

module.exports = { getMessages, sendMessage };
