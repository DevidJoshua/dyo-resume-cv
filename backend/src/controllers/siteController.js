const prisma = require('../utils/prisma');

exports.getSiteSettings = async (req, res) => {
  try {
    let settings = await prisma.siteSetting.findFirst();
    if (!settings) {
      settings = await prisma.siteSetting.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSiteSettings = async (req, res) => {
  try {
    const data = req.body;
    let settings = await prisma.siteSetting.findFirst();
    if (settings) {
      settings = await prisma.siteSetting.update({ where: { id: settings.id }, data });
    } else {
      settings = await prisma.siteSetting.create({ data });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const [portfolioCount, messageCount, skillCount, recentMessages, activeTemplates] = await Promise.all([
      prisma.portfolio.count(),
      prisma.contactMessage.count(),
      prisma.skill.count(),
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.homepageTemplate.findMany({ where: { isActive: true }, take: 1 })
    ]);
    const activeTemplate = activeTemplates.length > 0 ? activeTemplates[0].name : 'Professional';
    res.json({ portfolioCount, messageCount, skillCount, recentMessages, activeTemplate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
