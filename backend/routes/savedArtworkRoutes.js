/**
 * SavedArtwork Router - Handles routes related to saving and unsaving artworks.
 */
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const SavedArtworkService = require('../services/savedArtworkService');

const router = express.Router();

/**
 * POST /
 * Saves an artwork for the authenticated user.
 * @param {string} req.body.artwork_id - The ID of the artwork to save.
 * @returns {Object} res.json - The saved artwork record.
 * @throws {Error} If the artwork_id is not provided, or if there is a server error.
 */
router.post('/', authenticateToken, async (req, res) => {
  const { artwork_id } = req.body;
  const user_id = req.user.id;

  if (!artwork_id) {
    return res.status(400).json({ message: 'artwork_id is required' });
  }

  try {
    const savedArtwork = await SavedArtworkService.createSavedArtwork(user_id, artwork_id);
    res.json(savedArtwork);
  } catch (err) {
    console.error('Error saving artwork', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * GET /
 * Retrieves all saved artworks for the authenticated user.
 * @returns {Array} res.json - An array of saved artwork records.
 * @throws {Error} If there is a server error.
 */
router.get('/', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const savedArtworks = await SavedArtworkService.getSavedArtworksByUser(user_id);
    res.json(savedArtworks);
  } catch (err) {
    console.error('Error fetching saved artworks', err.message);
    res.status(500).send('Server error');
  }
});

/**
 * DELETE /:artwork_id
 * Unsaves an artwork for the authenticated user.
 * @param {number} req.params.artwork_id - The ID of the artwork to unsave.
 * @returns {void} res.status(204) - No content, successful deletion.
 * @throws {Error} If the saved artwork is not found, or if there is a server error.
 */
router.delete('/:artwork_id', authenticateToken, async (req, res) => {
  const artwork_id = Number(req.params.artwork_id);
  const user_id = req.user.id;

  try {
    const result = await SavedArtworkService.deleteSavedArtwork(user_id, artwork_id);
    if (result) {
      res.status(204).send(); // No content, successful deletion
    } else {
      res.status(404).json({ message: 'Saved artwork not found' });
    }
  } catch (err) {
    console.error('Error unsaving artwork:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
