require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/contactController');

const mockReq = (body = {}, params = {}, query = {}) => ({ body, params, query });

describe('Contact Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('createMessage', () => {
    it('should create and return a contact message', async () => {
      const msgData = { name: 'John', email: 'john@test.com', subject: 'Hello', message: 'Test message' };
      prisma.contactMessage.create.mockResolvedValue({ id: 1, ...msgData, createdAt: new Date().toISOString() });

      const req = mockReq(msgData);
      const res = mockRes();
      await controller.createMessage(req, res);

      expect(prisma.contactMessage.create).toHaveBeenCalledWith({ data: msgData });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 on error', async () => {
      prisma.contactMessage.create.mockRejectedValue(new Error('DB error'));
      const req = mockReq({ name: 'John', email: 'john@test.com', message: 'Test' });
      const res = mockRes();

      await controller.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getMessages', () => {
    it('should return all messages ordered by newest first', async () => {
      const messages = [
        { id: 2, name: 'Jane', createdAt: new Date().toISOString() },
        { id: 1, name: 'John', createdAt: new Date().toISOString() },
      ];
      prisma.contactMessage.findMany.mockResolvedValue(messages);
      prisma.contactMessage.count.mockResolvedValue(2);

      const req = mockReq({}, {}, { page: '1', limit: '10' });
      const res = mockRes();
      await controller.getMessages(req, res);

      expect(prisma.contactMessage.findMany).toHaveBeenCalledWith(expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      }));
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message', async () => {
      prisma.contactMessage.delete.mockResolvedValue({ id: 1 });
      const req = mockReq({}, { id: '1' });
      const res = mockRes();
      await controller.deleteMessage(req, res);

      expect(prisma.contactMessage.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Message deleted' });
    });
  });
});
