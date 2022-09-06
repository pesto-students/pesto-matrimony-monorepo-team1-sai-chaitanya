const asyncHandler = require('../middleware/async');
const User = require('../models/Users');
const CustomErrorResponse = require('../utilities/errorResponse');
const mongoose = require('mongoose');
// const updateConversations = require("../utilities/mongooseTransaction");

// @desc   Send a New Message
// @route  POST /api/v1/conversations?receiver="receiverID"&sender="senderID"
// @access Public
// In One go...the message sent MUST be in "conversations" array of both user1 and user2.
// Otherwise, consider that attempt to send message as failure. So a MongoDB/Mongoose Transaction must be used.
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const userID1 = req.query.sender;
  const userID2 = req.query.receiver;
  // I want the message object to have SAME _id in both users
  // This will help me to enable read receipts

  const message = {
    _id: new mongoose.Types.ObjectId(),
    message: req.body.message,
    messageSenderId: userID1,
    messageReceiverId: userID2,
    isRead: false,
  };
  console.log(message);
  const session = await User.startSession();
  try {
    session.startTransaction();

    const user1 = await User.findById(userID1);
    const user2 = await User.findById(userID2);

    /**=============================================================== */
    // User1 wants to send Message to User2

    // NOTE: Messages are stored in an interest object's conversations property(array).

    // STEP 1
    // Determine if it is User1 who first sent the interest.
    const didUser1SendInterestToUser2 = user1.interestsSent.some(
      (interest) => String(interest.interestReceiverId) === userID2
    );
    // Determine if it is User1 who first received the interest.
    const didUser1ReceiveInterestFromUser2 = user1.interestsReceived.some((interest) =>
      String(interest.interestSenderId === userID2)
    );
    // If User1 is the first sender, then interest object will be in interestsSent Array
    // If User1 is the first receiver, then interest object will be in interestsReceived Array
    // Based on the location of interest object, update its conversations array...
    if (didUser1SendInterestToUser2) {
      // if user1 is the interest sender. So update interest object in interestsSent array of user 1
      user1.interestsSent = user1.interestsSent.map((interest) => {
        if (String(interest.interestReceiverId) === userID2) {
          interest.conversations.push(message);
        }
        return interest;
      });
      // if user1 is the interest sender, then user2 is interest receiver.
      // so interest object will be in user2's interestsReceived array
      user2.interestsReceived = user2.interestsReceived.map((interest) => {
        if (String(interest.interestSenderId) === userID1) {
          interest.conversations.push(message);
        }
        return interest;
      });
    } else if (didUser1ReceiveInterestFromUser2) {
      // user1 is interest receiver. Hence, update interest object in interestsReceived array of user1
      user1.interestsReceived = user1.interestsReceived.map((interest) => {
        if (String(interest.interestSenderId) === userID2) {
          interest.conversations.push(message);
        }
        return interest;
      });
      // if user1 is the interest receiver.
      // then user2 is the interest sender. So update interest object in interestsSent array of user2
      user2.interestsSent = user2.interestsSent.map((interest) => {
        if (String(interest.interestReceiverId) === userID1) {
          interest.conversations.push(message);
        }
        return interest;
      });
    } else {
      // If interest object is not present in both, then message cant be sent.
      throw `Permission denied.`;
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
    return next(new CustomErrorResponse('Message not sent! Please try later', 500));
  }
});

// @desc   Mark all messages between two users as "Read"
// @route  PUT /api/v1/conversations?user1="userID1"&user2="userID2"
// @access Private
exports.markMessagesAsRead = asyncHandler(async (req, res, next) => {
  const userID1 = req.query.user1;
  const userID2 = req.query.user2;

  const session = await User.startSession();
  try {
    session.startTransaction();

    const user1 = await User.findById(userID1);
    const user2 = await User.findById(userID2);

    // STEP 1
    // Determine if it is User1 who first sent the interest.
    const didUser1SendInterestToUser2 = user1.interestsSent.some(
      (interest) => String(interest.interestReceiverId) === userID2
    );
    // Determine if it is User1 who first received the interest.
    const didUser1ReceiveInterestFromUser2 = user1.interestsReceived.some((interest) =>
      String(interest.interestSenderId === userID2)
    );

    if (didUser1SendInterestToUser2) {
      // if User1 sent interest to User2, then...
      // 1. Identify the interest object specific to user2 in interestsSent array of user1
      // 2. Then update the conversations array of that object, mark all messages as read.
      // 3. Also, find the interest object specific to user 1 in interestsReceived array of user2
      // 4. Update conversations array of that object by marking all messages as read.
      user1.interestsSent = user1.interestsSent.map((interest) => {
        if (String(interest.interestReceiverId) === user2.id) {
          // marking all unread messages as read.
          interest.conversations = interest.conversations.map((message) => {
            if (!message.isRead) {
              message.isRead = true;
            }
            return message;
          });
        }
        return interest;
      });

      user2.interestsReceived = user2.interestsReceived.map((interest) => {
        if (String(interest.interestSenderId) === user1.id) {
          // marking all messages as read.
          interest.conversations = interest.conversations.map((message) => {
            if (!message.isRead) {
              message.isRead = true;
            }
            return message;
          });
        }
        return interest;
      });
    } else if (didUser1ReceiveInterestFromUser2) {
      // if User1 sent received interest from User2, then...
      // 1. Identify the interest object specific to user2 in interestsReceived array of user1
      // 2. Then update the conversations array of that object, mark all messages as read.
      // 3. Also, find the interest object specific to user 1 in interestsSent array of user2
      // 4. Update conversations array of that object by marking all messages as read.
      user1.interestsReceived = user1.interestsReceived.map((interest) => {
        if (String(interest.interestSenderId) === user2.id) {
          // marking all messages as read.
          interest.conversations = interest.conversations.map((message) => {
            if (!message.isRead) {
              message.isRead = true;
            }
            return message;
          });
        }
        return interest;
      });

      user2.interestsSent = user2.interestsSent.map((interest) => {
        if (String(interest.interestReceiverId) === user1.id) {
          interest.conversations = interest.conversations.map((message) => {
            // marking all messages as read.
            if (!message.isRead) {
              message.isRead = true;
            }
            return message;
          });
        }
        return interest;
      });
    } else {
      throw 'Permission denied.';
    }

    await user1.save();
    await user2.save();
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    // console.log(error);
    await session.abortTransaction();
    session.endSession();
    return next(new CustomErrorResponse('Error! Please try later', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Messages marked as read !',
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
