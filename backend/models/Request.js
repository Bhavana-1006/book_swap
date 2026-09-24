const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Request must refer to a book']
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required']
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Book owner is required']
    },
    requestType: {
      type: String,
      enum: ['PURCHASE', 'DONATION', 'SWAP'],
      required: [true, 'Request type must be PURCHASE, DONATION, or SWAP']
    },
    offeredBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: null
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
requestSchema.index({ requester: 1, status: 1 });
requestSchema.index({ owner: 1, status: 1 });
requestSchema.index({ book: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
