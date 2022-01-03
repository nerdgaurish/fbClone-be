const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: [true, 'Post cannot be empty']
  },
  likes: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId
      },
      friendName: {
        type: String
      },
      friendAvatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  comments: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId
      },
      friendName: {
        type: String
      },
      friendAvatar: {
        type: String
      },
      comment: {
        type: String,
        required: [true, 'comment is required']
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  userID: {
    type: String,
    required: [true, 'user is required']
  },
  name: {
    type: String,
    required: [true, 'is required'],
    trim: true,
    maxLength: [50, 'Name cannot be more than 50']
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('task', TaskSchema);
