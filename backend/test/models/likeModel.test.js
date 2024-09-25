const Like = require('../../models/likeModel');
const pool = require('../../db');


jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('Like Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a new like and return the created like', async () => {
      const mockLike = {
        id: 1,
        user_id: 1,
        artwork_id: 2,
      };

      pool.query.mockResolvedValueOnce({ rows: [mockLike] });

      const result = await Like.create({ user_id: 1, artwork_id: 2 });

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO likes (user_id, artwork_id) VALUES ($1, $2) RETURNING *',
        [1, 2]
      );

      expect(result).toEqual(mockLike);
    });
  });

  describe('findByUserAndArtworkId', () => {
    it('should find a like by user_id and artwork_id and return it', async () => {
      const mockLike = {
        id: 1,
        user_id: 1,
        artwork_id: 2,
      };

      pool.query.mockResolvedValueOnce({ rows: [mockLike] });

      const result = await Like.findByUserAndArtworkId(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM likes WHERE user_id = $1 AND artwork_id = $2',
        [1, 2]
      );

      expect(result).toEqual(mockLike);
    });
  });

  describe('findByUserId', () => {
    it('should find likes by user_id and return them', async () => {
      const mockLikes = [
        { id: 1, user_id: 1, artwork_id: 2 },
        { id: 2, user_id: 1, artwork_id: 3 },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockLikes });

      const result = await Like.findByUserId(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM likes WHERE user_id = $1',
        [1]
      );

      expect(result).toEqual(mockLikes);
    });
  });

  describe('delete', () => {
    it('should delete a like by user_id and artwork_id', async () => {
      pool.query.mockResolvedValueOnce({});

      const result = await Like.delete(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM likes WHERE user_id = $1 AND artwork_id = $2',
        [1, 2]
      );

      expect(result).toEqual({});
    });
  });
});
