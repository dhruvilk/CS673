const pool = require('../config/db');

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
        await connection.execute('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    } finally {
        connection.release();
    }
};

module.exports = { getUserByName, getUserById, createUser };
