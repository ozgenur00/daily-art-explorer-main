const express = require('express');
const ArtworkService = require('../services/artworkService');
const { authenticateToken } = require('../middleware/authMiddleware');
const Artwork = require('../models/artworkModel');


const router = express.Router();

// Pre-fetch and save artworks on server startup or by calling this route
router.post('/fetch', authenticateToken, async (req, res) => {
  const { count } = req.body;

  try {
    // Fetch artworks from an external API and save to database
    const savedArtworks = await ArtworkService.fetchAndSaveArtworks(count);

    if (savedArtworks.length === 0) {
      return res.status(404).json({ message: 'No artworks found' });
    }

    // Respond with a single random artwork from the saved ones
    const randomArtwork = savedArtworks[0];  // Pick the first one or select randomly
    res.json(randomArtwork);

  } catch (error) {
    console.error('Error fetching and saving artworks:', error.message);
    res.status(500).send('Server error');
  }
});


// GET random artwork from saved artworks
router.get('/random', authenticateToken, async (req, res) => {
  try {
    const totalArtworks = await Artwork.countAll();
    if (totalArtworks === 0) {
      return res.status(404).json({ message: 'No artworks available' });
    }

    const randomIndex = Math.floor(Math.random() * totalArtworks);
    const randomArtwork = await Artwork.findPaginated(1, randomIndex);

    res.json(randomArtwork[0]);
  } catch (error) {
    console.error('Error fetching random artwork:', error.message);
    res.status(500).send('Server error');
  }
});


// GET all artworks (with pagination)
router.get('/', authenticateToken, async (req, res) => {
  const { page = 1, pageSize = 21 } = req.query; // Default to page 1, 20 items per page

  try {
    const existingArtworksCount = await Artwork.countAll(); // Count all artworks

    // If the requested page exceeds available data, return empty or fetch more
    if (existingArtworksCount < (page - 1) * pageSize) {
      return res.status(404).json({ message: 'No more artworks available.' });
    }

    const paginatedArtworks = await ArtworkService.getPaginatedArtworks(Number(page), Number(pageSize));
    res.json(paginatedArtworks); // Return paginated results along with metadata
  } catch (error) {
    console.error('Error fetching paginated artworks:', error.message);
    res.status(500).send('Server error');
  }
});






// GET artwork by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const artwork = await ArtworkService.getArtworkById(id);
    if (artwork) {
      res.json(artwork);
    } else {
      res.status(404).json({ message: 'Artwork not found' });
    }
  } catch (err) {
    console.error('Error fetching artwork:', err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
