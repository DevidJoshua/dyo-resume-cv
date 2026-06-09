require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/socialController');

const mockReq = (body = {}, params = {}) => ({ body, params });

describe('Social Links Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const links = [
    { id: 1, platform: 'GitHub', url: 'https://github.com/devid', isActive: true },
    { id: 2, platform: 'LinkedIn', url: 'https://linkedin.com/in/devid', isActive: true },
  ];

  it('should return all social links', async () => {
    prisma.socialLink.findMany.mockResolvedValue(links);
    const res = mockRes();
    await controller.getSocialLinks(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(links);
  });

  it('should create a social link', async () => {
    const newLink = { platform: 'Twitter', url: 'https://twitter.com/devid' };
    prisma.socialLink.create.mockResolvedValue({ id: 3, ...newLink, isActive: true });
    const req = mockReq(newLink);
    const res = mockRes();
    await controller.createSocialLink(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should update a social link', async () => {
    prisma.socialLink.update.mockResolvedValue({ id: 1, platform: 'GitHub', url: 'https://github.com/new' });
    const req = mockReq({ url: 'https://github.com/new' }, { id: '1' });
    const res = mockRes();
    await controller.updateSocialLink(req, res);
    expect(prisma.socialLink.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { url: 'https://github.com/new' },
    });
  });

  it('should delete a social link', async () => {
    prisma.socialLink.delete.mockResolvedValue({ id: 1 });
    const req = mockReq({}, { id: '1' });
    const res = mockRes();
    await controller.deleteSocialLink(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Social link deleted' });
  });
});
