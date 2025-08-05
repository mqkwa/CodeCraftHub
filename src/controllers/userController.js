const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await userService.createUser({ username, email, password });
    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    next(error);
  }
};

// Login user and return JWT token
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Get current authenticated user's profile
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is set in authMiddleware after verifying JWT
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude sensitive info like passwordHash
    const { passwordHash, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};