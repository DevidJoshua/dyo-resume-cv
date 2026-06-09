const prisma = require('../utils/prisma');

exports.getPortfolios = async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 10 } = req.query;
    const where = {};
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
        skip,
        take: Number(limit)
      }),
      prisma.portfolio.count({ where })
    ]);

    res.json({ data: portfolios, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({ where: { id: Number(req.params.id) } });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPortfolio = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.create({ data: req.body });
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    await prisma.portfolio.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Portfolio deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
