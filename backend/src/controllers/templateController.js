const prisma = require('../utils/prisma');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await prisma.homepageTemplate.findMany({ orderBy: { name: 'asc' } });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const template = await prisma.homepageTemplate.findUnique({
      where: { id: Number(req.params.id) },
      include: { configurations: true }
    });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const template = await prisma.homepageTemplate.create({ data: req.body });
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const template = await prisma.homepageTemplate.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setActiveTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.homepageTemplate.updateMany({ where: { isActive: true }, data: { isActive: false } });
    await prisma.homepageTemplate.update({ where: { id: Number(id) }, data: { isActive: true } });
    res.json({ message: 'Active template updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveTemplate = async (req, res) => {
  try {
    const template = await prisma.homepageTemplate.findFirst({
      where: { isActive: true },
      include: { configurations: true }
    });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const { configurationJson } = req.body;
    let config = await prisma.homepageConfiguration.findFirst({
      where: { homepageTemplateId: Number(id) }
    });
    if (config) {
      config = await prisma.homepageConfiguration.update({
        where: { id: config.id },
        data: { configurationJson }
      });
    } else {
      config = await prisma.homepageConfiguration.create({
        data: { homepageTemplateId: Number(id), configurationJson }
      });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
