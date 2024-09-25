const UserService = require('../../services/userService');
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');

jest.mock('../../models/userModel');
jest.mock('bcrypt');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user with a hashed password', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' };

      bcrypt.hash.mockResolvedValueOnce('hashedpassword');
      User.create.mockResolvedValueOnce(mockUser);

      const result = await UserService.createUser({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.create).toHaveBeenCalledWith({ username: 'testuser', email: 'test@example.com', passwordHash: 'hashedpassword' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user if the current password is correct', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' };
      const mockUpdatedUser = { id: 1, username: 'updateduser', email: 'updated@example.com', password_hash: 'newhashedpassword' };

      User.findById.mockResolvedValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(true);
      bcrypt.hash.mockResolvedValueOnce('newhashedpassword');
      User.update.mockResolvedValueOnce(mockUpdatedUser);

      const result = await UserService.updateUser(1, {
        username: 'updateduser',
        email: 'updated@example.com',
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(User.update).toHaveBeenCalledWith(1, {
        username: 'updateduser',
        email: 'updated@example.com',
        passwordHash: 'newhashedpassword',
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw an error if the current password is incorrect', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' };

      User.findById.mockResolvedValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(UserService.updateUser(1, {
        username: 'updateduser',
        email: 'updated@example.com',
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      })).rejects.toThrow('Current password is incorrect');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(User.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return true if successful', async () => {
      User.delete.mockResolvedValueOnce(true);

      const result = await UserService.deleteUser(1);

      expect(User.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should return false if the user was not found', async () => {
      User.delete.mockResolvedValueOnce(false);

      const result = await UserService.deleteUser(1);

      expect(User.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(false);
    });
  });
});
