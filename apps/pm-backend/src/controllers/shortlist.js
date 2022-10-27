const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const okta = require('@okta/okta-sdk-nodejs');

// @desc   Shortlist Profiles
// @route  PUT /api/v1/toggleShortlist?shortlister=oktaUserId1&shorlistee=oktaUserId2
// @access Private
exports.toggleShortlist = asyncHandler(async (req, res, next) => {
  const shortlisterOktaId = req.query.shortlister;
  const shortlisteeOktaId = req.query.shortlistee;
  console.log(shortlisterOktaId);
  console.log(shortlisteeOktaId);

  try {
    // user who wants to shortlist
    let shortlister = await User.find({ oktaUserId: shortlisterOktaId });
    shortlister = shortlister[0];

    const { shortlistedMatches } = shortlister;

    // user who is being shortlisted
    let shortlistee = await User.find({ oktaUserId: shortlisteeOktaId });
    shortlistee = shortlistee[0];

    // Did shortlister already shortlist shortlistee ?
    const wasAlreadyShortlisted = shortlister.shortlistedMatches.some((oktaId) => oktaId === shortlisteeOktaId);
    // console.log(wasAlreadyShortlisted);

    if (wasAlreadyShortlisted) {
      // If Yes... then remove from shortlist
      shortlister.shortlistedMatches = shortlister.shortlistedMatches.filter((oktaId) => oktaId !== shortlisteeOktaId);
    } else {
      // If No, then shortlist
      shortlister.shortlistedMatches = [...shortlistedMatches, shortlisteeOktaId];
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
    return next(new CustomErrorResponse('Please try later', 500));
  }
});
