const express = require('express');
const router = express.Router();

const { getRecommendations } = require('../controllers/recommendations');

// '/' in this router is equivalent to  '/api/v1/recommendations'

router.route('/:oktaUserId').get(getRecommendations);

module.exports = router;
