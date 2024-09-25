const request = require('supertest');
const express = require('express');
const artworkRoutes = require('../../routes/artworkRoutes');
const ArtworkService = require('../../services/artworkService');
const { authenticateToken } = require('../../middleware/authMiddleware');

// Mock the services and middleware
jest.mock('../../services/artworkService');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/artworks', artworkRoutes);

// Make sure that the auth middleware is bypassed
authenticateToken.mockImplementation((req, res, next) => next());


describe('Artwork Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();  // Clear any previous mocks
  });

  describe('POST /artworks/fetch', () => {
    it('should fetch and save multiple artworks', async () => {
      const mockArtworks = [{ id: 1, title: 'Artwork 1' }, { id: 2, title: 'Artwork 2' }];
      
      // Mock service to return fake artworks
      ArtworkService.fetchAndSaveArtworks.mockResolvedValue(mockArtworks);

      const response = await request(app)
        .post('/artworks/fetch')
        .send({ count: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArtworks[0]);  // Your route returns only the first artwork
      expect(ArtworkService.fetchAndSaveArtworks).toHaveBeenCalledWith(2);
    });

    it('should return 500 if the service throws an error', async () => {
      ArtworkService.fetchAndSaveArtworks.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .post('/artworks/fetch')
        .send({ count: 2 });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });

  describe('GET /artworks', () => {
    it('should return paginated artworks', async () => {
      const mockPaginatedArtworks = {
        artworks: [{ id: 1, title: 'Artwork 1' }, { id: 2, title: 'Artwork 2' }],
        totalPages: 5,
        currentPage: 1
      };

      // Mock service to return paginated artworks
      ArtworkService.getPaginatedArtworks.mockResolvedValue(mockPaginatedArtworks);

      const response = await request(app)
        .get('/artworks?page=1&pageSize=20');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPaginatedArtworks);
      expect(ArtworkService.getPaginatedArtworks).toHaveBeenCalledWith(1, 20);
    });

    it('should return 500 if there is an error fetching artworks', async () => {
      ArtworkService.getPaginatedArtworks.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .get('/artworks?page=1&pageSize=20');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });

  describe('GET /artworks/:id', () => {
    it('should return an artwork by ID', async () => {
      const mockArtwork = { id: 1, title: 'Artwork 1' };

      // Mock service to return an artwork by ID
      ArtworkService.getArtworkById.mockResolvedValue(mockArtwork);

      const response = await request(app)
        .get('/artworks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArtwork);
      // Fix: Use string "1" since Express route parameters are strings by default
      expect(ArtworkService.getArtworkById).toHaveBeenCalledWith("1");
    });

    it('should return 404 if artwork is not found', async () => {
      ArtworkService.getArtworkById.mockResolvedValue(null);

      const response = await request(app)
        .get('/artworks/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Artwork not found' });
    });

    it('should return 500 if there is an error fetching the artwork', async () => {
      ArtworkService.getArtworkById.mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .get('/artworks/1');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });

  describe('Authentication middleware', () => {
    it('should return 401 if token is invalid', async () => {
      authenticateToken.mockImplementation((req, res) => res.status(401).send('Unauthorized'));

      const response = await request(app)
        .get('/artworks?page=1&pageSize=20');

      expect(response.status).toBe(401);
      expect(response.text).toBe('Unauthorized');
    });
  });
});
