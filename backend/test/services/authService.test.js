const { registerUser, loginUser, generateToken } = require('../../services/authService');
const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return user details with a token', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      const mockToken = 'mockToken';

      bcrypt.hashSync.mockReturnValue('hashedpassword');
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });
      jwt.sign.mockReturnValue(mockToken);

      const result = await registerUser('testuser', 'test@example.com', 'password123');

      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        ['testuser', 'test@example.com', 'hashedpassword']
      );
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, username: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(result).toEqual({ user: mockUser, token: mockToken });
    });

    it('should throw an error if the username or email already exists', async () => {
      const error = new Error('Unique constraint violation');
      error.code = '23505';
      error.detail = 'Key (username)=(testuser) already exists.';

      pool.query.mockRejectedValueOnce(error);

      await expect(registerUser('testuser', 'test@example.com', 'password123')).rejects.toThrow('Unique constraint violation');
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('loginUser', () => {
    it('should return user details and token if credentials are valid', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' };
      const mockToken = 'mockToken';

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await loginUser('testuser', 'password123');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = $1', ['testuser']);
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1, username: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(result).toEqual({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
        token: mockToken,
      });
    });

    it('should throw an error if credentials are invalid', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });
      bcrypt.compareSync.mockReturnValue(false);

      await expect(loginUser('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
      expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });

    it('should throw an error if the user is not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(loginUser('nonexistentuser', 'password123')).rejects.toThrow('Invalid credentials');
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = $1', ['nonexistentuser']);
    });
  });
});
