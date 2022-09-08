const express = require('express');
const router = express.Router();

const { toggleShortlist } = require('../controllers/shortlist');

// '/' in this router is equivalent to  '/api/v1/search'

router.route('/').post(toggleShortlist);

module.exports = router;
