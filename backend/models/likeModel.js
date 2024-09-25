/**
 * Like Model - Interacts with the `likes` table in the database.
 */
const pool = require('../db');

class Like {
  /**
   * Creates a new like record in the database.
   * @param {Object} likeData - The data for the new like.
   * @param {number} likeData.user_id - The ID of the user who liked the artwork.
   * @param {number} likeData.artwork_id - The ID of the liked artwork.
   * @returns {Promise<Object>} The newly created like record.
   */
  static async create({ user_id, artwork_id }) {
    const result = await pool.query(
      'INSERT INTO likes (user_id, artwork_id) VALUES ($1, $2) RETURNING *',
      [user_id, artwork_id]
    );
    return result.rows[0];
  }

  /**
   * Finds a like record by user ID and artwork ID.
   * @param {number} user_id - The ID of the user.
   * @param {number} artwork_id - The ID of the artwork.
   * @returns {Promise<Object|null>} The like record, or `null` if not found.
   */
  static async findByUserAndArtworkId(user_id, artwork_id) {
    const result = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND artwork_id = $2',
      [user_id, artwork_id]
    );
    return result.rows[0]; // Return the first row if a match is found
  }

  /**
   * Finds all like records by user ID.
   * @param {number} user_id - The ID of the user.
   * @returns {Promise<Array>} An array of like records for the user.
   */
  static async findByUserId(user_id) {
    const result = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1',
      [user_id]
    );
    return result.rows;
  }

  /**
   * Deletes a like record by user ID and artwork ID.
   * @param {number} user_id - The ID of the user.
   * @param {number} artwork_id - The ID of the artwork.
   * @returns {Promise<Object>} The result of the delete operation.
   */
  static async delete(user_id, artwork_id) {
    const result = await pool.query(
      'DELETE FROM likes WHERE user_id = $1 AND artwork_id = $2',
      [user_id, artwork_id]
    );
    return result;
  }
}

module.exports = Like;
