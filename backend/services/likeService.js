/**
 * LikeService - Provides services related to liking and unliking artworks.
 */
const Like = require('../models/likeModel');

class LikeService {
  /**
   * Likes an artwork for a specific user.
   * @param {number} user_id - The ID of the user who is liking the artwork.
   * @param {number} artwork_id - The ID of the artwork to be liked.
   * @returns {Promise<Object>} The newly created like record.
   * @throws {Error} If the artwork is already liked by the user, or if there is an error during the operation.
   */
  static async likeArtwork(user_id, artwork_id) {
    try {
      // Check if the artwork is already liked by the user
      const existingLike = await Like.findByUserAndArtworkId(user_id, artwork_id);
      if (existingLike) {
        throw new Error('Artwork already liked');
      }

      // If not liked, proceed to like it
      const like = await Like.create({ user_id, artwork_id });
      return like;
    } catch (err) {
      throw new Error(err.message || 'Error liking artwork');
    }
  }

  /**
   * Retrieves all artworks liked by a specific user.
   * @param {number} user_id - The ID of the user whose liked artworks are being retrieved.
   * @returns {Promise<Array>} An array of liked artworks.
   * @throws {Error} If there is an error during the operation.
   */
  static async getLikedArtworksByUser(user_id) {
    try {
      const likes = await Like.findByUserId(user_id);
      return likes;
    } catch (err) {
      throw new Error('Error fetching liked artworks');
    }
  }

  /**
   * Unlikes an artwork for a specific user.
   * @param {number} user_id - The ID of the user who is unliking the artwork.
   * @param {number} artwork_id - The ID of the artwork to be unliked.
   * @returns {Promise<boolean>} `true` if the artwork was successfully unliked, `false` otherwise.
   * @throws {Error} If there is an error during the operation.
   */
  static async unlikeArtwork(user_id, artwork_id) {
    try {
      const result = await Like.delete(user_id, artwork_id);
      return result.rowCount > 0;
    } catch (err) {
      throw new Error('Error unliking artwork');
    }
  }
}

module.exports = LikeService;
