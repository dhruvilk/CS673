const mysql = require('mysql2');
const session = require('express-session');
const Sequelize = require('sequelize');
const connectSessionSequelize = require('connect-session-sequelize')(session.Store);
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'database_development',
    waitForConnections: true,   // Maintain a pool of connections
    connectionLimit: 10000,        // Maximum number of connections in the pool
    queueLimit: 0               // Unlimited queued requests
});

// Set up Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'database_development',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '1234',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql', // Change dialect if using another database
        logging: console.log, // Disable query logging; set to console.log for debugging
    }
);

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch((err) => console.error('Database connection error:', err));

// Create the session store
const sessionStore = new connectSessionSequelize({
    db: sequelize,
    tableName: 'Sessions',
    checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
    expiration: 24 * 60 * 60 * 1000, // 24 hours
});

// Sync the session store to create the `sessions` table in your database
sessionStore.sync();
module.exports = {
    sessionStore:  sessionStore
};