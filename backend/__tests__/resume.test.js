require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/resumeController');

const mockReq = (params = {}, body = {}) => ({ params, body });

describe('Resume Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const sampleEducation = [{ id: 1, institution: 'MIT', degree: 'BSc', field: 'CS', isActive: true, displayOrder: 1 }];
  const sampleVolunteer = [{ id: 1, organization: 'Red Cross', role: 'Volunteer', isActive: true, displayOrder: 1 }];
  const samplePublications = [{ id: 1, title: 'Research Paper', publisher: 'IEEE', isActive: true, displayOrder: 1 }];
  const sampleCourses = [{ id: 1, name: 'React Course', provider: 'Udemy', isActive: true, displayOrder: 1 }];
  const sampleCertifications = [{ id: 1, name: 'AWS Certified', organization: 'Amazon', isActive: true, displayOrder: 1 }];

  describe('Education CRUD', () => {
    it('getEducation should return all education', async () => {
      prisma.education.findMany.mockResolvedValue(sampleEducation);
      const res = mockRes();
      await controller.getEducation(mockReq(), res);
      expect(res.json).toHaveBeenCalledWith(sampleEducation);
    });

    it('createEducation should create new entry', async () => {
      const newData = { institution: 'Stanford', degree: 'MSc', field: 'AI' };
      prisma.education.create.mockResolvedValue({ id: 2, ...newData });
      const req = mockReq({}, newData);
      const res = mockRes();
      await controller.createEducation(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ institution: 'Stanford' }));
    });

    it('updateEducation should update entry', async () => {
      const update = { degree: 'PhD' };
      prisma.education.update.mockResolvedValue({ id: 1, ...update });
      const req = mockReq({ id: '1' }, update);
      const res = mockRes();
      await controller.updateEducation(req, res);
      expect(prisma.education.update).toHaveBeenCalledWith({ where: { id: 1 }, data: update });
    });

    it('deleteEducation should delete entry', async () => {
      prisma.education.delete.mockResolvedValue(sampleEducation[0]);
      const req = mockReq({ id: '1' });
      const res = mockRes();
      await controller.deleteEducation(req, res);
      expect(prisma.education.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('Volunteer CRUD', () => {
    it('should list volunteer entries', async () => {
      prisma.volunteer.findMany.mockResolvedValue(sampleVolunteer);
      const res = mockRes();
      await controller.getVolunteer(mockReq(), res);
      expect(res.json).toHaveBeenCalledWith(sampleVolunteer);
    });

    it('should create volunteer', async () => {
      prisma.volunteer.create.mockResolvedValue({ id: 2, organization: 'UNICEF', role: 'Mentor' });
      const req = mockReq({}, { organization: 'UNICEF', role: 'Mentor' });
      const res = mockRes();
      await controller.createVolunteer(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Publications CRUD', () => {
    it('should list publications', async () => {
      prisma.publication.findMany.mockResolvedValue(samplePublications);
      const res = mockRes();
      await controller.getPublication(mockReq(), res);
      expect(res.json).toHaveBeenCalledWith(samplePublications);
    });
  });

  describe('Courses CRUD', () => {
    it('should list courses', async () => {
      prisma.course.findMany.mockResolvedValue(sampleCourses);
      const res = mockRes();
      await controller.getCourse(mockReq(), res);
      expect(res.json).toHaveBeenCalledWith(sampleCourses);
    });
  });

  describe('Certifications CRUD', () => {
    it('should list certifications', async () => {
      prisma.certification.findMany.mockResolvedValue(sampleCertifications);
      const res = mockRes();
      await controller.getCertification(mockReq(), res);
      expect(res.json).toHaveBeenCalledWith(sampleCertifications);
    });
  });

  describe('generateCV', () => {
    it('should return compiled CV data with sections', async () => {
      const mockSettings = { resumeLayout: 'modern', siteName: 'Devid', email: 'dev@test.com' };
      const mockHome = { heroTitle: 'Devid', heroSubtitle: 'Developer', aboutText: 'About me', profileImage: '/img.jpg' };

      prisma.siteSetting.findFirst.mockResolvedValue(mockSettings);
      prisma.homeSetting.findFirst.mockResolvedValue(mockHome);
      prisma.education.findMany.mockResolvedValue(sampleEducation);
      prisma.volunteer.findMany.mockResolvedValue(sampleVolunteer);
      prisma.publication.findMany.mockResolvedValue(samplePublications);
      prisma.course.findMany.mockResolvedValue(sampleCourses);
      prisma.certification.findMany.mockResolvedValue(sampleCertifications);
      prisma.skill.findMany.mockResolvedValue([{ id: 1, name: 'React', isActive: true, displayOrder: 1 }]);
      prisma.portfolio.findMany.mockResolvedValue([{ id: 1, title: 'Project', isPublished: true, technologies: [], displayOrder: 1 }]);

      const req = mockReq();
      const res = mockRes();
      await controller.generateCV(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        layout: 'modern',
        data: expect.objectContaining({
          name: 'Devid',
          sections: expect.arrayContaining([
            expect.objectContaining({ type: 'summary' }),
            expect.objectContaining({ type: 'education' }),
            expect.objectContaining({ type: 'skills' }),
          ]),
        }),
      }));
    });

    it('should default to classic layout when not set', async () => {
      prisma.siteSetting.findFirst.mockResolvedValue({});
      prisma.homeSetting.findFirst.mockResolvedValue({ heroTitle: 'Name' });
      prisma.education.findMany.mockResolvedValue([]);
      prisma.volunteer.findMany.mockResolvedValue([]);
      prisma.publication.findMany.mockResolvedValue([]);
      prisma.course.findMany.mockResolvedValue([]);
      prisma.certification.findMany.mockResolvedValue([]);
      prisma.skill.findMany.mockResolvedValue([]);
      prisma.portfolio.findMany.mockResolvedValue([]);

      const req = mockReq();
      const res = mockRes();
      await controller.generateCV(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ layout: 'classic' }));
    });
  });
});
