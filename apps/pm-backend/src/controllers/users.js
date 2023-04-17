const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const okta = require('@okta/okta-sdk-nodejs');

// @desc   Register a new Profile
// @route  POST /api/v1/users/
// @access Public
/** ----------------------------------------- */


//signing up user into okta
exports.oktaSignUp = async (req, res, next) => {

  let oldToken = "00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P"; 
  let newToken = "005Rdx3XVIzg2sRAFbBi-QX2_PYZul-cpCulQRgxfw"

  try{
    const client = new okta.Client({
      orgUrl: 'https://dev-42684472.okta.com/',
      token: newToken,
    });
    const body = req.body;
    
      // async function createUserInOkta() {
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

        console.log("mongoUser");
  
        //creting user in mongo db with data from the okta
        const user = await User.create(mongoUser);
  
      res.status(200).send({
        res: "just checking response",
      });
  }catch(err){
   next(err);
  }
  
};

//find user in mongodb by oktaId
async function findUserByOktaId(oktaId) {
  const currentUser = await User.find({ oktaUserId: oktaId })
  return currentUser;
}

//getting userPrifileData
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
});

/** ----------------------------------------- */
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const currentUserId = req.params.userId;

  //getting mongodbId using oktaUserId
  // const user = await findUserByOktaId(currentUserId);
  // const mongoId = user[0]._id.toString()
  // console.log(mongoId);

  const body = req.body;

  if(!body){
    return next(new CustomErrorResponse(`req.body is empty`, 400));
  }

  if (!currentUserId) {
    return next(new CustomErrorResponse(`Can't update data of non-existent user`, 400));
  }
  await User.updateOne({ oktaUserId: currentUserId }, { $set: body });
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

exports.deleteImage = asyncHandler(async (req, res, next) => {

  const currentUserOktaId = req.params.userId;
  const imageArrayIndex = req.params.index;

  //geting currentUserData by OktaUserId
  const currentUserProfile = await findUserByOktaId(currentUserOktaId);

  //image deleting logic
  currentUserProfile[0].images.splice(imageArrayIndex, 1);

  await User.updateOne({ oktaUserId: currentUserOktaId }, { images: currentUserProfile[0].images });

  res.status(200).json({
    success: true,
    message: 'Deleted user successfully',
    data: 'user'
  });
  
    res.status(400).json({
      success: false,
      message: 'Image is not deleted',
      error: err
    });
  
  // //geting currentUserData by OktaUserId
  // const currentUserProfile = await findUserByOktaId(currentUserOktaId);

  // //image deleting logic
  // currentUserProfile[0].images.splice(imageArrayIndex, 1);

  // await User.updateOne({ oktaUserId: currentUserOktaId }, { images: currentUserProfile[0].images });

  // res.status(200).json({
  //   success: true,
  //   message: 'Deleted user successfully',
  //   data: 'user'
  // });

})
