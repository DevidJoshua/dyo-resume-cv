const createModelMock = () => ({
  findMany: jest.fn(),
  findFirst: jest.fn(),
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
});

const mockPrisma = {
  user: createModelMock(),
  skill: createModelMock(),
  portfolio: createModelMock(),
  portfolioCategory: createModelMock(),
  portfolioTechnology: createModelMock(),
  portfolioGallery: createModelMock(),
  contactMessage: createModelMock(),
  socialLink: createModelMock(),
  siteSetting: createModelMock(),
  homeSetting: createModelMock(),
  homepageTemplate: createModelMock(),
  homepageConfiguration: createModelMock(),
  pageTemplate: createModelMock(),
  page: createModelMock(),
  pageContent: createModelMock(),
  mediaFile: createModelMock(),
  education: createModelMock(),
  volunteer: createModelMock(),
  publication: createModelMock(),
  course: createModelMock(),
  certification: createModelMock(),
};

jest.mock('../../src/utils/prisma', () => mockPrisma);

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = { prisma: mockPrisma, mockRes, createModelMock };
