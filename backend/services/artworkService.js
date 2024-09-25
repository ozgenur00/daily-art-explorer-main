const Artwork = require('../models/artworkModel');
const { fetchRandomArtworksFromAPI } = require('../externalApi/metApi');

/**
 * Helper function to truncate long fields to a maximum length.
 * This will prevent database errors due to exceeding column length limits.
 * 
 * @param {string} value - The value to be truncated.
 * @param {number} maxLength - The maximum allowed length.
 * @returns {string} The truncated value, or the original value if it's within limits.
 */
const truncate = (value, maxLength) => {
  return value && value.length > maxLength ? value.slice(0, maxLength) : value;
};

class ArtworkService {

  /**
   * Fetches artworks from an external API and saves them to the database.
   * 
   * @param {number} count - The number of artworks to fetch and save.
   * @returns {Promise<Array>} The saved artworks.
   */
  static async fetchAndSaveArtworks(count) {
    try {
      const artworks = await fetchRandomArtworksFromAPI(count);
      const savedArtworks = [];

      for (const artwork of artworks) {
        const savedArtwork = await this.saveArtwork(artwork); // Use helper method to save each artwork
        savedArtworks.push(savedArtwork);
      }

      return savedArtworks;
    } catch (error) {
      console.error('Error fetching and saving artworks:', error.stack); // Log full error for debugging
      throw new Error('Server error while fetching and saving artworks');
    }
  }

  /**
   * Helper method to save a single artwork to the database.
   * 
   * @param {Object} artwork - The artwork object from the external API.
   * @returns {Promise<Object>} The saved artwork.
   */
  static async saveArtwork(artwork) {
    const {
      title,
      artistDisplayName: artist,
      objectDate: period,
      medium,
      repository: location,
      primaryImage: imageUrl,
      objectURL: metUrl
    } = artwork;

    // Truncate fields if they are too long for the database columns
    return await Artwork.create({
      title: truncate(title, 255),
      artist: truncate(artist, 255),
      period,
      medium,
      location: truncate(location, 255),
      imageUrl: truncate(imageUrl, 255),
      metUrl: truncate(metUrl, 255),
    });
  }

  /**
   * Retrieves the total count of artworks from the database.
   * 
   * @returns {Promise<number>} The total number of artwork records in the database.
   */
  static async getAllArtworksCount() {
    try {
      const totalCount = await Artwork.countAll();
      return totalCount;
    } catch (error) {
      console.error('Error getting artwork count:', error.stack); // Log full error for debugging
      throw new Error('Server error while retrieving artwork count');
    }
  }

  /**
   * Retrieves paginated artworks from the database.
   * If there are not enough artworks in the database, it fetches more from the API.
   * 
   * @param {number} [page=1] - The current page number.
   * @param {number} [pageSize=20] - The number of artworks per page.
   * @returns {Promise<Object>} The paginated artworks and pagination details.
   */
  static async getPaginatedArtworks(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const artworks = await Artwork.findPaginated(pageSize, offset); // Fetch artworks from the database
    const total = await Artwork.countAll(); // Get total artwork count from the database

    // If fewer artworks than requested are found, fetch more from the external API
    if (artworks.length < pageSize) {
      const missingArtworks = pageSize - artworks.length;
      const fetchBatchSize = 100; // Fetch more than needed to reduce API calls
      await this.fetchAndSaveArtworks(Math.max(missingArtworks, fetchBatchSize));
    }

    const totalPages = Math.ceil(total / pageSize);
    return {
      artworks,
      total,
      totalPages,
      currentPage: page,
    };
  }

  /**
   * Retrieves a single artwork by its ID from the database.
   * 
   * @param {number} id - The ID of the artwork.
   * @returns {Promise<Object>} The artwork data.
   */
  static async getArtworkById(id) {
    try {
      const artwork = await Artwork.findById(id);
      return artwork;
    } catch (error) {
      console.error('Error fetching artwork by ID:', error.stack); // Log full error for debugging
      throw new Error('Server error while fetching artwork by ID');
    }
  }
}

module.exports = ArtworkService;
