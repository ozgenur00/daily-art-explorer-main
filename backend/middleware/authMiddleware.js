/**
 * This middleware is responsible for authenticating JSON Web Tokens (JWT) in HTTP requests.
 * 
 * @module authMiddleware
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate a JWT token from the `Authorization` header of the request.
 * 
 * @function authenticateToken
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express `next` middleware function.
 * @returns {void}
 * 
 * @example
 * const { authenticateToken } = require('./middleware/authMiddleware');
 * app.use(authenticateToken);
 * 
 * @description
 * The function extracts the token from the `Authorization` header, verifies it using the secret key stored in `process.env.JWT_SECRET`, and attaches the decoded user information to `req.user`. If the token is missing, the function sends a 401 Unauthorized status. If the token verification fails, it sends a 403 Forbidden status.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    console.error('No token provided');
    return res.sendStatus(401); // If no token, unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed', err.message);
      return res.sendStatus(403); // If token invalid, forbidden
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
