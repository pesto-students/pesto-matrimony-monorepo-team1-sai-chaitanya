const express = require('express');
const router = express.Router();

const { toggleShortlist } = require('../controllers/shortlist');

// '/' in this router is equivalent to  '/api/v1/toggleShortlist'

router.route('/').put(toggleShortlist);

module.exports = router;
