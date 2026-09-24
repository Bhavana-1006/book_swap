const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyListings,
  getNearbyBooks,
  lookupISBN
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Specific paths must precede /:id
router.get('/', getBooks);
router.post('/', protect, upload.array('images', 5), createBook);
router.get('/my/listings', protect, getMyListings);
router.get('/nearby', getNearbyBooks);
router.get('/isbn/:isbn', lookupISBN);
router.get('/:id', getBookById);
router.put('/:id', protect, upload.array('images', 5), updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
