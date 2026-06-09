require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/mediaController');

const mockReq = (params = {}, body = {}, query = {}, file = null, user = null) => ({ params, body, query, file, user });

describe('Media Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const sampleFiles = [
    { id: 1, filename: 'img1.jpg', originalFilename: 'photo.jpg', filePath: '/uploads/img1.jpg', fileSize: 1024, mimeType: 'image/jpeg' },
  ];

  describe('getMediaFiles', () => {
    it('should return all media files', async () => {
      prisma.mediaFile.findMany.mockResolvedValue(sampleFiles);
      const res = mockRes();
      await controller.getMediaFiles(mockReq({}, {}, {}), res);
      expect(prisma.mediaFile.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
        include: { uploader: { select: { username: true } } },
      });
      expect(res.json).toHaveBeenCalledWith(sampleFiles);
    });
  });

  describe('uploadMedia', () => {
    it('should return 400 if no file provided', async () => {
      const req = mockReq();
      const res = mockRes();
      await controller.uploadMedia(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should upload and create media record', async () => {
      const file = { filename: 'new.jpg', originalname: 'upload.jpg', size: 2048, mimetype: 'image/jpeg' };
      prisma.mediaFile.create.mockResolvedValue({ id: 2, filename: 'new.jpg', originalFilename: 'upload.jpg', filePath: '/uploads/new.jpg', fileSize: 2048, mimeType: 'image/jpeg' });

      const req = mockReq({}, {}, {}, file, { id: 1 });
      const res = mockRes();
      await controller.uploadMedia(req, res);

      expect(prisma.mediaFile.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          filename: 'new.jpg',
          originalFilename: 'upload.jpg',
          uploadedById: 1,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateMediaFile', () => {
    it('should update media file altText', async () => {
      prisma.mediaFile.update.mockResolvedValue({ id: 1, altText: 'New alt text' });
      const req = mockReq({ id: '1' }, { altText: 'New alt text' });
      const res = mockRes();
      await controller.updateMediaFile(req, res);
      expect(prisma.mediaFile.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { altText: 'New alt text' },
      });
    });
  });

  describe('deleteMediaFile', () => {
    it('should delete a media file', async () => {
      prisma.mediaFile.findUnique.mockResolvedValue(sampleFiles[0]);
      prisma.mediaFile.delete.mockResolvedValue(sampleFiles[0]);
      const req = mockReq({ id: '1' });
      const res = mockRes();
      await controller.deleteMediaFile(req, res);
      expect(prisma.mediaFile.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: 'File deleted' });
    });

    it('should return 404 if file not found', async () => {
      prisma.mediaFile.findUnique.mockResolvedValue(null);
      const req = mockReq({ id: '999' });
      const res = mockRes();
      await controller.deleteMediaFile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
