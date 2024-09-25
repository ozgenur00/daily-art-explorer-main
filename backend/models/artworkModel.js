/**
 * Artwork Model - Interacts with the `artworks` table in the database.
 */
const pool = require('../db');

class Artwork {



    /**
 * Retrieves the total count of artwork records in the database.
 * @returns {Promise<number>} The total number of artwork records.
 */
    static async countAll() {
        const result = await pool.query('SELECT COUNT(*) FROM artworks');
        return parseInt(result.rows[0].count, 10);
    }
  

    /**
     * Creates a new artwork record in the database.
     * @param {Object} artworkData - The data for the new artwork.
     * @param {string} artworkData.title - The title of the artwork.
     * @param {string} artworkData.artist - The artist who created the artwork.
     * @param {string} artworkData.period - The period during which the artwork was created.
     * @param {string} artworkData.medium - The medium used in the artwork.
     * @param {string} artworkData.location - The location where the artwork is currently held.
     * @param {string} artworkData.imageUrl - The URL of the artwork's image.
     * @param {string} artworkData.metUrl - The URL to the artwork's page on the MET website.
     * @returns {Promise<Object>} The newly created artwork record.
     */
    static async create({ title, artist, period, medium, location, imageUrl, metUrl }) {
        const result = await pool.query(
            'INSERT INTO artworks (title, artist, period, medium, location, image_url, met_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, artist, period, medium, location, imageUrl, metUrl]
        );
        return result.rows[0];
    }

    

    /**
     * Finds an artwork by its ID.
     * @param {number} id - The ID of the artwork to retrieve.
     * @returns {Promise<Object|null>} The artwork record, or `null` if not found.
     */
    static async findById(id) {
        const result = await pool.query('SELECT * FROM artworks WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

/**
 * Retrieves paginated artwork records from the database.
 * @param {number} limit - The number of artworks to retrieve.
 * @param {number} offset - The starting point (offset) for the records to retrieve.
 * @returns {Promise<Array>} An array of paginated artwork records.
 */
static async findPaginated(limit, offset) {
    const result = await pool.query(
        'SELECT * FROM artworks ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
    );
    return result.rows;
}
}

module.exports = Artwork;
