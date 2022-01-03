const express = require('express');
const { check } = require('express-validator');
const {
  addNewPost,
  deletePost,
  getAllPosts,
  getSpecificPost,
  getMyPosts,
  likeDislikePost,
  addCommentPost,
  deleteCommentPost
} = require('../controller/postController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route    POST api/v1/user/addPost
// @desc     add new post
// @access   private
router.route('/user/addpost').post(
  check('content', 'Post cannot be empty').notEmpty(),
  auth,
  addNewPost
);

// @route    delete api/v1/user/deletepost/:id
// @desc     delete post
// @access   private
router.route('/user/deletepost/:id').delete(auth, deletePost);

// @route    get api/v1/user/post
// @desc     get all posts
// @access   private
router.route('/user/post/allpost').get(auth, getAllPosts);

// @route    get api/v1/user/my/post
// @desc     get all posts
// @access   private
router.route('/user/post/my/allpost').get(auth, getMyPosts);

// @route    get api/v1/user/post/:id
// @desc     get user by id
// @access   private
router.route('/user/post/:id').get(auth, getSpecificPost);

// @route    post api/v1/user/post/like/:id
// @desc     like/dislike the post
// @access   private
router.route('/user/post/like/:id').post(auth, likeDislikePost);

// @route    post api/v1/user/post/comment/:id
// @desc     add comment the post
// @access   private
router.route('/user/post/comment/:id').post(
  auth,
  check('comment', 'comment cannot be empty').notEmpty(),
  addCommentPost
);

// @route    post api/v1/user/post/comment/:id/:comment_id
// @desc     delete comment the post
// @access   private
router.route('/user/post/comment/:id/:comment_id').delete(
  auth,
  deleteCommentPost
);

module.exports = router;
