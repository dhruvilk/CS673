const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'database_development',
    waitForConnections: true,   // Maintain a pool of connections
    connectionLimit: 10000,        // Maximum number of connections in the pool
    queueLimit: 0               // Unlimited queued requests
});


const getUserByName = async (username) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM user WHERE LOWER(name) = LOWER(?)', [username]);
        return rows[0] || null;
    } finally {
        connection.release();
    }
};

const getUserById = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM user WHERE id = ?', [id]);
        return rows[0] || null;
    } finally {
        connection.release();
    }
};

const createUser = async (username, email, hashedPassword) => {
    const connection = await pool.getConnection();
    try {
        const id = crypto.randomBytes(16).toString('hex');
        await connection.execute('INSERT INTO user (id, name, password, email) VALUES (?, ?, ?, ?)', [id, username, hashedPassword, email]);
    } finally {
        connection.release();
    }
};

module.exports = { getUserByName, getUserById, createUser};
