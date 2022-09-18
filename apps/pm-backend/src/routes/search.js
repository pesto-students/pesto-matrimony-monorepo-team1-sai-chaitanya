const express = require('express');
const router = express.Router();

const { searchProfiles } = require('../controllers/search');

// '/' in this router is equivalent to  '/api/v1/search'

router.route('/:oktaUserId').post(searchProfiles);

module.exports = router;
