/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-header');

  if (!token) {
    return res.status(401).json({ msg: 'Invalid token, authorization not allowed' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user } = decoded;
    req.user = user.id;
    next();
  }
  catch (error) {
    return res.status(401).json({ msg: 'Invalid token, authorization not allowed' });
  }
};
