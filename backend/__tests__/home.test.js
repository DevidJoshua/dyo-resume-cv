require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/homeController');

const mockReq = (body = {}) => ({ body });

describe('Home Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const sampleHome = {
    id: 1, heroTitle: 'Devid Joshua', heroSubtitle: 'Full Stack Developer',
    aboutText: 'A passionate developer', profileImage: '/uploads/profile.jpg',
    ctaText: 'Hire Me', ctaUrl: '/contact',
  };

  it('should return home settings', async () => {
    prisma.homeSetting.findFirst.mockResolvedValue(sampleHome);
    const res = mockRes();
    await controller.getHomeSettings(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(sampleHome);
  });

  it('should create default home settings if none exist', async () => {
    prisma.homeSetting.findFirst.mockResolvedValue(null);
    prisma.homeSetting.create.mockResolvedValue({ id: 1 });
    const res = mockRes();
    await controller.getHomeSettings(mockReq(), res);
    expect(prisma.homeSetting.create).toHaveBeenCalledWith({ data: {} });
  });

  it('should update home settings', async () => {
    prisma.homeSetting.findFirst.mockResolvedValue({ id: 1 });
    prisma.homeSetting.update.mockResolvedValue({ ...sampleHome, heroTitle: 'Updated' });
    const req = mockReq({ heroTitle: 'Updated' });
    const res = mockRes();
    await controller.updateHomeSettings(req, res);
    expect(prisma.homeSetting.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { heroTitle: 'Updated' },
    });
  });
});
