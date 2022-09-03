const express = require('express');
const { deleteMessage, getMessages, sendMessage, markMessageAsRead } = require('../controllers/conversations.js');

const router = express.Router();

// '/' in this router is equivalent to  '/api/v1/conversations'

// A message is an object in conversations array.
// All of these controller functions are working on that conversations array.
// router.route("/:userId").post(sendMessage).put(markMessageAsRead).get(getMessages).delete(deleteMessage);
router.route('/').post(sendMessage);

router.route('/:userId').get(getMessages).put(markMessageAsRead).delete(deleteMessage);
module.exports = router;
