const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes');
const { registerUser, loginUser } = require('../../services/authService');

jest.mock('../../services/authService');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should register a new user and return user details with a token', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      const mockToken = 'mockToken';

      registerUser.mockResolvedValueOnce({ user: mockUser, token: mockToken });

      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, token: mockToken });
      expect(registerUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });

    it('should return 400 if the username or email already exists', async () => {
      const error = new Error('Unique constraint violation');
      error.code = '23505';
      error.detail = 'Key (username)=(testuser) already exists.';

      registerUser.mockRejectedValueOnce(error);

      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Username already exists' });
      expect(registerUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });

    it('should return 500 if there is a server error', async () => {
      registerUser.mockRejectedValueOnce(new Error('Test error'));

      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Server error');
      expect(registerUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user and return user details with a token', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      const mockToken = 'mockToken';

      loginUser.mockResolvedValueOnce({ user: mockUser, token: mockToken });

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser, token: mockToken });
      expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
    });

    it('should return 401 if credentials are invalid', async () => {
      loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid credentials' });
      expect(loginUser).toHaveBeenCalledWith('testuser', 'wrongpassword');
    });

    it('should return 401 if there is an error during login', async () => {
        loginUser.mockRejectedValueOnce(new Error('Test error'));
    
        const response = await request(app)
          .post('/auth/login')
          .send({ username: 'testuser', password: 'password123' });
    
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid credentials' });
        expect(loginUser).toHaveBeenCalledWith('testuser', 'password123');
    });
  });
});
