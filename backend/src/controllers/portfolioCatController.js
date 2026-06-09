const prisma = require('../utils/prisma');

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.portfolioCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { portfolios: true } } }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const cat = await prisma.portfolioCategory.create({ data: req.body });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await prisma.portfolioCategory.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await prisma.portfolioCategory.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
