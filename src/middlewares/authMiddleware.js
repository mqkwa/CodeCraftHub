const jwt = require('jsonwebtoken');

// Middleware function to check JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Save user info in request for next handlers
    next(); // Allow request to continue
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;