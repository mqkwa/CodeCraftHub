const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../validations/userValidation');
const authMiddleware = require('../middlewares/authMiddleware');

// Register new user with validation
router.post('/register', validateUserRegistration, userController.registerUser);

// Login user with validation
router.post('/login', validateUserLogin, userController.loginUser);

// Protected route: get profile
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
