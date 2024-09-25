/**
 * User Model - Interacts with the `users` table in the database.
 */
const pool = require('../db');

class User {
    /**
     * Creates a new user record in the database.
     * @param {Object} userData - The data for the new user.
     * @param {string} userData.username - The username of the new user.
     * @param {string} userData.email - The email of the new user.
     * @param {string} userData.passwordHash - The hashed password of the new user.
     * @returns {Promise<Object>} The newly created user record.
     */
    static async create({ username, email, passwordHash }) {
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, passwordHash]
        );
        return result.rows[0];
    }

    /**
     * Finds a user record by username.
     * @param {string} username - The username of the user to retrieve.
     * @returns {Promise<Object|null>} The user record, or `null` if not found.
     */
    static async findByUsername(username) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

    /**
     * Finds a user record by ID.
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<Object|null>} The user record, or `null` if not found.
     */
    static async findById(id) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    /**
     * Retrieves all user records from the database.
     * @returns {Promise<Array>} An array of all user records.
     */
    static async findAll() {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    }

    /**
     * Updates an existing user record in the database.
     * @param {number} id - The ID of the user to update.
     * @param {Object} userData - The new data for the user.
     * @param {string} userData.username - The updated username of the user.
     * @param {string} userData.email - The updated email of the user.
     * @param {string} userData.passwordHash - The updated hashed password of the user.
     * @returns {Promise<Object>} The updated user record.
     */
    static async update(id, { username, email, passwordHash }) {
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING *',
            [username, email, passwordHash, id]
        );
        return result.rows[0];
    }

    /**
     * Deletes a user record from the database by ID.
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<boolean>} `true` if the user was deleted, `false` otherwise.
     */
    static async delete(id) {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rowCount > 0;
    }
}

module.exports = User;
