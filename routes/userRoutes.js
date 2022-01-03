const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const {
  addUser,
  userLogin,
  sendRecoveryMail,
  resetPassword,
  getAllUsers,
  getSpecificUser,
  updateUserInfo,
  addFriend,
  removeFriend,
  searchFriends
} = require('../controller/userController');
const auth = require('../middleware/auth');

// @route    POST api/v1/user
// @desc     Register user
// @access   Public
router.route('/user/register').post(
  check('firstName', 'First Name is required').notEmpty(),
  check('lastName', 'Last Name is required').notEmpty(),
  check('userName', 'User Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  addUser
);

// @route    POST api/v1/user/login
// @desc     login user
// @access   Public
router.route('/user/login').post(
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  userLogin
);

// @route    POST api/v1/user/recovery
// @desc     sends recovery mail to user email
// @access   Public
router.route('/user/recovery/').post(sendRecoveryMail);

// @route    put api/v1/user/reset
// @desc     reset password
// @access   private
router.route('/user/reset/:userid').put(
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  resetPassword
);

// @route    get api/v1/user/
// @desc     get all users
// @access   private
router.route('/user').get(getAllUsers);

// @route    get api/v1/user/:userid
// @desc     get user by id
// @access   private
router.route('/user/:userid').get(getSpecificUser);

// @route    patch api/v1/user/:userid
// @desc     update password
// @access   private
router.route('/user/:userid').patch(
  check('firstName', 'First Name is required').notEmpty(),
  check('lastName', 'Last Name is required').notEmpty(),
  check('userName', 'User Name is required').notEmpty(),
  updateUserInfo
);

// @route    patch api/v1/user/addfriend/:userid
// @desc     add friend
// @access   private
router.route('/user/addfriend/:userid').patch(
  check('userName', 'User Name is required').notEmpty(),
  addFriend
);

// @route    patch api/v1/user/removefriend/:userid
// @desc     remove friend
// @access   private
router.route('/user/removefriend/:userid').patch(
  check('userName', 'User Name is required').notEmpty(),
  removeFriend
);

// @route    get api/v1/user/search
// @desc     get friends by searching
// @access   private
router.route('/user/search/byname').get(searchFriends);

module.exports = router;
