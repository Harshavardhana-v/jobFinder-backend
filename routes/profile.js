const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const { pool, userQueries } = require('../db');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const user = await AuthService.getUserProfile(req.user.userId);
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/profile/me
// @desc    Update user profile
// @access  Private
router.put('/me', async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.userId;

    try {
        // Check if email is being updated and if it's already taken
        if (email) {
            const [existingUser] = await pool.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, userId]
            );
            
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Update user
        const [result] = await pool.query(
            'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?',
            [name, email, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get updated user
        const [updatedUser] = await pool.query(userQueries.getUserById, [userId]);
        res.json(updatedUser[0]);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/profile/:userId
// @desc    Get user profile by ID
// @access  Public
router.get('/:userId', async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [req.params.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
