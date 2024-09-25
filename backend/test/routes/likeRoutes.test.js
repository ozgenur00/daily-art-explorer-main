const request = require('supertest');
const express = require('express');
const likeRoutes = require('../../routes/likeRoutes');
const LikeService = require('../../services/likeService');
const { authenticateToken } = require('../../middleware/authMiddleware');

jest.mock('../../services/likeService');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/likes', likeRoutes);


authenticateToken.mockImplementation((req, res, next) => {
  req.user = { id: 1 }; 
  next();
});

describe('Like Routes', () => {
  describe('POST /likes', () => {
    it('should like an artwork', async () => {
      const mockLike = { id: 1, user_id: 1, artwork_id: 2 };

      LikeService.likeArtwork.mockResolvedValue(mockLike);

      const response = await request(app)
        .post('/likes')
        .send({ artwork_id: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLike);
      expect(LikeService.likeArtwork).toHaveBeenCalledWith(1, 2);
    });

    it('should return 400 if artwork_id is missing', async () => {
      const response = await request(app)
        .post('/likes')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'artwork_id is required' });
    });

    it('should return 500 if there is a server error', async () => {
      LikeService.likeArtwork.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .post('/likes')
        .send({ artwork_id: 2 });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });

  describe('GET /likes', () => {
    it('should return liked artworks', async () => {
      const mockLikes = [
        { id: 1, user_id: 1, artwork_id: 2 },
        { id: 2, user_id: 1, artwork_id: 3 },
      ];

      LikeService.getLikedArtworksByUser.mockResolvedValue(mockLikes);

      const response = await request(app)
        .get('/likes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLikes);
      expect(LikeService.getLikedArtworksByUser).toHaveBeenCalledWith(1);
    });

    it('should return 500 if there is a server error', async () => {
      LikeService.getLikedArtworksByUser.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .get('/likes');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });

  describe('DELETE /likes/:artwork_id', () => {
    it('should unlike an artwork', async () => {
      LikeService.unlikeArtwork.mockResolvedValue(true);

      const response = await request(app)
        .delete('/likes/2');

      expect(response.status).toBe(204);
      expect(LikeService.unlikeArtwork).toHaveBeenCalledWith(1, 2);
    });

    it('should return 404 if like not found', async () => {
      LikeService.unlikeArtwork.mockResolvedValue(false);

      const response = await request(app)
        .delete('/likes/2');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Like not found' });
    });

    it('should return 500 if there is a server error', async () => {
      LikeService.unlikeArtwork.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .delete('/likes/2');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });
});
