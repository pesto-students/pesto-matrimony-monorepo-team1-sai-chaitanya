const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const mongoose = require('mongoose');

// @desc   Send a New Interest
// @route  POST /api/v1/interests?sender=oktaUserId1&receiver=oktaUserId2
// @access Private

// In One go...the interest sent MUST be in "interestsSent" array of Sender and "interestsReceived" array of Receiver.
// Otherwise, consider that attempt to send interest as failure. So a MongoDB/Mongoose Transaction must be used.

exports.sendInterest = asyncHandler(async (req, res, next) => {
  const oktaUserId1 = req.query.sender;
  const oktaUserId2 = req.query.receiver;
  const session = await User.startSession();

  console.log('oktaUserId1 ', oktaUserId1);
  console.log('oktaUserId2 ', oktaUserId2);
  try {
    session.startTransaction();

    let user1 = await User.find({ oktaUserId: oktaUserId1 });
    user1 = user1[0];
    let user2 = await User.find({ oktaUserId: oktaUserId2 });
    user2 = user2[0];

    /**=============================================================== */
    // User1 wants to send Interest to User2

    // NOTE: Interests are stored as objects in interestsSender array of Sender(User1)
    // & also in interestsReceived array of Receiver(User2).

    // Step 1: Determine if User1 already send or received interest to/from User 2 ?
    // If Yes, then throw error that You've already sent/received interest to User 2

    // Checking interestsSent and interestsReceived array of User1
    const didUser1AlreadySendInterestToUser2 = user1.interestsSent.some(
      (interest) => interest.interestReceiverId === oktaUserId2
    );

    console.log('didUser1AlreadySendInterestToUser2', didUser1AlreadySendInterestToUser2);
    if (didUser1AlreadySendInterestToUser2) {
      await session.abortTransaction();
      session.endSession();
      return next(
        new CustomErrorResponse(
          `Interest already sent to ${user2.name}. Please wait for response. If your interest was accepted before, this profile is already in "Accepted" list. Please check.`,
          400
        )
      );
    }

    const didUser1AlreadyReceiveInterestFromUser2 = user1.interestsReceived.some(
      (interest) => interest.interestSenderId === oktaUserId2
    );

    console.log('didUser1AlreadyReceiveInterestFromUser2', didUser1AlreadyReceiveInterestFromUser2);
    if (didUser1AlreadyReceiveInterestFromUser2) {
      await session.abortTransaction();
      session.endSession();
      return next(
        new CustomErrorResponse(
          `Interest already received from ${user2.name}. Please respond to it. If you've already accepted her interest, please check "Accepted" list.`,
          400
        )
      );
    }

    const maleImagePlaceholder = `https://res.cloudinary.com/pesto-matrimony/image/upload/v1662374871/e0kfqgvenrb2mhpzya4a.png`;
    const femaleImagePlaceholder = `https://res.cloudinary.com/pesto-matrimony/image/upload/v1662458482/tufqrbcs4pnkwcukvynw.png`;

    // If Not sent Interest before, then...
    // put the interest object in interestsSent array of User1
    user1.interestsSent.push({
      conversations: [],
      interestSenderAge: user1.age,
      interestSenderId: user1.oktaUserId,
      interestSenderImage: user1.images[0] || user1.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
      interestSenderName: user1.name,
      interestReceiverAge: user2.age,
      interestReceiverId: user2.oktaUserId,
      interestReceiverImage: user2.images[0] || user2.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
      interestReceiverName: user2.name,
      isAccepted: false,
      isRejected: false,
    });

    // Also...
    // Put the same interest object in interestsReceived array of User2
    user2.interestsReceived.push({
      conversations: [],
      interestSenderAge: user1.age,
      interestSenderId: user1.oktaUserId,
      interestSenderImage: user1.images[0] || user1.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
      interestSenderName: user1.name,
      interestReceiverAge: user2.age,
      interestReceiverId: user2.oktaUserId,
      interestReceiverImage: user2.images[0] || user2.gender === 'male' ? maleImagePlaceholder : femaleImagePlaceholder,
      interestReceiverName: user2.name,
      isAccepted: false,
      isRejected: false,
    });

    /**=============================================================== */
    await user1.save();
    await user2.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Interest sent!',
    });
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    // console.log(error);
    await session.abortTransaction();
    session.endSession();
    return next(new CustomErrorResponse('Interest not sent. Please try later!', 500));
  }
});

// @desc   Accept an Interest
// @route  PUT /api/v1/interests/accept?sender=oktaUserId1&receiver=oktaUserId2
// @access Private

// In One go... isAccepted property in interest object must be updated to "true" for
// both sender and receiver.
// User1 is interest Sender. Interest object will be in interestsSent array of User 1
// User2 is interest Receiver. Interest object will be in interestsReceived array of User 2
// User2 can accept interest. Because User2 "received" the interest.
// When he does that... update isAccepted to "true" for both
exports.acceptInterest = asyncHandler(async (req, res, next) => {
  const oktaUserId1 = req.query.sender;
  const oktaUserId2 = req.query.receiver;
  const session = await User.startSession();

  try {
    session.startTransaction();

    let user1 = await User.find({ oktaUserId: oktaUserId1 });
    user1 = user1[0];
    let user2 = await User.find({ oktaUserId: oktaUserId2 });
    user2 = user2[0];
    /**=============================================================== */

    user2.interestsReceived = user2.interestsReceived.map((interest) => {
      // First identify the interest object which must be updated.
      if (String(interest.interestSenderId) === user1.oktaUserId) {
        interest.isAccepted = true;
      }
      return interest;
    });

    // Also...
    // Put update same interest object in interestsSent array of User1

    user1.interestsSent = user1.interestsSent.map((interest) => {
      // First identify the interest object to be updated.
      if (String(interest.interestReceiverId) === user2.oktaUserId) {
        interest.isAccepted = true;
      }
      return interest;
    });

    /**=============================================================== */
    await user1.save();
    await user2.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Interest accepted!',
    });
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    // console.log(error);
    await session.abortTransaction();
    session.endSession();
    return next(new CustomErrorResponse('Error accepting interest. Please try later!', 500));
  }
});

// @desc   Decline an Interest
// @route  PUT /api/v1/interests/decline?sender=oktaUserId1&receiver=oktaUserId2
// @access Private

// Receiver of an interest can decline an interest.
// User 1 is sender & User 2 is receiver.
// So, update isRejected to "true" in interest object in interestsReceived array of User2
// Also, update isRejected to "true" in interest object in interestsSent array of User1
exports.declineInterest = asyncHandler(async (req, res, next) => {
  const oktaUserId1 = req.query.sender;
  const oktaUserId2 = req.query.receiver;
  const session = await User.startSession();

  try {
    session.startTransaction();

    let user1 = await User.find({ oktaUserId: oktaUserId1 });
    user1 = user1[0];
    let user2 = await User.find({ oktaUserId: oktaUserId2 });
    user2 = user2[0];
    /**=============================================================== */

    user2.interestsReceived = user2.interestsReceived.map((interest) => {
      // First identify the interest object which must be updated.
      if (String(interest.interestSenderId) === user1.oktaUserId) {
        interest.isRejected = true;
      }
      return interest;
    });

    // Also...
    // Put update same interest object in interestsSent array of User1

    user1.interestsSent = user1.interestsSent.map((interest) => {
      // First identify the interest object to be updated.
      if (String(interest.interestReceiverId) === user2.oktaUserId) {
        interest.isRejected = true;
      }
      return interest;
    });

    /**=============================================================== */
    await user1.save();
    await user2.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Interest rejected!',
    });
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    // console.log(error);
    await session.abortTransaction();
    session.endSession();
    return next(new CustomErrorResponse('Error rejecting interest. Please try later!', 500));
  }
});

// @desc   Cancel an Interest
// @route  PUT /api/v1/interests/cancel?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
exports.cancelInterest = asyncHandler(async (req, res, next) => {
  const oktaUserId1 = req.query.sender;
  const oktaUserId2 = req.query.receiver;
  const session = await User.startSession();

  try {
    session.startTransaction();

    let user1 = await User.find({ oktaUserId: oktaUserId1 });
    user1 = user1[0];
    let user2 = await User.find({ oktaUserId: oktaUserId2 });
    user2 = user2[0];

    /**=============================================================== */

    // Remove sent interest from user1's interestsSent array and
    // Remove received interest from user2's interestsReceived array

    // Only an unaccepted interest can be cancelled.
    user1.interestsSent = user1.interestsSent.filter((interest) => {
      if (interest.isAccepted === false && interest.interestReceiverId === oktaUserId2) {
        return false;
      }
      return true;
    });

    user2.interestsReceived = user2.interestsReceived.filter((interest) => {
      if (interest.isAccepted === false && interest.interestSenderId === oktaUserId1) {
        return false;
      }
      return true;
    });

    /**=============================================================== */

    await user1.save();
    await user2.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Interest Cancelled!',
    });
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    // console.log(error);
    await session.abortTransaction();
    session.endSession();
    return next(new CustomErrorResponse('Could not cancel interest. Please try later!', 500));
  }
});
