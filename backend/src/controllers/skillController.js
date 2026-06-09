const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSkills = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const where = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const skills = await prisma.skill.findMany({
      where,
      orderBy: { displayOrder: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSkill = async (req, res) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: Number(req.params.id) } });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const skill = await prisma.skill.create({ data: req.body });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const skill = await prisma.skill.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
