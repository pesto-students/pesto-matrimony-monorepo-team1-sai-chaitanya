const express = require('express');

const {
  deleteUserProfile,
  getUserProfile,
  registerUserProfile,
  updateUserProfile,
  oktaSignUp,
} = require('../controllers/users');

const router = express.Router();

// '/' in this router is equivalent to  '/api/v1/users'

// Signup
router.route('/oktasignup').post(oktaSignUp);

// router.route('/').post(registerUserProfile);
router.route('/userprofile/:id').get(getUserProfile);

// Update / Delete
router.route('/:userId').get(getUserProfile).put(updateUserProfile).delete(deleteUserProfile);

// Fetch User Profiles
// router.route("/").get(getProfilesByPreference);

// Have to create another route & controller function for...
// handling search and filters with pagination..
// This route will have a lot of complex logic.

// updateUserProfile will only be used to update Profile details...
// NOT messages... although it is possible...
// For message flow... a separate route (conversations) is present

module.exports = router;
