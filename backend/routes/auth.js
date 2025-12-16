const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
