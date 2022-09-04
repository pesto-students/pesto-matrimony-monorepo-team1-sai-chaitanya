const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const mongoose = require('mongoose');
// const updateConversations = require("../utilities/mongooseTransaction");

// @desc   Send a New Message
// @route  POST /api/v1/conversations
// @access Public
// In One go...the message sent MUST be in "conversations" array of both user1 and user2.
// Otherwise, consider that attempt to send message as failure. So a MongoDB/Mongoose Transaction must be used.
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const message = req.body;
  const userID1 = req.query.sender;
  const userID2 = req.query.receiver;
  const session = await User.startSession();
  try {
    session.startTransaction();

    const user1 = await User.findById(userID1);
    const user2 = await User.findById(userID2);

    /**=============================================================== */
    // User1 wants to send Message/Interest to User2

    // NOTE: Messages are stored in an interest object's conversations property(array).

    // STEP 1
    // Determine if it is User1 who first sent the interest.
    const didUser1SendInterestToUser2 = user1.interestsSent.some((interest) => String(interest.sentTo) === userID2);
    // Determine if it is User1 who first received the interest.
    const didUser1ReceiveInterestFromUser2 = user1.interestsReceived.some((interest) =>
      String(interest.receivedFrom === userID2)
    );
    // If User1 is the first sender, then interest object will be in interestsSent Array
    // If User1 is the first receiver, then interest object will be in interestsReceived Array
    // Based on the location of interest object, update its conversations array...
    if (didUser1SendInterestToUser2) {
      user1.interestsSent = user1.interestsSent.map((interest) => {
        if (String(interest.sentTo) === userID2) {
          interest.conversations.push(message);
        }
        return interest;
      });
    } else if (didUser1ReceiveInterestFromUser2) {
      user1.interestsReceived = user1.interestsReceived.map((interest) => {
        if (String(interest.receivedFrom) === userID2) {
          interest.conversations.push(message);
        }
        return interest;
      });
    } else {
      // If interest object is not present in both, then User1 becomes first sender of an interest/message.
      // So add that interest object to interestsSent array of User1
      user1.interestsSent.push({ sentTo: userID2, conversations: [message] });
    }

    // STEP 2
    // Determine if it is User2 who first received the interest.
    let didUser2ReceiveInterestFromUser1 = user2.interestsReceived.some(
      (interest) => String(interest.receivedFrom) === userID1
    );
    // Determine if it is User2 who first sent the interest.
    let didUser2SendInterestToUser1 = user2.interestsSent.some((interest) => String(interest.sentTo) === userID1);
    // If User2 is the first sender, then interest object will be in interestsSent Array
    // If User2 is the first receiver, then interest object will be in interestsReceived Array
    // Based on the location of interest object, update its conversations array...
    if (didUser2ReceiveInterestFromUser1) {
      user2.interestsReceived = user2.interestsReceived.map((interest) => {
        if (String(interest.receivedFrom) === userID1) {
          interest.conversations.push(message);
        }
        return interest;
      });
    } else if (didUser2SendInterestToUser1) {
      user2.interestsSent = user2.interestsSent.map((interest) => {
        if (String(interest.sentTo) === userID1) {
          interest.conversations.push(message);
        }
        return interest;
      });
    } else {
      // If interest object is not present in both, then User2 becomes first receiver of an interest/message.
      // So add that interest object to interestsReceived array of User2
      user2.interestsReceived.push({ receivedFrom: userID1, conversations: [message] });
    }
    /**=============================================================== */
    await user1.save();
    await user2.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Message sent !',
    });
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    // console.log(error);
    await session.abortTransaction();
    session.endSession();
    return next(new CustomErrorResponse('Message not sent !', 500));
  }
});

exports.markMessageAsRead = asyncHandler(async (req, res, next) => {
  const messageIdToMarkAsRead = req.query.messageId;
  const userId = req.params.userId;
  const user = await User.findById(userId);

  // Search For the Message to be marked as Read in both interestsReceived & interestsSent Arrays
  user.interestsReceived = user.interestsReceived.map((interest) => {
    interest.conversations.map((message) => {
      if (String(message.id) === messageIdToMarkAsRead) {
        message.isRead = true;
      }
      return message;
    });
    return interest;
  });

  // Search For the Message to be marked as Read in interestsSent Array
  user.interestsSent = user.interestsSent.map((interest) => {
    interest.conversations.map((message) => {
      if (String(message.id) === messageIdToMarkAsRead) {
        message.isRead = true;
      }
      return message;
    });
    return interest;
  });

  await user.save();

  console.log('marked as read!!!!!');

  res.status(200).json({
    success: true,
    message: 'Message marked as read !',
    data: user,
  });
});

exports.getMessages = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  res.status(200).json({
    success: true,
    message: 'Data Retrieved Successfull !',
    interestsReceived: [...user.interestsReceived],
    interestsSent: [...user.interestsSent],
  });
});

exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const idOfMessageToBeDeleted = req.query.messageId;
  const userId = req.params.userId;
  const user = await User.findById(userId);

  // Search For the Message to be marked as Read in both interestsReceived & interestsSent Arrays
  user.interestsReceived = user.interestsReceived.map((interest) => {
    interest.conversations = interest.conversations.filter((message) => {
      return String(message.id) !== idOfMessageToBeDeleted;
    });
    return interest;
  });

  // Search For the Message to be marked as Read in interestsSent Array
  user.interestsSent = user.interestsSent.map((interest) => {
    interest.conversations = interest.conversations.filter((message) => {
      return String(message.id) !== idOfMessageToBeDeleted;
    });
    return interest;
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Message deleted !',
    data: user,
  });
});
