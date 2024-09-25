const ArtworkService = require('../../services/artworkService');
const Artwork = require('../../models/artworkModel');
const { fetchRandomArtworksFromAPI } = require('../../externalApi/metApi');

// Mock dependencies
jest.mock('../../models/artworkModel');
jest.mock('../../externalApi/metApi');

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('ArtworkService', () => {
  // Test for fetching and saving artworks
  describe('fetchAndSaveArtworks', () => {
    it('should fetch and save multiple artworks from API', async () => {
      const mockApiResponse = [
        {
          title: 'Starry Night',
          artistDisplayName: 'Vincent van Gogh',
          objectDate: '1889',
          medium: 'Oil on canvas',
          repository: 'Museum of Modern Art, New York',
          primaryImage: 'https://example.com/starry-night.jpg',
          objectURL: 'https://example.com/starry-night',
        },
      ];

      const mockSavedArtwork = {
        id: 1,
        title: 'Starry Night',
        artist: 'Vincent van Gogh',
        period: '1889',
        medium: 'Oil on canvas',
        location: 'Museum of Modern Art, New York',
        imageUrl: 'https://example.com/starry-night.jpg',
        metUrl: 'https://example.com/starry-night',
      };

      // Mock API response and database save
      fetchRandomArtworksFromAPI.mockResolvedValue(mockApiResponse);
      Artwork.create.mockResolvedValue(mockSavedArtwork);

      // Call the service
      const result = await ArtworkService.fetchAndSaveArtworks(1);

      // Expectations
      expect(fetchRandomArtworksFromAPI).toHaveBeenCalledWith(1);
      expect(Artwork.create).toHaveBeenCalledWith({
        title: 'Starry Night',
        artist: 'Vincent van Gogh',
        period: '1889',
        medium: 'Oil on canvas',
        location: 'Museum of Modern Art, New York',
        imageUrl: 'https://example.com/starry-night.jpg',
        metUrl: 'https://example.com/starry-night',
      });
      expect(result).toEqual([mockSavedArtwork]);
    });

    it('should throw "Server error" if fetching or saving artworks fails', async () => {
      // Mock API failure
      fetchRandomArtworksFromAPI.mockRejectedValue(new Error('API error'));

      // Call and assert error
      await expect(ArtworkService.fetchAndSaveArtworks(1)).rejects.toThrow('Server error');
    });
  });

  // Test for fetching artwork by ID
  describe('getArtworkById', () => {
    it('should return an artwork by its ID', async () => {
      const mockArtwork = {
        id: 1,
        title: 'Starry Night',
        artist: 'Vincent van Gogh',
      };

      // Mock database query
      Artwork.findById.mockResolvedValue(mockArtwork);

      // Call the service
      const result = await ArtworkService.getArtworkById(1);

      // Expectations
      expect(Artwork.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockArtwork);
    });

    it('should throw "Server error" if fetching artwork by ID fails', async () => {
      // Mock database failure
      Artwork.findById.mockRejectedValue(new Error('Database error'));

      // Call and assert error
      await expect(ArtworkService.getArtworkById(1)).rejects.toThrow('Server error');
    });
  });

  // Test for paginated artworks
  describe('getPaginatedArtworks', () => {
    it('should return paginated artworks', async () => {
      const mockArtworks = [
        { id: 1, title: 'Starry Night' },
        { id: 2, title: 'Mona Lisa' },
      ];
  
      // Mock the findPaginated and countAll methods
      Artwork.findPaginated.mockResolvedValue(mockArtworks);
      Artwork.countAll.mockResolvedValue(2);
  
      // Mock fetchAndSaveArtworks to not fetch more in this scenario
      jest.spyOn(ArtworkService, 'fetchAndSaveArtworks').mockResolvedValue([]);
  
      // Call the service
      const result = await ArtworkService.getPaginatedArtworks(1, 20);
  
      // Expectations
      expect(Artwork.findPaginated).toHaveBeenCalledWith(20, 0);  // pageSize = 20, offset = (1-1)*20 = 0
      expect(result.artworks).toEqual(mockArtworks);
    });
  
    it('should throw an error if fetching paginated artworks fails', async () => {
      // Mock database failure
      Artwork.findPaginated.mockRejectedValue(new Error('Database error'));
  
      // Call and assert error
      await expect(ArtworkService.getPaginatedArtworks(1, 20)).rejects.toThrow('Database error');
    });
  });
  
});
