const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'cse123',
    database: process.env.DB_NAME || 'jobhudku',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('Attempting to connect with config:', {
    ...config,
    password: config.password ? '***' : 'no password set'
});

const pool = mysql.createPool(config);

// Create users table if not exists
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// Initialize database
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        await connection.query(createUsersTable);
        console.log('Database initialized successfully');
        connection.release();
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// User related queries
const userQueries = {
    // Create new user
    createUser: `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    
    // Find user by email
    findUserByEmail: `SELECT * FROM users WHERE email = ?`,
    
    // Get user by ID
    getUserById: `SELECT id, name, email, created_at FROM users WHERE id = ?`
};

module.exports = {
    pool,
    initializeDatabase,
    userQueries
};
