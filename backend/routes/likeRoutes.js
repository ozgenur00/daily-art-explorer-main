/**
 * Like Router - Handles routes related to liking and unliking artworks.
 */
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const LikeService = require('../services/likeService');

const router = express.Router();

/**
 * POST /
 * Likes an artwork for the authenticated user.
 * @param {string} req.body.artwork_id - The ID of the artwork to like.
 * @returns {Object} res.json - The like record.
 * @throws {Error} If the artwork_id is not provided, or if there is a server error.
 */
router.post('/', authenticateToken, async (req, res) => {
  const { artwork_id } = req.body;
  const user_id = req.user.id;

  if (!artwork_id) {
    return res.status(400).json({ message: 'artwork_id is required' });
  }

  try {
    const like = await LikeService.likeArtwork(user_id, artwork_id);
    res.json(like);
  } catch (err) {
    console.error('Error liking artwork', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * GET /
 * Retrieves all liked artworks for the authenticated user.
 * @returns {Array} res.json - An array of liked artwork records.
 * @throws {Error} If there is a server error.
 */
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const likes = await LikeService.getLikedArtworksByUser(user_id);
    res.json(likes);
  } catch (err) {
    console.error('Error fetching liked artworks', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * DELETE /:artwork_id
 * Unlikes an artwork for the authenticated user.
 * @param {number} req.params.artwork_id - The ID of the artwork to unlike.
 * @returns {void} res.status(204) - No content, successful deletion.
 * @throws {Error} If the like is not found, or if there is a server error.
 */
router.delete('/:artwork_id', authenticateToken, async (req, res) => {
  const artwork_id = Number(req.params.artwork_id); // Convert to number
  const user_id = req.user.id;

  try {
    const result = await LikeService.unlikeArtwork(user_id, artwork_id);
    if (result) {
      res.status(204).send(); // No content, successful deletion
    } else {
      res.status(404).json({ message: 'Like not found' });
    }
  } catch (err) {
    console.error('Error unliking artwork', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
