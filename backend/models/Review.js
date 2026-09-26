const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: false
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: false
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
      required: [true, 'Review comment is required']
    },
    reviewType: {
      type: String,
      enum: ['exchange', 'campus_platform', 'book_feedback'],
      default: 'campus_platform'
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ request: 1, reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
