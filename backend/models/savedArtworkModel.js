/**
 * SavedArtwork Model - Interacts with the `saved_artworks` table in the database.
 */
const pool = require('../db');

class SavedArtwork {
  /**
   * Creates a new saved artwork record in the database.
   * @param {Object} savedArtworkData - The data for the new saved artwork.
   * @param {number} savedArtworkData.user_id - The ID of the user who saved the artwork.
   * @param {number} savedArtworkData.artwork_id - The ID of the saved artwork.
   * @returns {Promise<Object>} The newly created saved artwork record.
   */
  static async create({ user_id, artwork_id }) {
    const result = await pool.query(
      'INSERT INTO saved_artworks (user_id, artwork_id) VALUES ($1, $2) RETURNING *',
      [user_id, artwork_id]
    );
    return result.rows[0];
  }

  /**
   * Finds a saved artwork record by user ID and artwork ID.
   * @param {number} user_id - The ID of the user.
   * @param {number} artwork_id - The ID of the artwork.
   * @returns {Promise<Object|null>} The saved artwork record, or `null` if not found.
   */
  static async findByUserAndArtworkId(user_id, artwork_id) {
    const result = await pool.query(
      'SELECT * FROM saved_artworks WHERE user_id = $1 AND artwork_id = $2',
      [user_id, artwork_id]
    );
    return result.rows[0]; // Return the first row if a match is found
  }

  /**
   * Finds all saved artwork records by user ID.
   * @param {number} user_id - The ID of the user.
   * @returns {Promise<Array>} An array of saved artwork records for the user.
   */
  static async findByUserId(user_id) {
    const result = await pool.query(
      'SELECT * FROM saved_artworks WHERE user_id = $1',
      [user_id]
    );
    return result.rows;
  }

  /**
   * Deletes a saved artwork record by user ID and artwork ID.
   * @param {number} user_id - The ID of the user.
   * @param {number} artwork_id - The ID of the artwork.
   * @returns {Promise<Object>} The result of the delete operation.
   */
  static async delete(user_id, artwork_id) {
    const result = await pool.query(
      'DELETE FROM saved_artworks WHERE user_id = $1 AND artwork_id = $2',
      [user_id, artwork_id]
    );
    return result;
  }
}

module.exports = SavedArtwork;
