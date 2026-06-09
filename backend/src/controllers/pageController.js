const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getPages = async (req, res) => {
  try {
    const { isPublished } = req.query;
    const where = {};
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';

    const pages = await prisma.page.findMany({
      where,
      include: { template: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: Number(req.params.id) },
      include: { template: true, contents: true }
    });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug, isPublished: true },
      include: { template: true, contents: true }
    });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPage = async (req, res) => {
  try {
    const { title, slug, templateId, seoTitle, seoDescription, isPublished } = req.body;
    const page = await prisma.page.create({
      data: { title, slug, templateId: Number(templateId), seoTitle, seoDescription, isPublished }
    });
    await prisma.pageContent.create({
      data: { pageId: page.id, contentJson: '{}' }
    });
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const page = await prisma.page.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    await prisma.page.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.savePageContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { contentJson } = req.body;
    let content = await prisma.pageContent.findFirst({ where: { pageId: Number(id) } });
    if (content) {
      content = await prisma.pageContent.update({ where: { id: content.id }, data: { contentJson } });
    } else {
      content = await prisma.pageContent.create({ data: { pageId: Number(id), contentJson } });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPageTemplates = async (req, res) => {
  try {
    const templates = await prisma.pageTemplate.findMany({ orderBy: { name: 'asc' } });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPageTemplate = async (req, res) => {
  try {
    const tmpl = await prisma.pageTemplate.create({ data: req.body });
    res.status(201).json(tmpl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
