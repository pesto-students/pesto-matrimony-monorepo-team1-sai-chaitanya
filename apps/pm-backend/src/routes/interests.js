const express = require('express');
const { acceptInterest, cancelInterest, declineInterest, sendInterest } = require('../controllers/interests');

const router = express.Router();

// '/' in this router is equivalent to  '/api/v1/interests'

router.route('/').post(sendInterest);

router.route('/accept').put(acceptInterest);

router.route('/cancel').put(cancelInterest);

router.route('/decline').put(declineInterest);

module.exports = router;
