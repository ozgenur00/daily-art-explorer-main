const SavedArtwork = require('../../models/savedArtworkModel');
const pool = require('../../db');

// Mock the pool.query method
jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('SavedArtwork Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a new saved artwork and return the created record', async () => {
      const mockSavedArtwork = {
        id: 1,
        user_id: 1,
        artwork_id: 2,
      };

      pool.query.mockResolvedValueOnce({ rows: [mockSavedArtwork] });

      const result = await SavedArtwork.create({ user_id: 1, artwork_id: 2 });

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO saved_artworks (user_id, artwork_id) VALUES ($1, $2) RETURNING *',
        [1, 2]
      );

      expect(result).toEqual(mockSavedArtwork);
    });
  });

  describe('findByUserAndArtworkId', () => {
    it('should find a saved artwork by user_id and artwork_id and return it', async () => {
      const mockSavedArtwork = {
        id: 1,
        user_id: 1,
        artwork_id: 2,
      };

      pool.query.mockResolvedValueOnce({ rows: [mockSavedArtwork] });

      const result = await SavedArtwork.findByUserAndArtworkId(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM saved_artworks WHERE user_id = $1 AND artwork_id = $2',
        [1, 2]
      );

      expect(result).toEqual(mockSavedArtwork);
    });
  });

  describe('findByUserId', () => {
    it('should find saved artworks by user_id and return them', async () => {
      const mockSavedArtworks = [
        { id: 1, user_id: 1, artwork_id: 2 },
        { id: 2, user_id: 1, artwork_id: 3 },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockSavedArtworks });

      const result = await SavedArtwork.findByUserId(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM saved_artworks WHERE user_id = $1',
        [1]
      );

      expect(result).toEqual(mockSavedArtworks);
    });
  });

  describe('delete', () => {
    it('should delete a saved artwork by user_id and artwork_id', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      const result = await SavedArtwork.delete(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM saved_artworks WHERE user_id = $1 AND artwork_id = $2',
        [1, 2]
      );

      expect(result.rowCount).toBe(1);
    });

    it('should return 0 if no saved artwork was deleted', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0 });

      const result = await SavedArtwork.delete(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM saved_artworks WHERE user_id = $1 AND artwork_id = $2',
        [1, 2]
      );

      expect(result.rowCount).toBe(0);
    });
  });
});
