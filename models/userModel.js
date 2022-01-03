const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First Name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required']
  },
  userName: {
    type: String,
    trim: true,
    required: [true, 'User Name is required'],
    unique: true
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'is required']
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  friendList: [
    {
      friendID: {
        type: String,
        unique: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      firstName: {
        type: String,
        trim: true,
        required: [true, 'First Name is required']
      },
      lastName: {
        type: String,
        required: [true, 'Last Name is required']
      },
      avatar: {
        type: String
      }
    }
  ]

});

module.exports = mongoose.model('user', UserSchema);
