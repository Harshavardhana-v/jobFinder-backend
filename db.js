const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',     // Render will override this
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'cse123',
  database: process.env.DB_NAME || 'jobhudku',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log('Attempting to connect with config:', {
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password ? '***' : 'no password set',
});

const pool = mysql.createPool(config);

// SQL query to create the users table if it doesn’t exist
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// Initialize database connection
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(createUsersTable);
    console.log('✅ Database connected and initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('Make sure your DB credentials are set correctly in Render Environment Variables.');
    process.exit(1);
  }
}

// User-related queries
const userQueries = {
  createUser: `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
  findUserByEmail: `SELECT * FROM users WHERE email = ?`,
  getUserById: `SELECT id, name, email, created_at FROM users WHERE id = ?`,
};

module.exports = {
  pool,
  initializeDatabase,
  userQueries,
};
