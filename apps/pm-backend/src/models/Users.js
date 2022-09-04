const mongoose = require('mongoose');

const Preferences = new mongoose.Schema({
  religion: {
    type: String,
    trim: true,
    enum: ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Bahai'],
  },
  maritalStatus: {
    type: String,
    trim: true,
    enum: ['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed', 'Annulled'],
  },
});

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    trim: true,
  },
  receiver: {
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
  createdFor: {
    type: String,
    enum: ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative', 'Client'],
  },
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
    dropDups: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  oktaUserId: {
    type: String,
    required: [true, 'Where is Okta User Id ?'],
  },
  phone: {
    type: String,
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
    enum: ['User', 'Admin', 'CustomerService'],
  },
  //stored mongoDB Ids of all shortlisted users.
  shortlistedMatches: [],
  // for each interest received... a unique object is created.
  // Subsequent messages "to & from" the sender are stored in conversations array inside the object.
  interestsReceived: [
    {
      receivedFrom: { type: mongoose.SchemaTypes.ObjectId },
      conversations: [MessageSchema],
    },
  ],
  // for each interest sent... a unique object is created...
  // Subsequent messages "to & from" the receiver are stored in conversations array inside the object
  interestsSent: [
    {
      sentTo: { type: mongoose.SchemaTypes.ObjectId },
      conversations: [MessageSchema],
    },
  ],
  religion: {
    type: String,
    trim: true,
    enum: ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Bahai'],
  },
  maritalStatus: {
    type: String,
    trim: true,
    enum: ['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed', 'Annulled'],
  },

  images: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('User', UserSchema);
