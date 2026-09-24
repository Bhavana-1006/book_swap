const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: [true, 'Review must be linked to a completed exchange request']
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate review for the same exchange by the same user
reviewSchema.index({ request: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ reviewee: 1 });

module.exports = mongoose.model('Review', reviewSchema);
