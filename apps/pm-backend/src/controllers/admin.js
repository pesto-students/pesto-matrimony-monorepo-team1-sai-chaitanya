const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const okta = require('@okta/okta-sdk-nodejs');

//getting all users profiles
exports.getAllUsersProfiles = asyncHandler(async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ user: allUsers });
  } catch (error) {
    return next(new CustomErrorResponse('Error! Please try later', 500));
  }
});
