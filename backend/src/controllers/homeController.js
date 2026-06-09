const prisma = require('../utils/prisma');

exports.getHomeSettings = async (req, res) => {
  try {
    let settings = await prisma.homeSetting.findFirst();
    if (!settings) {
      settings = await prisma.homeSetting.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHomeSettings = async (req, res) => {
  try {
    const data = req.body;
    let settings = await prisma.homeSetting.findFirst();
    if (settings) {
      settings = await prisma.homeSetting.update({ where: { id: settings.id }, data });
    } else {
      settings = await prisma.homeSetting.create({ data });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
