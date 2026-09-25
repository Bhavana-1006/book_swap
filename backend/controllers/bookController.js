const mongoose = require('mongoose');
const Book = require('../models/Book');
const { fetchBookByISBN } = require('../services/googleBooksService');

// @desc    Create a new book listing
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      subject,
      semester,
      branch,
      description,
      condition,
      listingType,
      price,
      swapPreferences,
      city,
      latitude,
      longitude
    } = req.body;

    // Validate required fields
    if (!title || !author || !subject || !semester || !description || !condition || !listingType) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory fields' });
    }

    // Validate price based on listingType
    let parsedPrice = 0;
    if (listingType === 'SELL') {
      parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ success: false, message: 'Sell listings require a valid price greater than 0' });
      }
    } else if (listingType === 'DONATE') {
      parsedPrice = 0;
    } else if (listingType === 'SWAP') {
      parsedPrice = price ? parseFloat(price) : 0;
    }

    // Process images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.coverImage) {
      images = [req.body.coverImage];
    }

    // Location setup
    const bookCity = (city || req.user.city || '').trim();
    let locationData = {
      type: 'Point',
      city: bookCity
    };

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      locationData.coordinates = [lng, lat]; // GeoJSON standard: [longitude, latitude]
    }

    const book = await Book.create({
      owner: req.user.id,
      title: title.trim(),
      author: author.trim(),
      isbn: isbn ? isbn.trim() : '',
      subject: subject.trim(),
      semester: semester.trim(),
      branch: branch ? branch.trim() : 'General',
      description: description.trim(),
      condition,
      listingType,
      price: parsedPrice,
      swapPreferences: swapPreferences ? swapPreferences.trim() : '',
      images,
      location: locationData,
      status: 'Available'
    });

    await book.populate('owner', 'name email college city profileImage');

    return res.status(201).json({
      success: true,
      message: 'Book listed successfully',
      book
    });
  } catch (error) {
    console.error('[Create Book Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating book listing' });
  }
};

// @desc    Get all books with search, filters & pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const {
      search,
      subject,
      semester,
      condition,
      listingType,
      city,
      status,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Availability filter (default: Available unless specified or admin)
    if (status) {
      query.status = status;
    } else {
      query.status = 'Available';
    }

    // Search filter across title, author, subject, isbn
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { subject: searchRegex },
        { isbn: searchRegex },
        { branch: searchRegex }
      ];
    }

    // Specific filters
    if (subject && subject !== 'All') {
      query.subject = new RegExp(`^${subject.trim()}$`, 'i');
    }

    if (semester && semester !== 'All') {
      query.semester = semester;
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    if (listingType && listingType !== 'All') {
      query.listingType = listingType;
    }

    if (city && city.trim() !== '') {
      query['location.city'] = new RegExp(city.trim(), 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOption = { price: 1, createdAt: -1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('owner', 'name college city profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      books
    });
  } catch (error) {
    console.error('[Get Books Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving books' });
  }
};

// @desc    Get single book details by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid book listing ID' });
    }

    const book = await Book.findById(req.params.id).populate(
      'owner',
      'name email college city profileImage createdAt'
    );

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    return res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    console.error('[Get Book By ID Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Invalid book ID or server error' });
  }
};

// @desc    Update book listing
// @route   PUT /api/books/:id
// @access  Private (Owner only)
const updateBook = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid book listing ID' });
    }

    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    // Ownership check (or ADMIN)
    const userId = req.user?._id?.toString() || req.user?.id?.toString();
    if (book.owner.toString() !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const {
      title,
      author,
      isbn,
      subject,
      semester,
      branch,
      description,
      condition,
      listingType,
      price,
      swapPreferences,
      city,
      status
    } = req.body;

    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (isbn !== undefined) book.isbn = isbn.trim();
    if (subject) book.subject = subject.trim();
    if (semester) book.semester = semester.trim();
    if (branch !== undefined) book.branch = branch.trim();
    if (description) book.description = description.trim();
    if (condition) book.condition = condition;
    if (listingType) book.listingType = listingType;
    if (price !== undefined) book.price = Number(price);
    if (swapPreferences !== undefined) book.swapPreferences = swapPreferences.trim();
    if (city) {
      if (!book.location) book.location = { type: 'Point', city: city.trim() };
      else book.location.city = city.trim();
    }
    if (status) book.status = status;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      book.images = [...book.images, ...newImages];
    }

    await book.save();
    await book.populate('owner', 'name college city profileImage');

    return res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      book
    });
  } catch (error) {
    console.error('[Update Book Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating book' });
  }
};

// @desc    Delete book listing
// @route   DELETE /api/books/:id
// @access  Private (Owner or Admin)
const deleteBook = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid book listing ID' });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    // Ownership or Admin check
    const userId = req.user?._id?.toString() || req.user?.id?.toString();
    if (book.owner.toString() !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    // Soft delete by marking Removed so exchange records preserve references
    book.status = 'Removed';
    await book.save();

    return res.status(200).json({
      success: true,
      message: 'Book listing deleted successfully'
    });
  } catch (error) {
    console.error('[Delete Book Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting book' });
  }
};

// @desc    Get current user's listings
// @route   GET /api/books/my/listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user?._id || req.user?.id;
    const query = { owner: userId };

    if (status && status !== 'All') {
      query.status = status;
    } else {
      query.status = { $ne: 'Removed' };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    console.error('[Get My Listings Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving your listings' });
  }
};

// @desc    Get nearby books using GeoJSON coordinates
// @route   GET /api/books/nearby
// @access  Public
const getNearbyBooks = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 30000, city } = req.query;

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const maxDistMeters = parseInt(maxDistance, 10) || 30000; // 30km default

    // If valid coordinates supplied, use 2dsphere $near
    if (!isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      try {
        const books = await Book.find({
          status: 'Available',
          'location.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              $maxDistance: maxDistMeters
            }
          }
        })
          .populate('owner', 'name college city profileImage')
          .limit(24);

        return res.status(200).json({
          success: true,
          mode: 'geospatial',
          count: books.length,
          books
        });
      } catch (geoError) {
        console.warn('[Nearby Geo Error Fallback]:', geoError.message);
        // Fallback to city match if geospatial index query is not ready or matches 0
      }
    }

    // Fallback: match by city
    const searchCity = city || (req.user ? req.user.city : '');
    const query = { status: 'Available' };
    if (searchCity) {
      query['location.city'] = new RegExp(searchCity.trim(), 'i');
    }

    const books = await Book.find(query)
      .populate('owner', 'name college city profileImage')
      .sort({ createdAt: -1 })
      .limit(24);

    return res.status(200).json({
      success: true,
      mode: 'city-fallback',
      city: searchCity || 'All Locations',
      count: books.length,
      books
    });
  } catch (error) {
    console.error('[Get Nearby Books Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving nearby books' });
  }
};

// @desc    Lookup book metadata by ISBN using Google Books API
// @route   GET /api/books/isbn/:isbn
// @access  Public
const lookupISBN = async (req, res) => {
  try {
    const { isbn } = req.params;
    if (!isbn) {
      return res.status(400).json({ success: false, message: 'Please provide an ISBN' });
    }

    const bookData = await fetchBookByISBN(isbn);

    if (!bookData) {
      return res.status(404).json({
        success: false,
        message: 'No book found for this ISBN. You can still fill in the details manually.'
      });
    }

    return res.status(200).json({
      success: true,
      book: bookData
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to fetch book data from ISBN'
    });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getMyListings,
  getNearbyBooks,
  lookupISBN
};
