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
  console.log(user);
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
      console.log('trying to create user in Okta');
      const response = await client.createUser(body);
      console.log('successfully created user in Okta');

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

      const mongoReponse = await createUserInMongoDB(mongoUser);

      res.send({
        res: response,
      });
    }
    await createUserInOkta();
  } catch (err) {
    console.log(err);
    res.send({
      err: err,
    });
  }
});

// @desc   Retrieve a user Profile
// @route  GET /api/v1/users/:userId
// @access Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const params = req.params;

  const oktaId = params.id;

  const user = await User.find({ oktaUserId: oktaId });

  const UserMongoId = user._id;

  console.log('UserMongoId', UserMongoId);

  if (!user) {
    return next(new CustomErrorResponse(`User not found!`, 404));
  }
  res.status(200).json({ user });
});
/** ----------------------------------------- */

// @desc   Update already existing Profile Data
// @route  PUT /api/v1/users/:userId
// @access Private

// After initial signup where only mandatory fields are asked,
// Whenever user logs in... and updates their profile data,
// This controller is used for that purpose.

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  console.log(req.params.userId);
  let user = await User.findById(req.params.userId);
  if (!user) {
    return next(new CustomErrorResponse(`Can't update data of non-existent user`, 400));
  }

  // Remove properties with 'undefined' values before storing in DB
  const data = req.body;
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key];
    }
  });

  user = await User.findByIdAndUpdate(req.params.userId, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Updated User successfully',
    data: user,
  });
});
/** ----------------------------------------- */

// @desc   Delete a new Profile
// @route  DELETE /api/v1/users/:userId
// @access Private

exports.deleteUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new CustomErrorResponse(`No user found with id of ${req.params.userId}`, 404));
  }
  // I could have used findByIdAndDelete().
  // But remove() allows using middleware... so I will use remove()
  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User successfully deleted',
  });
});
/** ----------------------------------------- */
