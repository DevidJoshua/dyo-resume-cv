require('./helpers/prisma');
const { prisma, mockRes } = require('./helpers/prisma');
const controller = require('../src/controllers/skillController');

const mockReq = (params = {}, body = {}, query = {}) => ({ params, body, query });

describe('Skills Controller', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const sampleSkills = [
    { id: 1, name: 'React', category: 'Frontend', proficiency: 90, displayOrder: 1, isActive: true },
    { id: 2, name: 'Node.js', category: 'Backend', proficiency: 85, displayOrder: 2, isActive: true },
  ];

  describe('getSkills', () => {
    it('should return all skills ordered by displayOrder', async () => {
      prisma.skill.findMany.mockResolvedValue(sampleSkills);
      const req = mockReq({}, {}, {});
      const res = mockRes();

      await controller.getSkills(req, res);

      expect(prisma.skill.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { displayOrder: 'asc' },
      });
      expect(res.json).toHaveBeenCalledWith(sampleSkills);
    });

    it('should filter by category when provided', async () => {
      prisma.skill.findMany.mockResolvedValue([sampleSkills[0]]);
      const req = mockReq({}, {}, { category: 'Frontend' });
      const res = mockRes();

      await controller.getSkills(req, res);

      expect(prisma.skill.findMany).toHaveBeenCalledWith({
        where: { category: 'Frontend' },
        orderBy: { displayOrder: 'asc' },
      });
    });

    it('should filter by isActive when provided', async () => {
      prisma.skill.findMany.mockResolvedValue([sampleSkills[0]]);
      const req = mockReq({}, {}, { isActive: 'true' });
      const res = mockRes();

      await controller.getSkills(req, res);

      expect(prisma.skill.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      });
    });
  });

  describe('getSkill', () => {
    it('should return skill by id', async () => {
      prisma.skill.findUnique.mockResolvedValue(sampleSkills[0]);
      const req = mockReq({ id: '1' });
      const res = mockRes();

      await controller.getSkill(req, res);

      expect(res.json).toHaveBeenCalledWith(sampleSkills[0]);
    });

    it('should return 404 if not found', async () => {
      prisma.skill.findUnique.mockResolvedValue(null);
      const req = mockReq({ id: '999' });
      const res = mockRes();

      await controller.getSkill(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createSkill', () => {
    it('should create and return a new skill', async () => {
      const newSkill = { name: 'TypeScript', proficiency: 80, displayOrder: 3 };
      prisma.skill.create.mockResolvedValue({ id: 3, ...newSkill });
      const req = mockReq({}, newSkill);
      const res = mockRes();

      await controller.createSkill(req, res);

      expect(prisma.skill.create).toHaveBeenCalledWith({ data: newSkill });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateSkill', () => {
    it('should update and return the skill', async () => {
      const update = { proficiency: 95 };
      prisma.skill.update.mockResolvedValue({ ...sampleSkills[0], ...update });
      const req = mockReq({ id: '1' }, update);
      const res = mockRes();

      await controller.updateSkill(req, res);

      expect(prisma.skill.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: update,
      });
    });
  });

  describe('deleteSkill', () => {
    it('should delete and return confirmation', async () => {
      prisma.skill.delete.mockResolvedValue(sampleSkills[0]);
      const req = mockReq({ id: '1' });
      const res = mockRes();

      await controller.deleteSkill(req, res);

      expect(prisma.skill.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Skill deleted' });
    });
  });
});
