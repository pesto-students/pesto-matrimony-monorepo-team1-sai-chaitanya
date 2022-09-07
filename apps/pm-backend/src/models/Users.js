const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  messageSenderId: {
    type: mongoose.SchemaTypes.ObjectId,
    trim: true,
  },
  messageReceiverId: {
    type: mongoose.SchemaTypes.ObjectId,
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
    required: [true, 'Email is missing!'],
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
  },
  height: {
    type: Number,
    trim: true,
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
    default: 'Never Married',
    enum: ['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed'],
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
    default: '',
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

  //store mongoDB Ids of all shortlisted users.
  shortlistedMatches: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
  },

  // for each interest received... a unique object is created.
  // Subsequent messages "to & from" the sender are stored in conversations array inside the object.
  interestsReceived: [
    {
      interestSenderAge: { type: Number },
      interestSenderId: { type: mongoose.SchemaTypes.ObjectId },
      interestSenderImage: { type: String },
      interestSenderName: { type: String },
      interestReceiverAge: { type: Number },
      interestReceiverId: { type: mongoose.SchemaTypes.ObjectId },
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
      interestSenderId: { type: mongoose.SchemaTypes.ObjectId },
      interestSenderImage: { type: String },
      interestSenderName: { type: String },
      interestReceiverAge: { type: Number },
      interestReceiverId: { type: mongoose.SchemaTypes.ObjectId },
      interestReceiverImage: { type: String },
      interestReceiverName: { type: String },
      isAccepted: { type: Boolean, default: false },
      isRejected: { type: Boolean, default: false },
      conversations: [MessageSchema],
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
