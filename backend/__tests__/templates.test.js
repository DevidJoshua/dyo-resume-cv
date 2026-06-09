require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/templateController');

const mockReq = (params = {}, body = {}, query = {}) => ({ params, body, query });

describe('Templates Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const templates = [
    { id: 1, name: 'Professional', code: 'professional', isActive: true },
    { id: 2, name: 'Modern', code: 'modern', isActive: false },
  ];

  it('should return all templates', async () => {
    prisma.homepageTemplate.findMany.mockResolvedValue(templates);
    const res = mockRes();
    await controller.getTemplates(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(templates);
  });

  it('should return active template with configurations', async () => {
    const activeTemplate = { id: 1, name: 'Professional', code: 'professional', isActive: true, configurations: [{ id: 1, configurationJson: '{}' }] };
    prisma.homepageTemplate.findFirst.mockResolvedValue(activeTemplate);
    const res = mockRes();
    await controller.getActiveTemplate(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(activeTemplate);
  });

  it('should return active template even when null (no 404)', async () => {
    prisma.homepageTemplate.findFirst.mockResolvedValue(null);
    const res = mockRes();
    await controller.getActiveTemplate(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(null);
  });

  it('should activate a template and deactivate others', async () => {
    prisma.homepageTemplate.updateMany.mockResolvedValue({ count: 2 });
    prisma.homepageTemplate.update.mockResolvedValue({ id: 2, isActive: true });
    const req = mockReq({ id: '2' });
    const res = mockRes();
    await controller.setActiveTemplate(req, res);
    expect(prisma.homepageTemplate.updateMany).toHaveBeenCalledWith({
      where: { isActive: true },
      data: { isActive: false },
    });
    expect(prisma.homepageTemplate.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { isActive: true },
    });
  });

  it('should create a template', async () => {
    const newTpl = { name: 'New', code: 'new', isActive: false };
    prisma.homepageTemplate.create.mockResolvedValue({ id: 3, ...newTpl });
    const req = mockReq({}, newTpl);
    const res = mockRes();
    await controller.createTemplate(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
