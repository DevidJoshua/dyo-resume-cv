jest.mock('jsonwebtoken');

const jwt = require('jsonwebtoken');
const { authenticate } = require('../src/middleware/auth');

const mockReq = (headers = {}) => ({ headers });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe('Auth Middleware', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return 401 if no token provided', () => {
    const req = mockReq({});
    const res = mockRes();
    authenticate(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid token'); });
    const req = mockReq({ authorization: 'Bearer invalidtoken' });
    const res = mockRes();
    authenticate(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with user if token is valid', () => {
    const decoded = { userId: 1, username: 'admin' };
    jwt.verify.mockReturnValue(decoded);
    const req = mockReq({ authorization: 'Bearer validtoken' });
    const res = mockRes();
    authenticate(req, res, mockNext);
    expect(req.user).toEqual(decoded);
    expect(mockNext).toHaveBeenCalled();
  });
});
