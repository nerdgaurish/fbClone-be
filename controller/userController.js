/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// user Registeration Controller
const addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    firstName, lastName, userName, email, password, role
  } = req.body;

  const checkUnique = async () => {
    const checkEmail = await User.findOne({ email });
    const checkUserName = await User.findOne({ userName });
    if (checkEmail || checkUserName) {
      return true;
    }
    return false;
  };

  try {
    const userCheck = await checkUnique();

    if (userCheck) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exists' }] });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    const newUser = new User({
      firstName,
      lastName,
      userName,
      role,
      email,
      avatar,
      password
    });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    const payload = {
      newUser: {
        id: newUser.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '35 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    res.status(201).json({ newUser });
  }
  catch (error) {
    res.status(500).json({ error });
  }
};

// user login Controller
const userLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '35 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  }
  catch (err) {
    res.status(500).send('Server error');
  }
};

const sendRecoveryMail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: process.env.USEREMAIL,
    to: user.email,
    subject: 'Sending Email using Node.js',
    text: `user your email is ${user.email}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error);
    }
    else {
      res.status(250).send(`Email sent: ${info.response}`);
    }
  });
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { password } = req.body;
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User does not exist' }] });
    }

    const salt = await bcrypt.genSalt(10);

    const newpassword = await bcrypt.hash(password, salt);

    const updated = await User.findOneAndUpdate({ _id: userid }, { password: newpassword }, {
      new: true
    });
    res.status(200).json({ updated });
  }
  catch (error) {
    res.status(500).json({ error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({ user });
  }
  catch (error) {
    res.status(500).json({ msg: 'No users Found' });
  }
};

const getSpecificUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid });
    res.status(200).json({ user });
  }
  catch (error) {
    res.status(500).json({ msg: 'No users Found' });
  }
};

const updateUserInfo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User does not exist' }] });
    }
    const { firstName, lastName, userName } = req.body;
    const updated = await User.findOneAndUpdate(
      { _id: userid },
      { firstName, lastName, userName },
      { new: true }
    );
    res.status(200).json({ updated });
  }
  catch (error) {
    res.status(500).json({ error });
  }
};

const addFriend = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userid } = req.params;
    const { userName } = req.body;
    const user = await User.findOne({ _id: userid });
    const userToAdd = await User.findOne({ userName });

    if (!user || !userToAdd) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User does not exist' }] });
    }
    const { friendList } = user;

    const isFriendExists = friendList.find((friend) => friend.id === userToAdd.id);

    if (isFriendExists || userid === userToAdd.id) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already added as a friend' }] });
    }
    friendList.unshift(userToAdd.id);
    await user.save();
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error });
  }
};

const removeFriend = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userid } = req.params;
    const { userName } = req.body;
    const user = await User.findOne({ _id: userid });
    const userToRemove = await User.findOne({ userName });
    const userCheck = user.friendList.find((friend) => friend.id === userToRemove.id);

    if (!user || !userToRemove || userid === userToRemove.id || !userCheck) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User does not exist' }] });
    }

    const filteredList = user.friendList.filter((friend) => friend.id !== userToRemove.id);

    user.friendList = filteredList;
    await user.save();
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error });
  }
};

const searchFriends = async (req, res) => {
  console.log('firstName');
  try {
    const { firstName } = req.body;
    const user = await User.find({ firstName });
    res.status(500).json({ user });
  }
  catch (error) {
    res.status(503).json({ error });
  }
};

module.exports = {
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
};
