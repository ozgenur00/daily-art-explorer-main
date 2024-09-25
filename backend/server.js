require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const artworkRoutes = require('./routes/artworkRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const likeRoutes = require('./routes/likeRoutes');
const savedArtworkRoutes = require('./routes/savedArtworkRoutes');
const ArtworkService = require('./services/artworkService');

const app = express();

// Define PORT from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

/**
 * Middleware setup for enabling Cross-Origin Resource Sharing (CORS).
 * Allows requests from both local development and deployed frontend.
 */
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://daily-art-explorer-frontend.onrender.com', // Deployed frontend on Render
  'https://daily-art-explorer-backend.onrender.com'  // Deployed backend on Render
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.options('*', cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Daily Art Explorer Backend');
});

// Use API Routes
app.use('/api/artworks', artworkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/saved_artworks', savedArtworkRoutes);

/**
 * Pre-fetch and save artworks when the server starts.
 */
const prefetchArtworks = async () => {
  try {
    const existingArtworksCount = await ArtworkService.getAllArtworksCount();
    const artworksToFetch = 1000;
    if (existingArtworksCount < artworksToFetch) {
      console.log(`Pre-fetching ${artworksToFetch - existingArtworksCount} artworks...`);
      await ArtworkService.fetchAndSaveArtworks(artworksToFetch - existingArtworksCount);
      console.log('Artworks pre-fetched and saved successfully.');
    } else {
      console.log('Sufficient artworks are already available in the database.');
    }
  } catch (error) {
    console.error('Error during artwork pre-fetch:', error.message);
  }
};

/**
 * Starts the server and listens on the specified port.
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await prefetchArtworks();
  });
}

module.exports = app;
