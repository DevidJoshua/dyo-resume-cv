const path = require('path');
const fs = require('fs');
const prisma = require('../utils/prisma');

exports.getMediaFiles = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { originalFilename: { contains: search } },
        { altText: { contains: search } }
      ];
    }
    const files = await prisma.mediaFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { uploader: { select: { username: true } } }
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMediaFile = async (req, res) => {
  try {
    const file = await prisma.mediaFile.findUnique({ where: { id: Number(req.params.id) } });
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const file = await prisma.mediaFile.create({
      data: {
        filename: req.file.filename,
        originalFilename: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        altText: req.body.altText || req.file.originalname,
        uploadedById: req.user?.id || null
      }
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMediaFile = async (req, res) => {
  try {
    const file = await prisma.mediaFile.update({
      where: { id: Number(req.params.id) },
      data: { altText: req.body.altText }
    });
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMediaFile = async (req, res) => {
  try {
    const file = await prisma.mediaFile.findUnique({ where: { id: Number(req.params.id) } });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '..', '..', file.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.mediaFile.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
