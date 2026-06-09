jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { login, register, getMe } = require('../src/controllers/authController');
const mockReq = (body = {}, user = null) => ({ body, user });

describe('Auth Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('login', () => {
    const validUser = { id: 1, username: 'testuser', email: 'test@test.com', password: 'hashed', role: 'admin' };

    it('should login successfully with valid credentials', async () => {
      prisma.user.findFirst.mockResolvedValue(validUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      const req = mockReq({ username: 'testuser', password: 'password123' });
      const res = mockRes();

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        token: 'token123',
        user: expect.objectContaining({ username: 'testuser' }),
      }));
    });

    it('should return 401 if user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const req = mockReq({ username: 'nouser', password: 'pass' });
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid credentials' }));
    });

    it('should return 401 if password is wrong', async () => {
      prisma.user.findFirst.mockResolvedValue(validUser);
      bcrypt.compare.mockResolvedValue(false);
      const req = mockReq({ username: 'testuser', password: 'wrongpass' });
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if username or password missing', async () => {
      const req = mockReq({});
      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('getMe', () => {
    it('should return user without password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'testuser', email: 'test@test.com', role: 'admin' });
      const req = mockReq({}, { userId: 1 });
      const res = mockRes();

      await getMe(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ password: expect.anything() }));
    });

    it('should return null and 200 if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const req = mockReq({}, { userId: 999 });
      const res = mockRes();

      await getMe(req, res);

      expect(res.json).toHaveBeenCalledWith(null);
    });
  });
});
