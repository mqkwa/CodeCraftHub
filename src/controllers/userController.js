const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    console.log('registerUser called');
    console.log('Request body:', req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const user = await userService.createUser({ username: name, email, password });

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    console.error('Error in registerUser:', error);
    next(error);
  }
};

// Login user and return JWT token
const loginUser = async (req, res, next) => {
  try {
    console.log('loginUser called');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await userService.validateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error in loginUser:', error);
    next(error);
  }
};

// Get current authenticated user's profile
const getUserProfile = async (req, res, next) => {
  try {
    console.log('getUserProfile called');

    const user = await userService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { passwordHash, ...userData } = user.toObject();

    res.json(userData);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
