/**
 * Authentication Router - Handles user registration and login requests.
 */
const express = require('express');
const { registerUser, loginUser } = require('../services/authService');

const router = express.Router();

/**
 * POST /register
 * Registers a new user and returns the user data along with a token.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @returns {Object} res.json - An object containing the user data and token.
 * @throws {Error} If a user with the provided username or email already exists, or if there is a server error.
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const { user, token } = await registerUser(username, email, password);
    res.json({ user, token });  // Return both the user and token in the response
  } catch (err) {
    if (err.code === '23505') { // Handle unique constraint violation
      const detail = err.detail;
      if (detail.includes('username')) {
        res.status(400).json({ message: 'Username already exists' });
      } else if (detail.includes('email')) {
        res.status(400).json({ message: 'Email already exists' });
      }
    } else {
      console.error('Error registering user', err.message);
      res.status(500).send('Server error');
    }
  }
});

/**
 * POST /login
 * Logs in a user and returns the user data along with a token.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Object} res.json - An object containing the user data and token.
 * @throws {Error} If the credentials are invalid or there is a server error.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await loginUser(username, password);
    
    // Return both user details and token
    res.json({ user, token });
  } catch (err) {
    console.error('Login error', err.message);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
