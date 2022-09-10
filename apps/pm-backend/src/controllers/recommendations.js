const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');

// @desc   Get Recommendations
// @route  GET /api/v1/recommendations/:oktaUserId
// @access Private
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = await User.find({ oktaUserId: req.params.oktaUserId });

    if (!currentUser) {
      return next(new CustomErrorResponse(`User not found!`, 404));
    }

    const currentUserGender = currentUser[0].gender;
    const currentUserAge = currentUser[0].age;
    const currentUserReligion = currentUser[0].religion;

    const profiles = await User.find({ gender: { $ne: currentUserGender } }).exec();

    //Recommendations based on gender, age and religion
    const recommendations = profiles.filter((profile) => {
      return (
        (currentUserGender === 'male' ? profile.age <= currentUserAge : profile.age >= currentUserAge) &&
        (currentUserReligion ? profile.religion === currentUserReligion : true)
      );
    });

    console.log('No. of Recommendations: ', recommendations.length);

    if (recommendations.length < 1) {
      res.status(200).json({
        success: false,
        message: 'Recommendations not found. Please update your age and religion to get recommendations.',
        number: recommendations.length,
        data: recommendations,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Recommendations found.',
      number: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    return next(new CustomErrorResponse('Error!. Please try later!', 500));
  }
});
