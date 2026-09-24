const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

messageSchema.index({ relatedRequest: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
