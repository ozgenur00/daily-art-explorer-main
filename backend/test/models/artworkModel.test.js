const Artwork = require('../../models/artworkModel');
const pool = require('../../db');

// Mock the pool.query function from the 'pg' module
jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Artwork Model', () => {
  // Clear mocks before each test to avoid test interference
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('countAll', () => {
    it('should return the total count of artworks', async () => {
      // Mock result from pool.query
      const mockResult = { rows: [{ count: '5' }] }; // PostgreSQL returns count as a string
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await Artwork.countAll();

      // Check if the correct SQL query was executed
      expect(pool.query).toHaveBeenCalledWith('SELECT COUNT(*) FROM artworks');
      
      // Ensure that the result matches the mock
      expect(result).toBe(5);
    });
  });

  describe('create', () => {
    it('should insert a new artwork and return the created artwork', async () => {
      const newArtwork = {
        title: 'Starry Night',
        artist: 'Vincent van Gogh',
        period: 'Post-Impressionism',
        medium: 'Oil on canvas',
        location: 'Museum of Modern Art, New York',
        imageUrl: 'https://example.com/starry-night.jpg',
        metUrl: 'https://example.com/starry-night',
      };

      const mockResult = { rows: [newArtwork] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await Artwork.create(newArtwork);

      // Check if the correct SQL query was executed
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO artworks (title, artist, period, medium, location, image_url, met_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [
          newArtwork.title,
          newArtwork.artist,
          newArtwork.period,
          newArtwork.medium,
          newArtwork.location,
          newArtwork.imageUrl,
          newArtwork.metUrl,
        ]
      );

      // Ensure that the result matches the mock
      expect(result).toEqual(newArtwork);
    });
  });

  describe('findById', () => {
    it('should return the artwork when given a valid ID', async () => {
      const artworkId = 1;
      const mockArtwork = {
        id: artworkId,
        title: 'Starry Night',
        artist: 'Vincent van Gogh',
        period: 'Post-Impressionism',
        medium: 'Oil on canvas',
        location: 'Museum of Modern Art, New York',
        imageUrl: 'https://example.com/starry-night.jpg',
        metUrl: 'https://example.com/starry-night',
      };

      const mockResult = { rows: [mockArtwork] };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await Artwork.findById(artworkId);

      // Check if the correct SQL query was executed
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM artworks WHERE id = $1', [artworkId]);

      // Ensure that the result matches the mock
      expect(result).toEqual(mockArtwork);
    });

    it('should return null if no artwork is found', async () => {
      const artworkId = 999; // ID that doesn't exist

      // Mock the query to return an empty result
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await Artwork.findById(artworkId);

      // Check if the correct SQL query was executed
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM artworks WHERE id = $1', [artworkId]);

      // Ensure the method returns null when no rows are found
      expect(result).toBeNull();
    });
  });

  describe('findPaginated', () => {
    it('should return paginated artworks', async () => {
      const limit = 10;
      const offset = 0;
      const mockArtworks = [
        { id: 1, title: 'Starry Night', artist: 'Vincent van Gogh' },
        { id: 2, title: 'Mona Lisa', artist: 'Leonardo da Vinci' },
      ];

      const mockResult = { rows: mockArtworks };
      pool.query.mockResolvedValueOnce(mockResult);

      const result = await Artwork.findPaginated(limit, offset);

      // Check if the correct SQL query was executed
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM artworks ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );

      // Ensure that the result matches the mock
      expect(result).toEqual(mockArtworks);
    });
  });
});
