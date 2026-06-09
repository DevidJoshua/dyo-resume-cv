const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSocialLinks = async (req, res) => {
  try {
    const links = await prisma.socialLink.findMany({ orderBy: { platform: 'asc' } });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSocialLink = async (req, res) => {
  try {
    const link = await prisma.socialLink.create({ data: req.body });
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSocialLink = async (req, res) => {
  try {
    const link = await prisma.socialLink.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSocialLink = async (req, res) => {
  try {
    await prisma.socialLink.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Social link deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
