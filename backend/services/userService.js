/**
 * UserService - Provides services related to user management, including creation, retrieval, updating, and deletion of users.
 */
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

class UserService {
    /**
     * Creates a new user with a hashed password.
     * @param {Object} userData - The data for the new user.
     * @param {string} userData.username - The username of the new user.
     * @param {string} userData.email - The email of the new user.
     * @param {string} userData.password - The plaintext password of the new user.
     * @returns {Promise<Object>} The newly created user record.
     */
    static async createUser({ username, email, password }) {
        const passwordHash = await bcrypt.hash(password, 10);
        return await User.create({ username, email, passwordHash });
    }

    /**
     * Finds a user by their username.
     * @param {string} username - The username of the user to find.
     * @returns {Promise<Object|null>} The user record, or `null` if not found.
     */
    static async findUserByUsername(username) {
        return await User.findByUsername(username);
    }

    /**
     * Retrieves all users from the database.
     * @returns {Promise<Array>} An array of all user records.
     */
    static async findAllUsers() {
        return await User.findAll();
    }

    /**
     * Updates an existing user with new details, including password change if provided.
     * @param {number} id - The ID of the user to update.
     * @param {Object} userData - The new data for the user.
     * @param {string} userData.username - The updated username of the user.
     * @param {string} userData.email - The updated email of the user.
     * @param {string} userData.currentPassword - The current password of the user (required for verification).
     * @param {string} [userData.newPassword] - The new password for the user (optional).
     * @returns {Promise<Object>} The updated user record.
     * @throws {Error} If the current password is incorrect or the user is not found.
     */
    static async updateUser(id, { username, email, currentPassword, newPassword }) {
        // Find the existing user by id
        const user = await User.findById(id);
      
        if (!user) {
          throw new Error('User not found');
        }
      
        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
          throw new Error('Current password is incorrect');
        }
      
        // Hash the new password if provided
        let passwordHash = user.password_hash;
        if (newPassword) {
          passwordHash = await bcrypt.hash(newPassword, 10);
        }
      
        // Update the user with the new details
        return await User.update(id, {
          username,
          email,
          passwordHash, // Use the new hash or keep the old one if not updated
        });
    }

    /**
     * Deletes a user by their ID.
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<boolean>} `true` if the user was successfully deleted, `false` otherwise.
     */
    static async deleteUser(id) {
        return await User.delete(id);
    }
}

module.exports = UserService;
