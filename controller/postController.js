/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const Post = require('../models/postModel');

// add post
const addNewPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { content } = req.body;
  try {
    const user = await User.findById(req.user).select('-password');

    const newPost = {
      content,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      userID: req.user
    };

    const post = await Post.create(newPost);

    res.json(post);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// remove post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.userID.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAllPosts = async (req, res) => {
  try {
    // const post = await Post.find({ userID: req.user });
    const post = await Post.find({});
    res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ msg: 'No posts Found' });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const post = await Post.find({ userID: req.user });
    res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ msg: 'No posts Found' });
  }
};

const getSpecificPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ msg: 'No posts Found' });
  }
};

const likeDislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { firstName, lastName, avatar } = await User.findById(req.user).select('-password');
    const newLike = {
      friendName: `${firstName} ${lastName}`,
      friendAvatar: avatar,
      userID: req.user
    };

    const { likes } = post;
    const isLiked = likes.find((like) => like.userID.toString() === req.user);

    if (!isLiked) {
      post.likes.unshift(newLike);
    }
    else {
      const filterredLikes = likes.filter((like) => like.userID.toString() !== req.user);
      post.likes = filterredLikes;
    }
    await post.save();
    res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ msg: 'No posts Found' });
  }
};

const addCommentPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { comment } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    const { firstName, lastName, avatar } = await User.findById(req.user).select('-password');
    const newComment = {
      friendName: `${firstName} ${lastName}`,
      friendAvatar: avatar,
      userID: req.user,
      comment
    };

    post.comments.unshift(newComment);

    await post.save();
    res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ msg: 'No posts Found' });
  }
};

const deleteCommentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find((comm) => comm.id === req.params.comment_id);

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.userID.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();
    res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ msg: 'No posts Found' });
  }
};

module.exports = {
  addNewPost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getSpecificPost,
  likeDislikePost,
  addCommentPost,
  deleteCommentPost
};
