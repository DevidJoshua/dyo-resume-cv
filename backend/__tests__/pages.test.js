require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/pageController');

const mockReq = (params = {}, body = {}, query = {}) => ({ params, body, query });

describe('Pages Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const samplePage = {
    id: 1, title: 'About Us', slug: 'about-us', templateId: 1,
    isPublished: true, template: { id: 1, name: 'Default' },
    contents: [{ id: 1, contentJson: '{}' }],
  };

  it('getPages should return all pages', async () => {
    prisma.page.findMany.mockResolvedValue([samplePage]);
    const res = mockRes();
    await controller.getPages(mockReq({}, {}, {}), res);
    expect(prisma.page.findMany).toHaveBeenCalledWith({
      where: {},
      include: { template: true },
      orderBy: { createdAt: 'desc' },
    });
    expect(res.json).toHaveBeenCalledWith([samplePage]);
  });

  it('getPageBySlug should return published page by slug', async () => {
    prisma.page.findUnique.mockResolvedValue(samplePage);
    const req = mockReq({ slug: 'about-us' });
    const res = mockRes();
    await controller.getPageBySlug(req, res);
    expect(prisma.page.findUnique).toHaveBeenCalledWith({
      where: { slug: 'about-us', isPublished: true },
      include: { template: true, contents: true },
    });
    expect(res.json).toHaveBeenCalledWith(samplePage);
  });

  it('getPageBySlug should 404 if not found', async () => {
    prisma.page.findUnique.mockResolvedValue(null);
    const req = mockReq({ slug: 'nonexistent' });
    const res = mockRes();
    await controller.getPageBySlug(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('create should create a page', async () => {
    const newPage = { title: 'New Page', slug: 'new-page', templateId: 1 };
    prisma.page.create.mockResolvedValue({ id: 2, ...newPage });
    prisma.pageContent.create.mockResolvedValue({ id: 1, pageId: 2, contentJson: '{}' });
    const req = mockReq({}, newPage);
    const res = mockRes();
    await controller.createPage(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('update should update a page', async () => {
    const update = { title: 'Updated' };
    prisma.page.update.mockResolvedValue({ id: 1, ...update });
    const req = mockReq({ id: '1' }, update);
    const res = mockRes();
    await controller.updatePage(req, res);
    expect(prisma.page.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: update,
    });
  });

  it('delete should remove a page', async () => {
    prisma.page.delete.mockResolvedValue({ id: 1 });
    const req = mockReq({ id: '1' });
    const res = mockRes();
    await controller.deletePage(req, res);
    expect(prisma.page.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.json).toHaveBeenCalledWith({ message: 'Page deleted' });
  });
});
