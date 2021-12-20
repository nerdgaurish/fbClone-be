const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const { addUser, userLogin, forgotxx } = require('../controller/userController');

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
router.route('/user/forgot').post(forgotxx);
module.exports = router;
