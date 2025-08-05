const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Creates a new user with hashed password
 * @param {Object} param0
 * @param {string} param0.username
 * @param {string} param0.email
 * @param {string} param0.password
 * @returns {Promise<User>}
 */
const createUser = async ({ username, email, password }) => {
  // Check if email or username already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const error = new Error('Username or email already exists');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = new User({ username, email, passwordHash });
  await user.save();
  return user;
};

/**
 * Validates user credentials
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User|null>}
 */
const validateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return null;

  return user;
};

/**
 * Retrieves user by ID
 * @param {string} userId
 * @returns {Promise<User|null>}
 */
const getUserById = async (userId) => {
  return User.findById(userId);
};

module.exports = {
  createUser,
  validateUser,
  getUserById
};