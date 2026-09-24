const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  getAllListings,
  banUser,
  unbanUser,
  removeListing
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/listings', getAllListings);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.delete('/listings/:id', removeListing);

module.exports = router;
