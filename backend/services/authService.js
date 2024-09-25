/**
 * AuthService - Provides authentication-related services such as user registration, login, and token generation.
 */
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a given user.
 * @param {Object} user - The user object containing the user's ID and username.
 * @param {number} user.id - The user's ID.
 * @param {string} user.username - The user's username.
 * @returns {string} A JWT token signed with the user's information.
 */
function generateToken(user) {
  const payload = { id: user.id, username: user.username };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

/**
 * Registers a new user by saving their details in the database.
 * @param {string} username - The username of the new user.
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Promise<Object>} An object containing the newly created user and a JWT token.
 * @throws {Error} If there is an error during registration.
 */
async function registerUser(username, email, password) {
  const password_hash = bcrypt.hashSync(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [username, email, password_hash]
  );
  
  const user = result.rows[0];
  const token = generateToken(user);  // Generate a token for the new user
  
  return { user, token };  // Return both the user and the token
}

/**
 * Logs in a user by validating their credentials and returning a JWT token.
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @returns {Promise<Object>} An object containing the user's details and a JWT token.
 * @throws {Error} If the credentials are invalid.
 */
async function loginUser(username, password) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  
  if (user && bcrypt.compareSync(password, user.password_hash)) {
    const token = generateToken(user);
    
    // Return both user details and token
    return { 
      user: {
        id: user.id,
        username: user.username,
        email: user.email, // Include additional user details if needed
      },
      token 
    };
  } else {
    throw new Error('Invalid credentials');
  }
}

module.exports = {
  registerUser,
  loginUser,
  generateToken
};
