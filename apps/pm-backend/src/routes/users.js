const express = require('express');

const { getUserProfile, updateUserProfile, oktaSignUp } = require('../controllers/users');

const router = express.Router();

// '/' in this router is equivalent to  '/api/v1/users'

// Signup
router.route('/oktasignup').post(oktaSignUp);

router.route('/userprofile/:id').get(getUserProfile);

// Update / Delete
router.route('/:userId').get(getUserProfile).put(updateUserProfile);

module.exports = router;
