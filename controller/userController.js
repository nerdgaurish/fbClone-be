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

// const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;

const forgotxx = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: process.env.USEREMAIL,
    to: 'cipese6496@videour.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easysddddddd!'
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
module.exports = { addUser, userLogin, forgotxx };
