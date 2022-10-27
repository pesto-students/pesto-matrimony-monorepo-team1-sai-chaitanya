const express = require('express');

const {
  getUserProfile,
  uploadImageToMongoDb,
  updateUserProfile,
  oktaSignUp,
  searchProfiles,
  deleteImage
} = require('../controllers/users');

const router = express.Router();

// '/' in this router is equivalent to  '/api/v1/users'

// Signup
router.route('/oktasignup').post(oktaSignUp);
router.route('/userprofile/:id').get(getUserProfile);
router.route('/imageupload').post(uploadImageToMongoDb);

//it was running for the admin
// router.route('/getallusers').get(getAllUsersProfiles)

// Update / Delete
router.route('/:userId').put(updateUserProfile);

// Fetch User Profiles
router.route('/search').get(searchProfiles);

router.route('/delete-image/:userId/:index').delete(deleteImage);

// Have to create another route & controller function for...
// handling search and filters with pagination..
// This route will have a lot of complex logic.

// updateUserProfile will only be used to update Profile details...
// NOT messages... although it is possible...
// For message flow... a separate route (conversations) is present
// Update
router.route('/:userId').put(updateUserProfile);

module.exports = router;
