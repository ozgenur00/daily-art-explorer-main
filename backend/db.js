// backend/db.js
require('dotenv').config();
const { Pool } = require('pg');

/**
 * Creates a new PostgreSQL connection pool using environment variables for configuration.
 * 
 * @constant
 * @type {Pool}
 */
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD || null,
  port: process.env.PGPORT,
});

/**
 * Event listener that logs a message when the pool connects to the PostgreSQL database.
 */
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

/**
 * Event listener that handles unexpected errors on idle clients.
 * Exits the process with a non-zero status code if an error occurs.
 * 
 * @param {Error} err - The error object.
 */
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
