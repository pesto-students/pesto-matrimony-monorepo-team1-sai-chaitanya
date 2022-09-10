const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const okta = require('@okta/okta-sdk-nodejs');

// @desc   Register a new Profile
// @route  POST /api/v1/users/
// @access Public

exports.registerUserProfile = asyncHandler(async (req, res, next) => {
  // connect with okta here ?!
  const user = await User.create(req.body);
  res.status(201).json({ success: true, message: 'New user is created.', data: user });
});
/** ----------------------------------------- */

//creating user inside mongodb with oktaInformation.
const createUserInMongoDB = async (mongoUser) => {
  const user = await User.create(mongoUser);
  return user;
};

//signing up user into okta
exports.oktaSignUp = asyncHandler(async (req, res, next) => {
  const client = new okta.Client({
    orgUrl: 'https://dev-42684472.okta.com/',
    token: '00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P',
  });
  const body = req.body;
  try {
    async function createUserInOkta() {
      const response = await client.createUser(body);

      //will update it with destructure
      const oktaId = response.id;
      const name = `${response.profile.firstName} ${response.profile.lastName}`;
      const gender = response.profile.gender;
      const email = response.profile.email;

      const mongoUser = {
        oktaUserId: oktaId,
        name,
        gender,
        email,
      };

      await createUserInMongoDB(mongoUser);

      res.send({
        res: response,
      });
    }
    await createUserInOkta();
    // not using await will cause breakdown of express server
    // whenever there is any error while trying to create user in Okta.
  } catch (err) {
    return next(new CustomErrorResponse(err, 404));
    // res.send({
    //   err: err,
    // });
  }
});

//find user in mongodb by oktaId
async function findUserByOktaId(oktaId) {
  const currentUser = await User.find({ oktaUserId: oktaId });
  return currentUser;
}

// @desc   Retrieve a user Profile
// @route  GET /api/v1/users/userprofile/:id
// @access Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const params = req.params;
  const oktaId = params.id;
  const currentUser = await findUserByOktaId(oktaId);
  // const currentUser = await User.find({ oktaUserId: oktaId });
  if (!currentUser) {
    return next(new CustomErrorResponse(`User not found!`, 404));
  }
  res.status(200).json({ currentUser });
});

//to upload image in mongodb
exports.uploadImageToMongoDb = asyncHandler(async (req, res, next) => {
  const imageUrl = req.body.imageUrlString;
  const currentUserId = req.body.oktaUserId;
  const currentUser = await findUserByOktaId(currentUserId);
  // console.log(currentUser[0].images);
  const imageUrls = currentUser[0].images;
  if (!currentUser) {
    return next(new CustomErrorResponse(`User not found!`, 404));
  }
  await User.updateOne({ oktaUserId: currentUserId }, { images: [...imageUrls, imageUrl] });
  res.status(200).json({ status: 'success' });

  // res.status(200).json({
  //   success: true,
  //   message: 'Retrieved User successfully',
  //   user: user,
  // });
});

/** ----------------------------------------- */
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const currentUserId = req.params.userId;

  //getting mongodbId using oktaUserId
  // const user = await findUserByOktaId(currentUserId);
  // const mongoId = user[0]._id.toString()
  // console.log(mongoId);

  if (!currentUserId) {
    return next(new CustomErrorResponse(`Can't update data of non-existent user`, 400));
  }
  await User.updateOne({ oktaUserId: currentUserId }, { $set: req.body });
  res.status(200).json({
    success: true,
    message: 'Updated User successfully',
    data: 'user',
  });
});

/** ----------------------------------------- */

// @desc   Search Profiles
// @route  GET /api/v1/users/search/
// @access Private

exports.searchProfiles = asyncHandler(async (req, res, next) => {
  const searchCriteria = req.body;

  // NOTE : WORK IN PROGRESS....

  // Remove properties with 'undefined' values before perfmorming search in DB
  Object.keys(searchCriteria).forEach((key) => {
    if (searchCriteria[key] === undefined) {
      delete searchCriteria[key];
    }
  });

  let matchingProfiles = await User.find({ name: 'john', age: { $gte: 18 } }).exec();

  // console.log(matchingProfiles);

  if (matchingProfiles.length < 1) {
    return next(new CustomErrorResponse(`Could not find matching profiles`, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Updated User successfully',
    data: matchingProfiles,
  });
});

//for the admin part
// exports.getAllUsersProfiles = asyncHandler(async (req, res, next) => {

//   const allUsers = await User.find();

//   res.status(200).json({ user: allUsers });
// })
