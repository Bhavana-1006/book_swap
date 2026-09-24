const Review = require('../models/Review');
const Request = require('../models/Request');

// @desc    Submit a review for a completed exchange
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;

    if (!requestId || !rating) {
      return res.status(400).json({ success: false, message: 'Request ID and rating (1-5) are required' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Exchange request not found' });
    }

    // Must be completed
    if (request.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted after the exchange has been marked completed'
      });
    }

    const isRequester = request.requester.toString() === req.user.id;
    const isOwner = request.owner.toString() === req.user.id;

    if (!isRequester && !isOwner) {
      return res.status(403).json({ success: false, message: 'Only participants in this exchange can leave a review' });
    }

    // Reviewee is the other person
    const revieweeId = isRequester ? request.owner : request.requester;

    // Check duplicate review
    const existingReview = await Review.findOne({
      request: requestId,
      reviewer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this exchange'
      });
    }

    const review = await Review.create({
      request: requestId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      book: request.book,
      rating: numRating,
      comment: comment ? comment.trim() : ''
    });

    await review.populate('reviewer', 'name profileImage college');

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been recorded.',
      review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Duplicate review detected' });
    }
    console.error('[Create Review Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error saving review' });
  }
};

// @desc    Get reviews received by a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name college profileImage')
      .populate('book', 'title author images')
      .sort({ createdAt: -1 });

    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0
      ? (reviews.reduce((acc, item) => acc + item.rating, 0) / totalRatings).toFixed(1)
      : 0;

    return res.status(200).json({
      success: true,
      count: totalRatings,
      averageRating: parseFloat(averageRating),
      reviews
    });
  } catch (error) {
    console.error('[Get User Reviews Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving user reviews' });
  }
};

module.exports = { createReview, getUserReviews };
