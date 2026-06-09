require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/portfolioV2Controller');

const mockReq = (params = {}, body = {}, query = {}) => ({ params, body, query });

describe('Portfolio V2 Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const samplePortfolios = [
    {
      id: 1, title: 'E-Commerce App', shortDescription: 'A full-stack e-commerce platform',
      isPublished: true, isFeatured: false, displayOrder: 1,
      category: { id: 1, name: 'Web App' },
      technologies: [{ id: 1, technologyName: 'React' }],
      featuredImage: { id: 1, filePath: '/uploads/img.jpg' },
    },
  ];

  describe('getPortfolios', () => {
    it('should return paginated portfolios', async () => {
      prisma.portfolio.findMany.mockResolvedValue(samplePortfolios);
      prisma.portfolio.count.mockResolvedValue(1);

      const req = mockReq({}, {}, { limit: '10', page: '1' });
      const res = mockRes();

      await controller.getPortfolios(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.any(Array),
        total: 1,
        page: 1,
      }));
    });

    it('should include relations in query', async () => {
      prisma.portfolio.findMany.mockResolvedValue(samplePortfolios);
      prisma.portfolio.count.mockResolvedValue(1);

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await controller.getPortfolios(req, res);

      const callArgs = prisma.portfolio.findMany.mock.calls[0][0];
      expect(callArgs.include).toBeDefined();
      expect(callArgs.include.category).toBe(true);
    });
  });

  describe('getPortfolio', () => {
    it('should return portfolio with relations', async () => {
      prisma.portfolio.findUnique.mockResolvedValue(samplePortfolios[0]);
      const req = mockReq({ id: '1' });
      const res = mockRes();

      await controller.getPortfolio(req, res);

      expect(res.json).toHaveBeenCalledWith(samplePortfolios[0]);
    });

    it('should return 404 if not found', async () => {
      prisma.portfolio.findUnique.mockResolvedValue(null);
      const req = mockReq({ id: '999' });
      const res = mockRes();

      await controller.getPortfolio(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createPortfolio', () => {
    it('should create portfolio and return it', async () => {
      const newData = { title: 'New Project', shortDescription: 'Desc' };
      prisma.portfolio.create.mockResolvedValue({ id: 2, ...newData });
      const req = mockReq({}, newData);
      const res = mockRes();

      await controller.createPortfolio(req, res);

      expect(prisma.portfolio.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: 'New Project' }),
        include: expect.any(Object),
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updatePortfolio', () => {
    it('should update and return portfolio', async () => {
      const update = { title: 'Updated Title' };
      prisma.portfolioTechnology.deleteMany.mockResolvedValue({ count: 0 });
      prisma.portfolioGallery.deleteMany.mockResolvedValue({ count: 0 });
      prisma.portfolio.update.mockResolvedValue({ id: 1, ...update });
      const req = mockReq({ id: '1' }, update);
      const res = mockRes();

      await controller.updatePortfolio(req, res);

      expect(prisma.portfolio.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ title: 'Updated Title' }),
        include: expect.any(Object),
      });
    });
  });

  describe('deletePortfolio', () => {
    it('should delete portfolio', async () => {
      prisma.portfolio.delete.mockResolvedValue(samplePortfolios[0]);
      const req = mockReq({ id: '1' });
      const res = mockRes();

      await controller.deletePortfolio(req, res);

      expect(prisma.portfolio.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Portfolio deleted' });
    });
  });
});
