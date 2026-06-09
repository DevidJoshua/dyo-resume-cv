const prisma = require('../utils/prisma');

exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
      prisma.contactMessage.count()
    ]);
    res.json({ data: messages, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const msg = await prisma.contactMessage.create({ data: { name, email, subject, message } });
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
