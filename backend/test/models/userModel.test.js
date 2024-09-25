const User = require('../../models/userModel');
const pool = require('../../db');

// Mock the pool.query method
jest.mock('../../db', () => ({
  query: jest.fn(),
}));

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a new user and return the created user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.create({ username: 'testuser', email: 'test@example.com', passwordHash: 'hashedpassword' });

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        ['testuser', 'test@example.com', 'hashedpassword']
      );

      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username and return it', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.findByUsername('testuser');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = $1', ['testuser']);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find a user by ID and return it', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password_hash: 'hashedpassword' };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.findById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const mockUpdatedUser = {
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
        password_hash: 'newhashedpassword',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUpdatedUser] });

      const result = await User.update(1, { username: 'updateduser', email: 'updated@example.com', passwordHash: 'newhashedpassword' });

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING *',
        ['updateduser', 'updated@example.com', 'newhashedpassword', 1]
      );

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('delete', () => {
    it('should delete a user and return true if successful', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      const result = await User.delete(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING *', [1]);
      expect(result).toBe(true);
    });

    it('should return false if no user was deleted', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0 });

      const result = await User.delete(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1 RETURNING *', [1]);
      expect(result).toBe(false);
    });
  });
});
