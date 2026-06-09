const prisma = require('../utils/prisma');

const MODELS = {
  education: prisma.education,
  volunteer: prisma.volunteer,
  publication: prisma.publication,
  course: prisma.course,
  certification: prisma.certification,
};

const listAll = (model) => async (req, res) => {
  try {
    const items = await model.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOne = (model) => async (req, res) => {
  try {
    const item = await model.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOne = (model) => async (req, res) => {
  try {
    const item = await model.create({ data: req.body });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOne = (model) => async (req, res) => {
  try {
    const item = await model.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOne = (model) => async (req, res) => {
  try {
    await model.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEducation = listAll(MODELS.education);
exports.getEducationById = getOne(MODELS.education);
exports.createEducation = createOne(MODELS.education);
exports.updateEducation = updateOne(MODELS.education);
exports.deleteEducation = deleteOne(MODELS.education);

exports.getVolunteer = listAll(MODELS.volunteer);
exports.getVolunteerById = getOne(MODELS.volunteer);
exports.createVolunteer = createOne(MODELS.volunteer);
exports.updateVolunteer = updateOne(MODELS.volunteer);
exports.deleteVolunteer = deleteOne(MODELS.volunteer);

exports.getPublication = listAll(MODELS.publication);
exports.getPublicationById = getOne(MODELS.publication);
exports.createPublication = createOne(MODELS.publication);
exports.updatePublication = updateOne(MODELS.publication);
exports.deletePublication = deleteOne(MODELS.publication);

exports.getCourse = listAll(MODELS.course);
exports.getCourseById = getOne(MODELS.course);
exports.createCourse = createOne(MODELS.course);
exports.updateCourse = updateOne(MODELS.course);
exports.deleteCourse = deleteOne(MODELS.course);

exports.getCertification = listAll(MODELS.certification);
exports.getCertificationById = getOne(MODELS.certification);
exports.createCertification = createOne(MODELS.certification);
exports.updateCertification = updateOne(MODELS.certification);
exports.deleteCertification = deleteOne(MODELS.certification);

exports.generateCV = async (req, res) => {
  try {
    const [settings, education, volunteer, publications, courses, certifications, skills, portfolios] = await Promise.all([
      prisma.siteSetting.findFirst(),
      prisma.education.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.volunteer.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.publication.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.course.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.certification.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.skill.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.portfolio.findMany({ where: { isPublished: true }, include: { technologies: true }, orderBy: { displayOrder: 'asc' } }),
    ]);

    const home = await prisma.homeSetting.findFirst();

    const layout = settings?.resumeLayout || 'classic';

    const sections = [];
    if (home?.aboutText) sections.push({ type: 'summary', title: 'Summary', content: home.aboutText });
    if (education.length) sections.push({ type: 'education', title: 'Education', items: education });
    if (skills.length) sections.push({ type: 'skills', title: 'Skills', items: skills });
    if (portfolios.length) sections.push({ type: 'portfolio', title: 'Projects', items: portfolios });
    if (volunteer.length) sections.push({ type: 'volunteer', title: 'Volunteer', items: volunteer });
    if (publications.length) sections.push({ type: 'publication', title: 'Publications', items: publications });
    if (courses.length) sections.push({ type: 'course', title: 'Courses', items: courses });
    if (certifications.length) sections.push({ type: 'certification', title: 'Certifications', items: certifications });

    const cvData = {
      name: home?.heroTitle || settings?.siteName || 'Name',
      role: home?.heroSubtitle || '',
      email: settings?.email || '',
      phone: settings?.phone || '',
      linkedin: settings?.linkedinUrl || '',
      github: settings?.githubUrl || '',
      website: settings?.siteName || '',
      photo: home?.profileImage || '',
      sections,
    };

    res.json({ layout, data: cvData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
