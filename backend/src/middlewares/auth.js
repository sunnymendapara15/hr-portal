const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Administrator privileges are required' });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
};
