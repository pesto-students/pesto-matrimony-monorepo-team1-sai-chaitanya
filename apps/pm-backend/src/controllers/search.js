const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');

const MINIMUM_HEIGHT_IN_CMS = 122;
const MAXIMUM_HEIGHT_IN_CMS = 214;
const MINIMUM_ALLOWED_AGE = 21;
const MAXIMUM_ALLOWED_AGE = 50;

// @desc   Search Profiles
// @route  POST /api/v1/users/search/:oktaUserId
// @access Private

exports.searchProfiles = asyncHandler(async (req, res, next) => {
  try {
    console.log('search route has been hit...');
    const currentUser = await User.find({ oktaUserId: req.params.oktaUserId });
    console.log(req.body);
    if (!currentUser) {
      return next(new CustomErrorResponse(`User not found!`, 404));
    }

    const currentUserGender = currentUser[0].gender;

    const searchCriteria = req.body;
    console.log(searchCriteria);
    // Remove properties with 'undefined' & "null" values before perfmorming search in DB
    Object.keys(searchCriteria).forEach((key) => {
      if (searchCriteria[key] === undefined || searchCriteria[key] === null) {
        delete searchCriteria[key];
      }
    });

    const { ageRange, city, country, heightRange, religion, marriageStatus, motherTongue, state } = searchCriteria;

    const minAge = ageRange === undefined ? MINIMUM_ALLOWED_AGE : ageRange[0];
    const maxAge = ageRange === undefined ? MAXIMUM_ALLOWED_AGE : ageRange[1];
    const minHeight = heightRange === undefined ? MINIMUM_HEIGHT_IN_CMS : heightRange[0];
    const maxHeight = heightRange === undefined ? MAXIMUM_HEIGHT_IN_CMS : heightRange[1];

    // get profiles of opposite gender.
    const profiles = await User.find({ gender: { $ne: currentUserGender } }).exec();

    // filter opposite gender profiles as per search preferences.
    const matchingProfiles = profiles.filter((profile) => {
      return (
        profile.age >= minAge &&
        profile.age <= maxAge &&
        profile.height >= minHeight &&
        profile.height <= maxHeight &&
        (city ? profile.location === city : true) &&
        (country ? profile.country === country : true) &&
        (motherTongue ? profile.motherTongue === motherTongue : true) &&
        (marriageStatus ? profile.marriageStatus === marriageStatus : true) &&
        (religion ? profile.religion === religion : true) &&
        (state ? profile.state === state : true)
      );
    });

    console.log('No. of Matches: ', matchingProfiles.length);

    if (matchingProfiles.length < 1) {
      res.status(200).json({
        success: false,
        message: 'Matches not found. Please adjust your search criteria',
        number: matchingProfiles.length,
        data: matchingProfiles,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Matches found.',
      number: matchingProfiles.length,
      data: matchingProfiles,
    });
  } catch (error) {
    return next(new CustomErrorResponse('Error!. Please try later!', 500));
  }
});
