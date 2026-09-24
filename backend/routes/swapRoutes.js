const express = require('express');
const router = express.Router();
const { getSwapMatches } = require('../controllers/swapController');
const { protect } = require('../middleware/auth');

router.get('/matches', protect, getSwapMatches);

module.exports = router;
