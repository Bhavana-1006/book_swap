const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id })
      .populate({
        path: 'book',
        populate: { path: 'owner', select: 'name college city profileImage' }
      })
      .sort({ createdAt: -1 });

    // Filter out items where the book may have been deleted or removed
    const validItems = items.filter((item) => item.book && item.book.status !== 'Removed');

    return res.status(200).json({
      success: true,
      count: validItems.length,
      wishlist: validItems
    });
  } catch (error) {
    console.error('[Get Wishlist Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving wishlist' });
  }
};

// @desc    Add book to wishlist
// @route   POST /api/wishlist/:bookId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book || book.status === 'Removed') {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    // Check if already in wishlist
    const exists = await Wishlist.findOne({ user: req.user.id, book: bookId });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Book is already in your wishlist' });
    }

    const item = await Wishlist.create({
      user: req.user.id,
      book: bookId
    });

    await item.populate({
      path: 'book',
      populate: { path: 'owner', select: 'name college city profileImage' }
    });

    return res.status(201).json({
      success: true,
      message: 'Book saved to your wishlist',
      item
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Book is already in your wishlist' });
    }
    console.error('[Add Wishlist Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error adding to wishlist' });
  }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const item = await Wishlist.findOneAndDelete({ user: req.user.id, book: bookId });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in your wishlist' });
    }

    return res.status(200).json({
      success: true,
      message: 'Book removed from wishlist'
    });
  } catch (error) {
    console.error('[Remove Wishlist Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error removing from wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
