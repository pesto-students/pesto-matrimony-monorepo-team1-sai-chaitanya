const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const okta = require('@okta/okta-sdk-nodejs');

// @desc   Shortlist Profiles
// @route  POST /api/v1/toggleShortlist?shortlister=oktaUserId1&shorlistee=oktaUserId2
// @access Private
exports.toggleShortlist = asyncHandler(async (req, res, next) => {
  const shortlisterOktaId = req.query.shortlister;
  const shortlisteeOktaId = req.query.shortlistee;

  try {
    // user who wants to shortlist
    const shortlister = await User.find({ oktaUserId: shortlisterOktaId })[0];

    // user who is being shortlisted
    const shortlistee = await User.find({ oktaUserId: shortlisteeOktaId })[0];

    // Did shortlister already shortlist shortlistee ?
    const wasAlreadyShortlisted = shortlister.shortlistedMatches.some((oktaId) => oktaId === shortlisteeOktaId);

    if (wasAlreadyShortlisted) {
      // If Yes... then remove from shortlist
      shortlister.shortlistedMatches = shortlister.shortlistedMatches.filter((oktaId) => oktaId !== shortlisteeOktaId);
    } else {
      // If No, then shortlist
      shortlister.shortlistedMatches.push(shortlisteeOktaId);
    }

    await shortlister.save();

    const message = wasAlreadyShortlisted
      ? `${shortlistee.name} has been removed from your shortlist`
      : `${shortlistee.name} was added to your shortlisted profiles`;

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    return next(new CustomErrorResponse('Error!. Please try later!', 500));
  }
});
