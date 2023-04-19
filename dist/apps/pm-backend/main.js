/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/pm-backend/src/config/database.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const mongoose = __webpack_require__("mongoose");
const dbConnection = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('Connecting to mongoDB...');
    const connection = yield mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB connection successful !`);
});
module.exports = dbConnection;


/***/ }),

/***/ "./apps/pm-backend/src/controllers/admin.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const okta = __webpack_require__("@okta/okta-sdk-nodejs");
//getting all users profiles
exports.getAllUsersProfiles = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield User.find();
        res.status(200).json({ user: allUsers });
    }
    catch (error) {
        return next(new CustomErrorResponse('Error! Please try later', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/conversations.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const mongoose = __webpack_require__("mongoose");
// @desc   Send a New Message
// @route  POST /api/v1/conversations?receiver="receiverID"&sender="senderID"
// @access Private
// In One go...the message sent MUST be in "conversations" array of both user1 and user2.
// Otherwise, consider that attempt to send message as failure. So a MongoDB/Mongoose Transaction must be used.
exports.sendMessage = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    // I want the message object to have SAME _id in both users
    // This will help me to enable read receipts
    const message = {
        message: req.body.message,
        messageSenderId: oktaUserId1,
        messageReceiverId: oktaUserId2,
        isRead: false,
    };
    console.log(message);
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        /**=============================================================== */
        // User1 wants to send Message to User2
        // NOTE: Messages are stored in an interest object's conversations property(array).
        // STEP 1
        // Determine if it is User1 who first sent the interest.
        const didUser1SendInterestToUser2 = user1.interestsSent.some((interest) => String(interest.interestReceiverId) === oktaUserId2);
        // Determine if it is User1 who first received the interest.
        const didUser1ReceiveInterestFromUser2 = user1.interestsReceived.some((interest) => String(interest.interestSenderId === oktaUserId2));
        // If User1 is the first sender, then interest object will be in interestsSent Array
        // If User1 is the first receiver, then interest object will be in interestsReceived Array
        // Based on the location of interest object, update its conversations array...
        if (didUser1SendInterestToUser2) {
            // if user1 is the interest sender. So update interest object in interestsSent array of user 1
            user1.interestsSent = user1.interestsSent.map((interest) => {
                if (String(interest.interestReceiverId) === oktaUserId2) {
                    interest.conversations.push(message);
                }
                return interest;
            });
            // if user1 is the interest sender, then user2 is interest receiver.
            // so interest object will be in user2's interestsReceived array
            user2.interestsReceived = user2.interestsReceived.map((interest) => {
                if (String(interest.interestSenderId) === oktaUserId1) {
                    interest.conversations.push(message);
                }
                return interest;
            });
        }
        else if (didUser1ReceiveInterestFromUser2) {
            // user1 is interest receiver. Hence, update interest object in interestsReceived array of user1
            user1.interestsReceived = user1.interestsReceived.map((interest) => {
                if (String(interest.interestSenderId) === oktaUserId2) {
                    interest.conversations.push(message);
                }
                return interest;
            });
            // if user1 is the interest receiver.
            // then user2 is the interest sender. So update interest object in interestsSent array of user2
            user2.interestsSent = user2.interestsSent.map((interest) => {
                if (String(interest.interestReceiverId) === oktaUserId1) {
                    interest.conversations.push(message);
                }
                return interest;
            });
        }
        else {
            // If interest object is not present in both, then message cant be sent.
            throw `Permission denied.`;
        }
        /**=============================================================== */
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Message sent !',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Message not sent! Please try later', 500));
    }
}));
// @desc   Mark all messages between two users as "Read"
// @route  PUT /api/v1/conversations?user1="oktaUserId1"&user2="oktaUserId2"
// @access Private
exports.markMessagesAsRead = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.user1;
    const oktaUserId2 = req.query.user2;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        // STEP 1
        // Determine if it is User1 who first sent the interest.
        const didUser1SendInterestToUser2 = user1.interestsSent.some((interest) => String(interest.interestReceiverId) === oktaUserId2);
        // Determine if it is User1 who first received the interest.
        const didUser1ReceiveInterestFromUser2 = user1.interestsReceived.some((interest) => String(interest.interestSenderId === oktaUserId2));
        if (didUser1SendInterestToUser2) {
            // if User1 sent interest to User2, then...
            // 1. Identify the interest object specific to user2 in interestsSent array of user1
            // 2. Then update the conversations array of that object, mark all messages as read.
            // 3. Also, find the interest object specific to user 1 in interestsReceived array of user2
            // 4. Update conversations array of that object by marking all messages as read.
            user1.interestsSent = user1.interestsSent.map((interest) => {
                if (String(interest.interestReceiverId) === user2.oktaUserId) {
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
                if (String(interest.interestSenderId) === user1.oktaUserId) {
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
        }
        else if (didUser1ReceiveInterestFromUser2) {
            // if User1 sent received interest from User2, then...
            // 1. Identify the interest object specific to user2 in interestsReceived array of user1
            // 2. Then update the conversations array of that object, mark all messages as read.
            // 3. Also, find the interest object specific to user 1 in interestsSent array of user2
            // 4. Update conversations array of that object by marking all messages as read.
            user1.interestsReceived = user1.interestsReceived.map((interest) => {
                if (String(interest.interestSenderId) === user2.oktaUserId) {
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
                if (String(interest.interestReceiverId) === user1.oktaUserId) {
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
        }
        else {
            throw 'Permission denied.';
        }
        yield user1.save();
        yield user2.save();
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Error! Please try later', 500));
    }
    res.status(200).json({
        success: true,
        message: 'Messages marked as read !',
    });
}));
// @desc   Get all messages between two users as "Read"
// @route  GET /api/v1/conversations/:oktaUserId
// @access Private
exports.getMessages = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.find({ oktaUserId: req.params.oktaUserId });
        user = user[0];
        console.log(user);
        if (!user) {
            return next(new CustomErrorResponse(`User not found!`, 404));
        }
        res.status(200).json({
            success: true,
            message: 'Data Retrieved Successfull !',
            interestsReceived: [...user.interestsReceived],
            interestsSent: [...user.interestsSent],
        });
    }
    catch (error) {
        return next(new CustomErrorResponse(`Error! Please try later`, 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/interests.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const mongoose = __webpack_require__("mongoose");
// @desc   Send a New Interest
// @route  POST /api/v1/interests?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
// In One go...the interest sent MUST be in "interestsSent" array of Sender and "interestsReceived" array of Receiver.
// Otherwise, consider that attempt to send interest as failure. So a MongoDB/Mongoose Transaction must be used.
exports.sendInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    console.log('oktaUserId1 ', oktaUserId1);
    console.log('oktaUserId2 ', oktaUserId2);
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
        user2 = user2[0];
        /**=============================================================== */
        // User1 wants to send Interest to User2
        // NOTE: Interests are stored as objects in interestsSender array of Sender(User1)
        // & also in interestsReceived array of Receiver(User2).
        // Step 1: Determine if User1 already send or received interest to/from User 2 ?
        // If Yes, then throw error that You've already sent/received interest to User 2
        // Checking interestsSent and interestsReceived array of User1
        const didUser1AlreadySendInterestToUser2 = user1.interestsSent.some((interest) => interest.interestReceiverId === oktaUserId2);
        console.log('didUser1AlreadySendInterestToUser2', didUser1AlreadySendInterestToUser2);
        if (didUser1AlreadySendInterestToUser2) {
            yield session.abortTransaction();
            session.endSession();
            console.log("sending error message to frontend....");
            return next(new CustomErrorResponse(`Interest already sent to ${user2.name}. Please wait for response. If your interest was accepted before, this profile is already in "Accepted" list. Please check.`, 400));
        }
        const didUser1AlreadyReceiveInterestFromUser2 = user1.interestsReceived.some((interest) => interest.interestSenderId === oktaUserId2);
        console.log('didUser1AlreadyReceiveInterestFromUser2', didUser1AlreadyReceiveInterestFromUser2);
        if (didUser1AlreadyReceiveInterestFromUser2) {
            yield session.abortTransaction();
            session.endSession();
            return next(new CustomErrorResponse(`Interest already received from ${user2.name}. Please respond to it. If you've already accepted her interest, please check "Accepted" list.`, 400));
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
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest sent!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Interest not sent. Please try later!', 500));
    }
}));
// @desc   Accept an Interest
// @route  PUT /api/v1/interests/accept?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
// In One go... isAccepted property in interest object must be updated to "true" for
// both sender and receiver.
// User1 is interest Sender. Interest object will be in interestsSent array of User 1
// User2 is interest Receiver. Interest object will be in interestsReceived array of User 2
// User2 can accept interest. Because User2 "received" the interest.
// When he does that... update isAccepted to "true" for both
exports.acceptInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
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
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest accepted!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Error accepting interest. Please try later!', 500));
    }
}));
// @desc   Decline an Interest
// @route  PUT /api/v1/interests/decline?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
// Receiver of an interest can decline an interest.
// User 1 is sender & User 2 is receiver.
// So, update isRejected to "true" in interest object in interestsReceived array of User2
// Also, update isRejected to "true" in interest object in interestsSent array of User1
exports.declineInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
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
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest rejected!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Error rejecting interest. Please try later!', 500));
    }
}));
// @desc   Cancel an Interest
// @route  PUT /api/v1/interests/cancel?sender=oktaUserId1&receiver=oktaUserId2
// @access Private
exports.cancelInterest = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const oktaUserId1 = req.query.sender;
    const oktaUserId2 = req.query.receiver;
    const session = yield User.startSession();
    try {
        session.startTransaction();
        let user1 = yield User.find({ oktaUserId: oktaUserId1 });
        user1 = user1[0];
        let user2 = yield User.find({ oktaUserId: oktaUserId2 });
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
        yield user1.save();
        yield user2.save();
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({
            success: true,
            message: 'Interest Cancelled!',
        });
    }
    catch (error) {
        // If an error occurred, abort the whole transaction and
        // undo any changes that might have happened
        // console.log(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new CustomErrorResponse('Could not cancel interest. Please try later!', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/recommendations.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
// @desc   Get Recommendations
// @route  GET /api/v1/recommendations/:oktaUserId
// @access Private
exports.getRecommendations = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield User.find({ oktaUserId: req.params.oktaUserId });
        if (!currentUser) {
            return next(new CustomErrorResponse(`User not found!`, 404));
        }
        const currentUserGender = currentUser[0].gender;
        const currentUserAge = currentUser[0].age;
        const currentUserReligion = currentUser[0].religion;
        const profiles = yield User.find({ gender: { $ne: currentUserGender } }).exec();
        //Recommendations based on gender, age and religion
        const recommendations = profiles.filter((profile) => {
            return ((currentUserGender === 'male' ? profile.age <= currentUserAge : profile.age >= currentUserAge) &&
                (currentUserReligion ? profile.religion === currentUserReligion : true));
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
    }
    catch (error) {
        return next(new CustomErrorResponse('Error!. Please try later!', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/search.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const MINIMUM_HEIGHT_IN_CMS = 122;
const MAXIMUM_HEIGHT_IN_CMS = 214;
const MINIMUM_ALLOWED_AGE = 21;
const MAXIMUM_ALLOWED_AGE = 50;
// @desc   Search Profiles
// @route  POST /api/v1/users/search/:oktaUserId
// @access Private
exports.searchProfiles = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('search route has been hit...');
        const currentUser = yield User.find({ oktaUserId: req.params.oktaUserId });
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
        const profiles = yield User.find({ gender: { $ne: currentUserGender } }).exec();
        // filter opposite gender profiles as per search preferences.
        const matchingProfiles = profiles.filter((profile) => {
            return (profile.age >= minAge &&
                profile.age <= maxAge &&
                profile.height >= minHeight &&
                profile.height <= maxHeight &&
                (city ? profile.location === city : true) &&
                (country ? profile.country === country : true) &&
                (motherTongue ? profile.motherTongue === motherTongue : true) &&
                (marriageStatus ? profile.marriageStatus === marriageStatus : true) &&
                (religion ? profile.religion === religion : true) &&
                (state ? profile.state === state : true));
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
    }
    catch (error) {
        return next(new CustomErrorResponse('Error!. Please try later!', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/shortlist.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const okta = __webpack_require__("@okta/okta-sdk-nodejs");
// @desc   Shortlist Profiles
// @route  PUT /api/v1/toggleShortlist?shortlister=oktaUserId1&shorlistee=oktaUserId2
// @access Private
exports.toggleShortlist = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const shortlisterOktaId = req.query.shortlister;
    const shortlisteeOktaId = req.query.shortlistee;
    console.log(shortlisterOktaId);
    console.log(shortlisteeOktaId);
    try {
        // user who wants to shortlist
        let shortlister = yield User.find({ oktaUserId: shortlisterOktaId });
        shortlister = shortlister[0];
        const { shortlistedMatches } = shortlister;
        // user who is being shortlisted
        let shortlistee = yield User.find({ oktaUserId: shortlisteeOktaId });
        shortlistee = shortlistee[0];
        // Did shortlister already shortlist shortlistee ?
        const wasAlreadyShortlisted = shortlister.shortlistedMatches.some((oktaId) => oktaId === shortlisteeOktaId);
        // console.log(wasAlreadyShortlisted);
        if (wasAlreadyShortlisted) {
            // If Yes... then remove from shortlist
            shortlister.shortlistedMatches = shortlister.shortlistedMatches.filter((oktaId) => oktaId !== shortlisteeOktaId);
        }
        else {
            // If No, then shortlist
            shortlister.shortlistedMatches = [...shortlistedMatches, shortlisteeOktaId];
        }
        yield shortlister.save();
        const message = wasAlreadyShortlisted
            ? `${shortlistee.name} has been removed from your shortlist`
            : `${shortlistee.name} was added to your shortlisted profiles`;
        res.status(200).json({
            success: true,
            message,
        });
    }
    catch (error) {
        return next(new CustomErrorResponse('Please try later', 500));
    }
}));


/***/ }),

/***/ "./apps/pm-backend/src/controllers/users.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const tslib_1 = __webpack_require__("tslib");
const asyncHandler = __webpack_require__("./apps/pm-backend/src/middleware/async.js");
const User = __webpack_require__("./apps/pm-backend/src/models/Users.js");
const CustomErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const okta = __webpack_require__("@okta/okta-sdk-nodejs");
// @desc   Register a new Profile
// @route  POST /api/v1/users/
// @access Public
/** ----------------------------------------- */
//signing up user into okta
exports.oktaSignUp = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let oldToken = "00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P";
    let newToken = "005Rdx3XVIzg2sRAFbBi-QX2_PYZul-cpCulQRgxfw";
    try {
        const client = new okta.Client({
            orgUrl: 'https://dev-42684472.okta.com/',
            token: newToken,
        });
        const body = req.body;
        // async function createUserInOkta() {
        const response = yield client.createUser(body);
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
        //creting user in mongo db with data from the okta
        const user = yield User.create(mongoUser);
        res.status(200).send({
            res: user,
        });
    }
    catch (err) {
        next(err);
    }
});
//find user in mongodb by oktaId
function findUserByOktaId(oktaId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const currentUser = yield User.find({ oktaUserId: oktaId });
        return currentUser;
    });
}
//getting userPrifileData
exports.getUserProfile = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const params = req.params;
    const oktaId = params.id;
    const currentUser = yield findUserByOktaId(oktaId);
    // const currentUser = await User.find({ oktaUserId: oktaId });
    if (!currentUser) {
        return next(new CustomErrorResponse(`User not found!`, 404));
    }
    res.status(200).json({ currentUser });
}));
//to upload image in mongodb
exports.uploadImageToMongoDb = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const imageUrl = req.body.imageUrlString;
    const currentUserId = req.body.oktaUserId;
    const currentUser = yield findUserByOktaId(currentUserId);
    // console.log(currentUser[0].images);
    const imageUrls = currentUser[0].images;
    if (!currentUser) {
        return next(new CustomErrorResponse(`User not found!`, 404));
    }
    yield User.updateOne({ oktaUserId: currentUserId }, { images: [...imageUrls, imageUrl] });
    res.status(200).json({ status: 'success' });
}));
/** ----------------------------------------- */
exports.updateUserProfile = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.params.userId;
    //getting mongodbId using oktaUserId
    // const user = await findUserByOktaId(currentUserId);
    // const mongoId = user[0]._id.toString()
    // console.log(mongoId);
    const body = req.body;
    if (!body) {
        return next(new CustomErrorResponse(`req.body is empty`, 400));
    }
    if (!currentUserId) {
        return next(new CustomErrorResponse(`Can't update data of non-existent user`, 400));
    }
    yield User.updateOne({ oktaUserId: currentUserId }, { $set: body });
    res.status(200).json({
        success: true,
        message: 'Updated User successfully',
        data: 'user',
    });
}));
/** ----------------------------------------- */
// @desc   Search Profiles
// @route  GET /api/v1/users/search/
// @access Private
exports.searchProfiles = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const searchCriteria = req.body;
    // NOTE : WORK IN PROGRESS....
    // Remove properties with 'undefined' values before perfmorming search in DB
    Object.keys(searchCriteria).forEach((key) => {
        if (searchCriteria[key] === undefined) {
            delete searchCriteria[key];
        }
    });
    let matchingProfiles = yield User.find({ name: 'john', age: { $gte: 18 } }).exec();
    // console.log(matchingProfiles);
    if (matchingProfiles.length < 1) {
        return next(new CustomErrorResponse(`Could not find matching profiles`, 400));
    }
    res.status(200).json({
        success: true,
        message: 'Updated User successfully',
        data: matchingProfiles,
    });
}));
exports.deleteImage = asyncHandler((req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const currentUserOktaId = req.params.userId;
    const imageArrayIndex = req.params.index;
    //geting currentUserData by OktaUserId
    const currentUserProfile = yield findUserByOktaId(currentUserOktaId);
    //image deleting logic
    currentUserProfile[0].images.splice(imageArrayIndex, 1);
    yield User.updateOne({ oktaUserId: currentUserOktaId }, { images: currentUserProfile[0].images });
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
}));


/***/ }),

/***/ "./apps/pm-backend/src/middleware/async.js":
/***/ ((module) => {

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = asyncHandler;
// This asyncHanlder() will wrap around all controller methods which do DB operations...
// If there is an error in DB Operation, asyncHandler() catches that error...
// Then passes it to errorHandler() middleware...
// Then the errorHandler middleware gives JSON as response.


/***/ }),

/***/ "./apps/pm-backend/src/middleware/error.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// All Errors in this Express Application come here...
// as errorHandler() is middleware function...
// This helps send a customized response after identifying the error.
const ErrorResponse = __webpack_require__("./apps/pm-backend/src/utilities/errorResponse.js");
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    //error handling for signup form
    if (err.errorCode === "E0000001") {
        handleDuplicateKeyError(err, res);
        return next();
    }
    // Duplicate Phone/Email Used while Registration
    if (err.code === 11000) {
        const message = `Email / Phone already used for registration.`;
        error = new ErrorResponse(message, 400); // 400 = bad request
    }
    if (err.code === 'E0000001') {
        const message = `password: This password was found in a list of commonly used passwords. Please try another password.`;
        error = new ErrorResponse(message, 400); // 400 = bad request
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        console.log(message);
        error = new ErrorResponse(message.join(' & '), 400);
    }
    res.json({
        success: false,
        error: error.message || 'Server Error',
    });
};
//error handling for signup form
const handleDuplicateKeyError = (err, res) => {
    if (err.errorSummary === "Api validation failed: login") {
        res.status(409).json({
            field: "login",
            message: `this user already exists in pesto matrimony.`
        });
    }
    else if (err.errorSummary === "Api validation failed: password") {
        res.status(409).json({
            field: "password",
            message: `this user already exists in pesto matrimony.`
        });
    }
};
module.exports = errorHandler;


/***/ }),

/***/ "./apps/pm-backend/src/models/Users.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const mongoose = __webpack_require__("mongoose");
const MessageSchema = new mongoose.Schema({
    messageSenderId: {
        type: String,
        trim: true,
    },
    messageReceiverId: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true,
        maxlength: [500, 'Message can not be more than 500 characters'],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is missing!'],
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    gender: {
        type: String,
        required: [true, 'Gender is missing!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is missing!'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    oktaUserId: {
        type: String,
        unique: true,
        required: [true, 'Okta User Id is missing !'],
    },
    images: {
        type: [String],
        default: [],
    },
    // Personal Information
    aboutMe: {
        type: String,
        trim: true,
        default: '',
    },
    age: {
        type: Number,
        trim: true,
        default: 21,
    },
    height: {
        type: Number,
        trim: true,
        default: 140,
    },
    weight: {
        type: Number,
        trim: true,
    },
    physique: {
        type: String,
        default: '',
        trim: true,
    },
    motherTongue: {
        type: String,
        trim: true,
        default: '',
    },
    marriageStatus: {
        type: String,
        trim: true,
        default: '',
    },
    citizenship: {
        type: String,
        trim: true,
        default: '',
    },
    country: {
        type: String,
        trim: true,
        default: '',
    },
    state: {
        type: String,
        trim: true,
        default: '',
    },
    location: {
        type: String,
        trim: true,
        default: '',
    },
    eatingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    smokingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    drinkingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    hobbies: {
        type: [String],
        default: [],
    },
    spokenLanguages: {
        type: [String],
        default: [],
    },
    // Education & Occupation Details
    employer: {
        type: String,
        default: '',
    },
    income: {
        type: Number,
    },
    occupation: {
        type: String,
        default: '',
    },
    qualification: {
        type: String,
        default: '',
    },
    // Family Details
    aboutFamily: {
        type: String,
        default: '',
    },
    brothers: {
        type: Number,
    },
    familyStatus: {
        type: String,
        default: '',
    },
    marriedBrothers: {
        type: Number,
    },
    marriedSisters: {
        type: Number,
    },
    sisters: {
        type: Number,
    },
    // Religious Details
    dateOfBirth: {
        type: String,
        trim: true,
        default: '',
    },
    timeOfBirth: {
        type: String,
        trim: true,
        default: '',
    },
    gothram: {
        type: String,
        trim: true,
        default: '',
    },
    placeOfBirth: {
        type: String,
        trim: true,
        default: '',
    },
    religion: {
        type: String,
        trim: true,
    },
    zodiacSign: {
        type: String,
        trim: true,
        default: '',
    },
    // Preference Details
    partnerAgeRange: {
        type: [Number],
        default: [21, 50],
    },
    partnerCountry: {
        type: String,
        default: '',
    },
    partnerEatingHabits: {
        type: String,
        trim: true,
        default: '',
    },
    partnerHeightRange: {
        type: [Number],
        default: [],
    },
    partnerIncomeRange: {
        type: [Number],
        default: [],
    },
    partnerMaritalStatus: {
        type: String,
        trim: true,
        default: '',
    },
    partnerMotherTongue: {
        type: String,
        trim: true,
        default: '',
    },
    partnerReligion: {
        type: String,
        trim: true,
        default: '',
    },
    phone: {
        type: String,
        default: '',
        trim: true,
        maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin'],
    },
    //store Ids of all shortlisted users.
    shortlistedMatches: {
        type: [String],
        default: [],
    },
    // for each interest received... a unique object is created.
    // Subsequent messages "to & from" the sender are stored in conversations array inside the object.
    interestsReceived: [
        {
            interestSenderAge: { type: Number },
            interestSenderId: { type: String },
            interestSenderImage: { type: String },
            interestSenderName: { type: String },
            interestReceiverAge: { type: Number },
            interestReceiverId: { type: String },
            interestReceiverImage: { type: String },
            interestReceiverName: { type: String },
            isAccepted: { type: Boolean, default: false },
            isRejected: { type: Boolean, default: false },
            conversations: [MessageSchema],
        },
    ],
    // for each interest sent... a unique object is created...
    // Subsequent messages "to & from" the receiver are stored in conversations array inside the object
    interestsSent: [
        {
            interestSenderAge: { type: Number },
            interestSenderId: { type: String },
            interestSenderImage: { type: String },
            interestSenderName: { type: String },
            interestReceiverAge: { type: Number },
            interestReceiverId: { type: String },
            interestReceiverImage: { type: String },
            interestReceiverName: { type: String },
            isAccepted: { type: Boolean, default: false },
            isRejected: { type: Boolean, default: false },
            conversations: [MessageSchema],
        },
    ],
});
module.exports = mongoose.model('User', UserSchema);


/***/ }),

/***/ "./apps/pm-backend/src/routes/admin.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
//importing controllers
const { getAllUsersProfiles } = __webpack_require__("./apps/pm-backend/src/controllers/admin.js");
const router = express.Router();
//getting all users of pesto-matrimony
router.route('/getallusers').get(getAllUsersProfiles);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/conversations.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const { getMessages, sendMessage, markMessagesAsRead } = __webpack_require__("./apps/pm-backend/src/controllers/conversations.js");
const router = express.Router();
// '/' in this router is equivalent to  '/api/v1/conversations'
// A message is an object in conversations array.
// All of these controller functions are working on that conversations array.
router.route('/').post(sendMessage).put(markMessagesAsRead);
router.route('/:oktaUserId').get(getMessages);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/interests.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const { acceptInterest, cancelInterest, declineInterest, sendInterest } = __webpack_require__("./apps/pm-backend/src/controllers/interests.js");
const router = express.Router();
// '/' in this router is equivalent to  '/api/v1/interests'
router.route('/').post(sendInterest);
router.route('/accept').put(acceptInterest);
router.route('/cancel').put(cancelInterest);
router.route('/decline').put(declineInterest);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/recommendations.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const router = express.Router();
const { getRecommendations } = __webpack_require__("./apps/pm-backend/src/controllers/recommendations.js");
// '/' in this router is equivalent to  '/api/v1/recommendations'
router.route('/:oktaUserId').get(getRecommendations);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/search.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const router = express.Router();
const { searchProfiles } = __webpack_require__("./apps/pm-backend/src/controllers/search.js");
// '/' in this router is equivalent to  '/api/v1/search'
router.route('/:oktaUserId').post(searchProfiles);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/shortlist.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const router = express.Router();
const { toggleShortlist } = __webpack_require__("./apps/pm-backend/src/controllers/shortlist.js");
// '/' in this router is equivalent to  '/api/v1/toggleShortlist'
router.route('/').put(toggleShortlist);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/routes/users.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const express = __webpack_require__("express");
const { getUserProfile, uploadImageToMongoDb, updateUserProfile, oktaSignUp, searchProfiles, deleteImage } = __webpack_require__("./apps/pm-backend/src/controllers/users.js");
const router = express.Router();
// '/' in this router is equivalent to  '/api/v1/users'
// Signup
router.route('/oktasignup').post(oktaSignUp);
router.route('/userprofile/:id').get(getUserProfile);
router.route('/imageupload').post(uploadImageToMongoDb);
//it was running for the admin
// router.route('/getallusers').get(getAllUsersProfiles)
// Update / Delete
router.route('/:userId').put(updateUserProfile);
// Fetch User Profiles
router.route('/search').get(searchProfiles);
router.route('/delete-image/:userId/:index').delete(deleteImage);
// Have to create another route & controller function for...
// handling search and filters with pagination..
// This route will have a lot of complex logic.
// updateUserProfile will only be used to update Profile details...
// NOT messages... although it is possible...
// For message flow... a separate route (conversations) is present
// Update
router.route('/:userId').put(updateUserProfile);
module.exports = router;


/***/ }),

/***/ "./apps/pm-backend/src/utilities/errorResponse.js":
/***/ ((module) => {

class CustomErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = CustomErrorResponse;


/***/ }),

/***/ "@okta/okta-sdk-nodejs":
/***/ ((module) => {

"use strict";
module.exports = require("@okta/okta-sdk-nodejs");

/***/ }),

/***/ "@sentry/node":
/***/ ((module) => {

"use strict";
module.exports = require("@sentry/node");

/***/ }),

/***/ "@sentry/tracing":
/***/ ((module) => {

"use strict";
module.exports = require("@sentry/tracing");

/***/ }),

/***/ "body-parser":
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "express":
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "mongoose":
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

"use strict";
module.exports = require("tslib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const cors = __webpack_require__("cors");
const express = __webpack_require__("express");
const dbConnection = __webpack_require__("./apps/pm-backend/src/config/database.js");
const errorHandler = __webpack_require__("./apps/pm-backend/src/middleware/error.js");
// const errMiddleware = require('./middleware/errMiddleware');
const bodyParser = __webpack_require__("body-parser");
const Sentry = __webpack_require__("@sentry/node");
const Tracing = __webpack_require__("@sentry/tracing");
// Connect to MongoDB
dbConnection();
// Start Express Server
const app = express();
// *****************Sentry Code Start*****************
// Sentry.init({
//   dsn: 'https://e1d7d0bf5be74e7b99f42b24a991095a@o1408574.ingest.sentry.io/6744194',
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({ tracing: true }),
//     // enable Express.js middleware tracing
//     new Tracing.Integrations.Express({ app }),
//   ],
//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
// app.use(Sentry.Handlers.requestHandler());
// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());
// *****************Sentry Code End*****************
app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// importing routes
const admin = __webpack_require__("./apps/pm-backend/src/routes/admin.js");
const conversations = __webpack_require__("./apps/pm-backend/src/routes/conversations.js");
const interests = __webpack_require__("./apps/pm-backend/src/routes/interests.js");
const recommendations = __webpack_require__("./apps/pm-backend/src/routes/recommendations.js");
const search = __webpack_require__("./apps/pm-backend/src/routes/search.js");
const toggleShortlist = __webpack_require__("./apps/pm-backend/src/routes/shortlist.js");
const users = __webpack_require__("./apps/pm-backend/src/routes/users.js");
// mounting routes
app.use('/api/v1/admin', admin);
app.use('/api/v1/conversations', conversations);
app.use('/api/v1/interests', interests);
app.use('/api/v1/recommendations', recommendations);
app.use('/api/v1/search', search);
app.use('/api/v1/toggleShortlist', toggleShortlist);
app.use('/api/v1/users', users);
console.log('mounting routes completed...');
// *****************Sentry Related*****************
// Sentry Error Handler
// The error handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler());
// *****************Sentry Related*****************
// Custom Error Handler
//Handling Unhandled routes. it should be placed after the routes.
// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server !`,
//   });
// });
// error Handling middlewre.
app.use(errorHandler);
// app.use(errMiddleware);
const server = app.listen(process.env.PORT || 8000, console.log(`Server is listening on port : ${process.env.PORT || 8000}\nMode: ${"development".toUpperCase()}`));
// Error in connecting to MongoDB triggers unhandledRejection at global level
// That is being handled here. This stops server if MongoDB is NOT connected.
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map