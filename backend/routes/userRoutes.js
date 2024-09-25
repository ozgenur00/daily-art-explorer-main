/**
 * User Router - Handles routes related to user management.
 */
const express = require('express');
const UserService = require('../services/userService');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /
 * Retrieves all users.
 * @returns {Array} res.json - An array of all user records.
 * @throws {Error} If there is a server error.
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await UserService.findAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * POST /
 * Creates a new user.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @returns {Object} res.status(201).json - The newly created user record.
 * @throws {Error} If the username or email already exists, or if there is a server error.
 */
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await UserService.createUser({ username, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === '23505') { // Handle unique constraint violation
      const detail = err.detail;
      if (detail.includes('username')) {
        return res.status(400).json({ message: 'Username already exists' });
      } else if (detail.includes('email')) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    console.error('Error creating user', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * PUT /:id
 * Updates an existing user.
 * @param {number} req.params.id - The ID of the user to update.
 * @param {string} req.body.username - The updated username of the user.
 * @param {string} req.body.email - The updated email of the user.
 * @param {string} req.body.currentPassword - The current password of the user (required for validation).
 * @param {string} [req.body.newPassword] - The new password for the user (optional).
 * @returns {Object} res.json - The updated user record.
 * @throws {Error} If the current password is incorrect, if the username or email already exists, or if there is a server error.
 */
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { username, email, currentPassword, newPassword } = req.body;

  if (parseInt(id) !== parseInt(req.user.id)) {
    return res.status(403).json({ message: 'You are not authorized to update this user.' });
  }

  if (!currentPassword) {
    return res.status(400).json({ message: 'Current password is required.' });
  }

  try {
    const updatedUser = await UserService.updateUser(id, {
      username,
      email,
      currentPassword,
      newPassword, 
    });
    res.json(updatedUser);
  } catch (err) {
    if (err.message === 'Current password is incorrect') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === '23505') { // Handle unique constraint violation
      const detail = err.detail;
      if (detail.includes('username')) {
        return res.status(400).json({ message: 'Username already exists' });
      } else if (detail.includes('email')) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    console.error('Error updating user:', err); 
    res.status(500).send('Server error');
  }
});

/**
 * DELETE /:id
 * Deletes an existing user.
 * @param {number} req.params.id - The ID of the user to delete.
 * @returns {void} res.status(204) - No content, successful deletion.
 * @throws {Error} If the user is not found, or if there is a server error.
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== parseInt(req.user.id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this user.' });
  }

  try {
      const deleted = await UserService.deleteUser(id);
      if (deleted) {
          res.status(204).send(); // No content, successful deletion
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (err) {
      console.error('Error deleting user', err.message);
      res.status(500).send('Server error');
  }
});

module.exports = router;
