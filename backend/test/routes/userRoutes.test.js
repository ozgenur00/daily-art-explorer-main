const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoutes');
const UserService = require('../../services/userService');
const { authenticateToken } = require('../../middleware/authMiddleware');

jest.mock('../../services/userService');
jest.mock('../../middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /users/:id', () => {
    it('should update a user if authorized', async () => {
      const mockUpdatedUser = { id: 1, username: 'updateduser', email: 'updated@example.com' };

      UserService.updateUser.mockResolvedValueOnce(mockUpdatedUser);

      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: '1' }; 
        next();
      });

      const response = await request(app)
        .put('/users/1')
        .send({
          username: 'updateduser',
          email: 'updated@example.com',
          currentPassword: 'password123',
          newPassword: 'newpassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedUser);
      expect(UserService.updateUser).toHaveBeenCalledWith("1", {
        username: 'updateduser',
        email: 'updated@example.com',
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      });
    });

    it('should return 403 if trying to update another user', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: '2' }; 
        next();
      });

      const response = await request(app)
        .put('/users/1')
        .send({
          username: 'updateduser',
          email: 'updated@example.com',
          currentPassword: 'password123',
          newPassword: 'newpassword123',
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'You are not authorized to update this user.' });
      expect(UserService.updateUser).not.toHaveBeenCalled();
    });

    it('should return 400 if the current password is incorrect', async () => {
      UserService.updateUser.mockRejectedValueOnce(new Error('Current password is incorrect'));

      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: '1' }; 
        next();
      });

      const response = await request(app)
        .put('/users/1')
        .send({
          username: 'updateduser',
          email: 'updated@example.com',
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Current password is incorrect' });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user if authorized', async () => {
      UserService.deleteUser.mockResolvedValueOnce(true);

      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: '1' };
        next();
      });

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(204);
      expect(UserService.deleteUser).toHaveBeenCalledWith("1");
    });

    it('should return 403 if trying to delete another user', async () => {
      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: '2' }; 
        next();
      });

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'You are not authorized to delete this user.' });
      expect(UserService.deleteUser).not.toHaveBeenCalled();
    });

    it('should return 404 if the user was not found', async () => {
      UserService.deleteUser.mockResolvedValueOnce(false);

      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: '1' }; 
        next();
      });

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });

    it('should return 500 if there is a server error', async () => {
      UserService.deleteUser.mockRejectedValueOnce(new Error('Test error'));

      authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: '1' };
        next();
      });

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
    });
  });
});
