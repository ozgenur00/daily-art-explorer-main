/**
 * SavedArtworkService - Provides services related to saving and unsaving artworks.
 */
const SavedArtwork = require('../models/savedArtworkModel');

class SavedArtworkService {
  /**
   * Saves an artwork for a specific user.
   * @param {number} user_id - The ID of the user who is saving the artwork.
   * @param {number} artwork_id - The ID of the artwork to be saved.
   * @returns {Promise<Object>} The newly created saved artwork record.
   * @throws {Error} If the artwork is already saved by the user, or if there is an error during the operation.
   */
  static async createSavedArtwork(user_id, artwork_id) {
    try {
      // Check if the artwork is already saved by the user
      const existingSavedArtwork = await SavedArtwork.findByUserAndArtworkId(user_id, artwork_id);
      if (existingSavedArtwork) {
        throw new Error('Artwork already saved');
      }

      // If not saved, proceed to save it
      const savedArtwork = await SavedArtwork.create({ user_id, artwork_id });
      return savedArtwork;
    } catch (err) {
      throw new Error(err.message || 'Error saving artwork');
    }
  }

  /**
   * Retrieves all artworks saved by a specific user.
   * @param {number} user_id - The ID of the user whose saved artworks are being retrieved.
   * @returns {Promise<Array>} An array of saved artworks.
   * @throws {Error} If there is an error during the operation.
   */
  static async getSavedArtworksByUser(user_id) {
    try {
      const savedArtworks = await SavedArtwork.findByUserId(user_id);
      return savedArtworks;
    } catch (err) {
      throw new Error('Error fetching saved artworks');
    }
  }

  /**
   * Unsaves an artwork for a specific user.
   * @param {number} user_id - The ID of the user who is unsaving the artwork.
   * @param {number} artwork_id - The ID of the artwork to be unsaved.
   * @returns {Promise<boolean>} `true` if the artwork was successfully unsaved, `false` otherwise.
   * @throws {Error} If there is an error during the operation.
   */
  static async deleteSavedArtwork(user_id, artwork_id) {
    try {
      const result = await SavedArtwork.delete(user_id, artwork_id);
      return result.rowCount > 0;
    } catch (err) {
      throw new Error('Error unsaving artwork');
    }
  }
}

module.exports = SavedArtworkService;
