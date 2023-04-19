const express = require('express');
const { getMessages, sendMessage, markMessagesAsRead } = require('../controllers/conversations');

const router = express.Router();

// '/' in this router is equivalent to  '/api/v1/conversations'

// A message is an object in conversations array.
// All of these controller functions are working on that conversations array.
router.route('/').post(sendMessage).put(markMessagesAsRead);

router.route('/:oktaUserId').get(getMessages);

module.exports = router;
