const express = require('express');

//importing controllers
const { getAllUsersProfiles } = require('../controllers/admin');

const router = express.Router();

//getting all users of pesto-matrimony
router.route('/getallusers').get(getAllUsersProfiles);

module.exports = router;
