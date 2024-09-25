const SavedArtworkService = require('../../services/savedArtworkService');
const SavedArtwork = require('../../models/savedArtworkModel');

jest.mock('../../models/savedArtworkModel');

describe('SavedArtworkService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSavedArtwork', () => {
    it('should save an artwork if not already saved', async () => {
      const mockSavedArtwork = { id: 1, user_id: 1, artwork_id: 2 };


      SavedArtwork.findByUserAndArtworkId.mockResolvedValueOnce(null);
      SavedArtwork.create.mockResolvedValueOnce(mockSavedArtwork);

      const result = await SavedArtworkService.createSavedArtwork(1, 2);

      expect(SavedArtwork.findByUserAndArtworkId).toHaveBeenCalledWith(1, 2);
      expect(SavedArtwork.create).toHaveBeenCalledWith({ user_id: 1, artwork_id: 2 });
      expect(result).toEqual(mockSavedArtwork);
    });

    it('should throw an error if the artwork is already saved', async () => {
      const mockSavedArtwork = { id: 1, user_id: 1, artwork_id: 2 };


      SavedArtwork.findByUserAndArtworkId.mockResolvedValueOnce(mockSavedArtwork);

      await expect(SavedArtworkService.createSavedArtwork(1, 2)).rejects.toThrow('Artwork already saved');

      expect(SavedArtwork.findByUserAndArtworkId).toHaveBeenCalledWith(1, 2);
      expect(SavedArtwork.create).not.toHaveBeenCalled();
    });

    it('should throw a general error if something goes wrong', async () => {
      SavedArtwork.findByUserAndArtworkId.mockRejectedValueOnce(new Error('Test error'));

      await expect(SavedArtworkService.createSavedArtwork(1, 2)).rejects.toThrow('Test error');

      expect(SavedArtwork.findByUserAndArtworkId).toHaveBeenCalledWith(1, 2);
      expect(SavedArtwork.create).not.toHaveBeenCalled();
    });
  });

  describe('getSavedArtworksByUser', () => {
    it('should return saved artworks for a user', async () => {
      const mockSavedArtworks = [
        { id: 1, user_id: 1, artwork_id: 2 },
        { id: 2, user_id: 1, artwork_id: 3 },
      ];

      SavedArtwork.findByUserId.mockResolvedValueOnce(mockSavedArtworks);

      const result = await SavedArtworkService.getSavedArtworksByUser(1);

      expect(SavedArtwork.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSavedArtworks);
    });

    it('should throw a general error if something goes wrong', async () => {
      SavedArtwork.findByUserId.mockRejectedValueOnce(new Error('Test error'));

      await expect(SavedArtworkService.getSavedArtworksByUser(1)).rejects.toThrow('Error fetching saved artworks');

      expect(SavedArtwork.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteSavedArtwork', () => {
    it('should unsave an artwork', async () => {
      SavedArtwork.delete.mockResolvedValueOnce({ rowCount: 1 });

      const result = await SavedArtworkService.deleteSavedArtwork(1, 2);

      expect(SavedArtwork.delete).toHaveBeenCalledWith(1, 2);
      expect(result).toBe(true);
    });

    it('should return false if no saved artwork was deleted', async () => {
      SavedArtwork.delete.mockResolvedValueOnce({ rowCount: 0 });

      const result = await SavedArtworkService.deleteSavedArtwork(1, 2);

      expect(SavedArtwork.delete).toHaveBeenCalledWith(1, 2);
      expect(result).toBe(false);
    });

    it('should throw a general error if something goes wrong', async () => {
      SavedArtwork.delete.mockRejectedValueOnce(new Error('Test error'));

      await expect(SavedArtworkService.deleteSavedArtwork(1, 2)).rejects.toThrow('Error unsaving artwork');

      expect(SavedArtwork.delete).toHaveBeenCalledWith(1, 2);
    });
  });
});
