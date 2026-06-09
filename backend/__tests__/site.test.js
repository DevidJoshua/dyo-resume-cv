require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/siteController');

const mockReq = (body = {}) => ({ body });

describe('Site Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('getSiteSettings', () => {
    it('should return existing settings', async () => {
      const settings = { id: 1, siteName: 'Devid Porto', layoutMode: 'single' };
      prisma.siteSetting.findFirst.mockResolvedValue(settings);
      const res = mockRes();
      await controller.getSiteSettings(mockReq(), res);
      expect(res.json).toHaveBeenCalledWith(settings);
    });

    it('should create default settings if none exist', async () => {
      prisma.siteSetting.findFirst.mockResolvedValue(null);
      prisma.siteSetting.create.mockResolvedValue({ id: 1, layoutMode: 'single', showSkillProficiency: true, enablePages: true, resumeLayout: 'classic' });
      const res = mockRes();
      await controller.getSiteSettings(mockReq(), res);
      expect(prisma.siteSetting.create).toHaveBeenCalledWith({ data: {} });
    });
  });

  describe('updateSiteSettings', () => {
    it('should update existing settings', async () => {
      prisma.siteSetting.findFirst.mockResolvedValue({ id: 1 });
      prisma.siteSetting.update.mockResolvedValue({ id: 1, siteName: 'Updated' });
      const req = mockReq({ siteName: 'Updated' });
      const res = mockRes();
      await controller.updateSiteSettings(req, res);
      expect(prisma.siteSetting.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { siteName: 'Updated' },
      });
    });

    it('should create settings if none exist on update', async () => {
      prisma.siteSetting.findFirst.mockResolvedValue(null);
      prisma.siteSetting.create.mockResolvedValue({ id: 1, siteName: 'New' });
      const req = mockReq({ siteName: 'New' });
      const res = mockRes();
      await controller.updateSiteSettings(req, res);
      expect(prisma.siteSetting.create).toHaveBeenCalledWith({ data: { siteName: 'New' } });
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard stats', async () => {
      prisma.portfolio.count.mockResolvedValue(5);
      prisma.contactMessage.count.mockResolvedValue(10);
      prisma.skill.count.mockResolvedValue(8);
      prisma.contactMessage.findMany.mockResolvedValue([{ id: 1, name: 'John' }]);

      const res = mockRes();
      await controller.getDashboard(mockReq(), res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        portfolioCount: 5,
        messageCount: 10,
        skillCount: 8,
        recentMessages: expect.any(Array),
      }));
    });
  });
});
