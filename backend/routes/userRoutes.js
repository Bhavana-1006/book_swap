const express = require('express');
const router = express.Router();
const { getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getMe);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;
