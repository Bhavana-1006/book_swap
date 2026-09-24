const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:requestId', getMessages);
router.post('/:requestId', sendMessage);

module.exports = router;
