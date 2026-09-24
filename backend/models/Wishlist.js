const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required']
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Prevent duplicate entries for the same user and book
wishlistSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
