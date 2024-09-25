const request = require('supertest');
const express = require('express');
const savedArtworkRoutes = require('../../routes/savedArtworkRoutes');
const SavedArtworkService = require('../../services/savedArtworkService');
const { authenticateToken } = require('../../middleware/authMiddleware');

jest.mock('../../services/savedArtworkService');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/saved_artworks', savedArtworkRoutes);


authenticateToken.mockImplementation((req, res, next) => {
  req.user = { id: 1 }; 
  next();
});

describe('SavedArtwork Routes', () => {
  describe('POST /saved_artworks', () => {
    it('should save an artwork', async () => {
      const mockSavedArtwork = { id: 1, user_id: 1, artwork_id: 2 };

      SavedArtworkService.createSavedArtwork.mockResolvedValue(mockSavedArtwork);

      const response = await request(app)
        .post('/saved_artworks')
        .send({ artwork_id: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSavedArtwork);
      expect(SavedArtworkService.createSavedArtwork).toHaveBeenCalledWith(1, 2);
    });

    it('should return 400 if artwork_id is missing', async () => {
      const response = await request(app)
        .post('/saved_artworks')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'artwork_id is required' });
    });

    it('should return 500 if there is a server error', async () => {
      SavedArtworkService.createSavedArtwork.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .post('/saved_artworks')
        .send({ artwork_id: 2 });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });

  describe('GET /saved_artworks', () => {
    it('should return saved artworks for a user', async () => {
      const mockSavedArtworks = [
        { id: 1, user_id: 1, artwork_id: 2 },
        { id: 2, user_id: 1, artwork_id: 3 },
      ];

      SavedArtworkService.getSavedArtworksByUser.mockResolvedValue(mockSavedArtworks);

      const response = await request(app)
        .get('/saved_artworks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSavedArtworks);
      expect(SavedArtworkService.getSavedArtworksByUser).toHaveBeenCalledWith(1);
    });

    it('should return 500 if there is a server error', async () => {
      SavedArtworkService.getSavedArtworksByUser.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .get('/saved_artworks');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });

  describe('DELETE /saved_artworks/:artwork_id', () => {
    it('should unsave an artwork', async () => {
      SavedArtworkService.deleteSavedArtwork.mockResolvedValue(true);

      const response = await request(app)
        .delete('/saved_artworks/2');

      expect(response.status).toBe(204);
      expect(SavedArtworkService.deleteSavedArtwork).toHaveBeenCalledWith(1, 2);
    });

    it('should return 404 if the saved artwork is not found', async () => {
      SavedArtworkService.deleteSavedArtwork.mockResolvedValue(false);

      const response = await request(app)
        .delete('/saved_artworks/2');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Saved artwork not found' });
    });

    it('should return 500 if there is a server error', async () => {
      SavedArtworkService.deleteSavedArtwork.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .delete('/saved_artworks/2');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });
});
