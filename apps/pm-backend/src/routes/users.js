const express = require('express');

const { getUserProfile, uploadImageToMongoDb, updateUserProfile, oktaSignUp } = require('../controllers/users');

const router = express.Router();

// '/' in this router is equivalent to  '/api/v1/users'

// Signup
router.route('/oktasignup').post(oktaSignUp);
router.route('/userprofile/:id').get(getUserProfile);
router.route('/imageupload/:id').post(uploadImageToMongoDb);

// Update
router.route('/:userId').put(updateUserProfile);

module.exports = router;
