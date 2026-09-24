const Request = require('../models/Request');
const Book = require('../models/Book');

// @desc    Create a new book request (Purchase, Donation, or Swap)
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
  try {
    const { bookId, requestType, offeredBookId, message } = req.body;

    if (!bookId || !requestType) {
      return res.status(400).json({ success: false, message: 'Book ID and request type are required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Target book not found' });
    }

    // Rule: User cannot request their own book
    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot request your own book' });
    }

    // Rule: Book must be available
    if (book.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This book is currently ${book.status.toLowerCase()} and cannot be requested`
      });
    }

    // Prevent duplicate pending requests from the same user for the same book
    const existingPending = await Request.findOne({
      book: bookId,
      requester: req.user.id,
      status: 'pending'
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending request for this book'
      });
    }

    // If SWAP, validate offered book ownership if provided
    let verifiedOfferedBook = null;
    if (requestType === 'SWAP' && offeredBookId) {
      const offeredBook = await Book.findById(offeredBookId);
      if (!offeredBook || offeredBook.owner.toString() !== req.user.id) {
        return res.status(400).json({ success: false, message: 'Offered swap book must be owned by you' });
      }
      if (offeredBook.status !== 'Available') {
        return res.status(400).json({ success: false, message: 'Offered swap book is not currently available' });
      }
      verifiedOfferedBook = offeredBook._id;
    }

    const newRequest = await Request.create({
      book: book._id,
      requester: req.user.id,
      owner: book.owner,
      requestType,
      offeredBook: verifiedOfferedBook,
      message: message ? message.trim() : '',
      status: 'pending'
    });

    await newRequest.populate([
      { path: 'book', select: 'title author price listingType images status' },
      { path: 'requester', select: 'name college city profileImage' },
      { path: 'owner', select: 'name college city profileImage' },
      { path: 'offeredBook', select: 'title author images' }
    ]);

    return res.status(201).json({
      success: true,
      message: 'Request submitted successfully to the owner',
      request: newRequest
    });
  } catch (error) {
    console.error('[Create Request Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating request' });
  }
};

// @desc    Get requests made by the logged-in user
// @route   GET /api/requests/my
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { requester: req.user.id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate({
        path: 'book',
        select: 'title author price listingType images status location'
      })
      .populate({
        path: 'owner',
        select: 'name email college city profileImage'
      })
      .populate({
        path: 'offeredBook',
        select: 'title author images'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('[Get My Requests Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving your requests' });
  }
};

// @desc    Get incoming requests for books owned by logged-in user
// @route   GET /api/requests/incoming
// @access  Private
const getIncomingRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { owner: req.user.id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate({
        path: 'book',
        select: 'title author price listingType images status'
      })
      .populate({
        path: 'requester',
        select: 'name email college city profileImage'
      })
      .populate({
        path: 'offeredBook',
        select: 'title author images condition'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('[Get Incoming Requests Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving incoming requests' });
  }
};

// @desc    Update request status (State Machine Transitions)
// @route   PATCH /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res) => {
  try {
    const { status: targetStatus } = req.body;
    const requestId = req.params.id;

    if (!targetStatus) {
      return res.status(400).json({ success: false, message: 'Target status is required' });
    }

    const request = await Request.findById(requestId).populate('book');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const currentStatus = request.status;
    const isOwner = request.owner.toString() === req.user.id;
    const isRequester = request.requester.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // State machine transition validation rules
    // Valid transitions:
    // pending -> accepted (owner only)
    // pending -> rejected (owner only)
    // pending -> cancelled (requester or owner)
    // accepted -> completed (requester or owner)
    // accepted -> cancelled (requester or owner)

    if (targetStatus === 'accepted') {
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Only the book owner can accept requests' });
      }

      if (currentStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Cannot accept request from '${currentStatus}' status. Must be 'pending'.`
        });
      }

      // ATOMIC RESERVATION: Recheck availability and reserve atomically
      const reservedBook = await Book.findOneAndUpdate(
        { _id: request.book._id, status: 'Available' },
        { status: 'Reserved' },
        { new: true }
      );

      if (!reservedBook) {
        return res.status(409).json({
          success: false,
          message: 'This book has already been reserved or is no longer available'
        });
      }

      // If swap with an offered book, also reserve offered book if available
      if (request.offeredBook) {
        await Book.findByIdAndUpdate(request.offeredBook, { status: 'Reserved' });
      }

      request.status = 'accepted';
      await request.save();

      return res.status(200).json({
        success: true,
        message: 'Request accepted and book has been reserved',
        request
      });
    }

    if (targetStatus === 'rejected') {
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Only the book owner can reject requests' });
      }

      if (currentStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: `Cannot reject a request that is already '${currentStatus}'`
        });
      }

      request.status = 'rejected';
      await request.save();

      return res.status(200).json({
        success: true,
        message: 'Request has been rejected',
        request
      });
    }

    if (targetStatus === 'cancelled') {
      if (!isRequester && !isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
      }

      if (currentStatus !== 'pending' && currentStatus !== 'accepted') {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a request that is '${currentStatus}'`
        });
      }

      // If the request had reserved the book, release it back to Available
      if (currentStatus === 'accepted') {
        await Book.findByIdAndUpdate(request.book._id, { status: 'Available' });
        if (request.offeredBook) {
          await Book.findByIdAndUpdate(request.offeredBook, { status: 'Available' });
        }
      }

      request.status = 'cancelled';
      await request.save();

      return res.status(200).json({
        success: true,
        message: 'Request has been cancelled and book status restored',
        request
      });
    }

    if (targetStatus === 'completed') {
      if (!isRequester && !isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Only participants can mark this exchange completed' });
      }

      if (currentStatus !== 'accepted') {
        return res.status(400).json({
          success: false,
          message: `Cannot mark completed from '${currentStatus}' status. Request must be 'accepted' first.`
        });
      }

      // Atomically mark book(s) as Exchanged
      await Book.findByIdAndUpdate(request.book._id, { status: 'Exchanged' });
      if (request.offeredBook) {
        await Book.findByIdAndUpdate(request.offeredBook, { status: 'Exchanged' });
      }

      request.status = 'completed';
      await request.save();

      return res.status(200).json({
        success: true,
        message: 'Exchange marked as completed! You can now rate and review each other.',
        request
      });
    }

    return res.status(400).json({ success: false, message: `Invalid status transition to '${targetStatus}'` });
  } catch (error) {
    console.error('[Update Request Status Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error updating request' });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus
};
