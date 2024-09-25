const LikeService = require('../../services/likeService');
const Like = require('../../models/likeModel');

jest.mock('../../models/likeModel');

describe('LikeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('likeArtwork', () => {
    it('should like an artwork if not already liked', async () => {
      const mockLike = { id: 1, user_id: 1, artwork_id: 2 };

      // Simulate that the artwork is not already liked
      Like.findByUserAndArtworkId.mockResolvedValueOnce(null);
      Like.create.mockResolvedValueOnce(mockLike);

      const result = await LikeService.likeArtwork(1, 2);

      expect(Like.findByUserAndArtworkId).toHaveBeenCalledWith(1, 2);
      expect(Like.create).toHaveBeenCalledWith({ user_id: 1, artwork_id: 2 });
      expect(result).toEqual(mockLike);
    });

    it('should throw an error if the artwork is already liked', async () => {
      const mockLike = { id: 1, user_id: 1, artwork_id: 2 };

      // Simulate that the artwork is already liked
      Like.findByUserAndArtworkId.mockResolvedValueOnce(mockLike);

      await expect(LikeService.likeArtwork(1, 2)).rejects.toThrow('Artwork already liked');

      expect(Like.findByUserAndArtworkId).toHaveBeenCalledWith(1, 2);
      expect(Like.create).not.toHaveBeenCalled();
    });

    it('should throw a general error if something goes wrong', async () => {
      Like.findByUserAndArtworkId.mockRejectedValueOnce(new Error('Test error'));

      await expect(LikeService.likeArtwork(1, 2)).rejects.toThrow('Test error');

      expect(Like.findByUserAndArtworkId).toHaveBeenCalledWith(1, 2);
      expect(Like.create).not.toHaveBeenCalled();
    });
  });

  describe('getLikedArtworksByUser', () => {
    it('should return liked artworks for a user', async () => {
      const mockLikes = [
        { id: 1, user_id: 1, artwork_id: 2 },
        { id: 2, user_id: 1, artwork_id: 3 },
      ];

      Like.findByUserId.mockResolvedValueOnce(mockLikes);

      const result = await LikeService.getLikedArtworksByUser(1);

      expect(Like.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLikes);
    });

    it('should throw a general error if something goes wrong', async () => {
      Like.findByUserId.mockRejectedValueOnce(new Error('Test error'));

      await expect(LikeService.getLikedArtworksByUser(1)).rejects.toThrow('Error fetching liked artworks');

      expect(Like.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('unlikeArtwork', () => {
    it('should unlike an artwork', async () => {
      Like.delete.mockResolvedValueOnce({ rowCount: 1 });

      const result = await LikeService.unlikeArtwork(1, 2);

      expect(Like.delete).toHaveBeenCalledWith(1, 2);
      expect(result).toBe(true);
    });

    it('should return false if no like was deleted', async () => {
      Like.delete.mockResolvedValueOnce({ rowCount: 0 });

      const result = await LikeService.unlikeArtwork(1, 2);

      expect(Like.delete).toHaveBeenCalledWith(1, 2);
      expect(result).toBe(false);
    });

    it('should throw a general error if something goes wrong', async () => {
      Like.delete.mockRejectedValueOnce(new Error('Test error'));

      await expect(LikeService.unlikeArtwork(1, 2)).rejects.toThrow('Error unliking artwork');

      expect(Like.delete).toHaveBeenCalledWith(1, 2);
    });
  });
});
