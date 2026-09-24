const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getIncomingRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createRequest);
router.get('/my', getMyRequests);
router.get('/incoming', getIncomingRequests);
router.patch('/:id/status', updateRequestStatus);

module.exports = router;
