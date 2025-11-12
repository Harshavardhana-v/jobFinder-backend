const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, userQueries } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

class AuthService {
    static async registerUser(name, email, password) {
        try {
            // Check if user already exists
            const [existingUser] = await pool.query(userQueries.findUserByEmail, [email]);
            if (existingUser.length > 0) {
                throw new Error('User with this email already exists');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const [result] = await pool.query(userQueries.createUser, [name, email, hashedPassword]);
            
            // Generate JWT token
            const token = jwt.sign(
                { userId: result.insertId, email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                id: result.insertId,
                name,
                email,
                token
            };
        } catch (error) {
            throw new Error(error.message || 'Error registering user');
        }
    }

    static async loginUser(email, password) {
        try {
            // Find user by email
            const [users] = await pool.query(userQueries.findUserByEmail, [email]);
            if (users.length === 0) {
                throw new Error('Invalid credentials');
            }

            const user = users[0];
            
            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                token
            };
        } catch (error) {
            throw new Error(error.message || 'Error logging in');
        }
    }

    static async getUserProfile(token) {
        try {
            // Verify and decode token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const [users] = await pool.query(userQueries.getUserById, [decoded.userId]);
            if (users.length === 0) {
                throw new Error('User not found');
            }
            
            // Remove sensitive data before returning
            const { password, ...userData } = users[0];
            return userData;
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            }
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expired');
            }
            throw new Error(error.message || 'Error fetching user profile');
        }
    }
}

module.exports = AuthService;
