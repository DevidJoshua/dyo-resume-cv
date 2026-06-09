const prisma = require('../utils/prisma');

exports.getPortfolios = async (req, res) => {
  try {
    const { categorySlug, featured, page = 1, limit = 10, search } = req.query;
    const where = {};
    if (categorySlug) where.category = { slug: categorySlug };
    if (featured !== undefined) where.isFeatured = featured === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where,
        include: {
          category: true,
          technologies: true,
          featuredImage: true,
          gallery: { include: { mediaFile: true }, orderBy: { displayOrder: 'asc' } }
        },
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
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
        technologies: true,
        featuredImage: true,
        gallery: { include: { mediaFile: true }, orderBy: { displayOrder: 'asc' } }
      }
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPortfolio = async (req, res) => {
  try {
    const { technologies, gallery, ...data } = req.body;
    const portfolio = await prisma.portfolio.create({
      data: {
        ...data,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        featuredImageId: data.featuredImageId ? Number(data.featuredImageId) : null,
        technologies: technologies ? {
          create: technologies.map((t) => ({ technologyName: t }))
        } : undefined,
        gallery: gallery ? {
          create: gallery.map((g, i) => ({ mediaFileId: Number(g), displayOrder: i }))
        } : undefined
      },
      include: { technologies: true, gallery: true, category: true, featuredImage: true }
    });
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const { technologies, gallery, ...data } = req.body;
    const id = Number(req.params.id);

    await prisma.portfolioTechnology.deleteMany({ where: { portfolioId: id } });
    await prisma.portfolioGallery.deleteMany({ where: { portfolioId: id } });

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...data,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        featuredImageId: data.featuredImageId ? Number(data.featuredImageId) : null,
        technologies: technologies ? {
          create: technologies.map((t) => ({ technologyName: t }))
        } : undefined,
        gallery: gallery ? {
          create: gallery.map((g, i) => ({ mediaFileId: Number(g), displayOrder: i }))
        } : undefined
      },
      include: { technologies: true, gallery: true, category: true, featuredImage: true }
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
