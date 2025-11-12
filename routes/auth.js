const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await AuthService.registerUser(name, email, password);
        res.status(201).json(user);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: error.message });
    }
});

// @route   POST api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await AuthService.loginUser(email, password);
        res.json(user);
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: error.message });
    }
});

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const user = await AuthService.getUserProfile(token);
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(401).json({ message: error.message });
    }
});

module.exports = router;
