const express = require('express');
const router = express.Router();
const controller = require('../controllers/resumeController');
const { authenticate } = require('../middleware/auth');

router.get('/cv/generate', controller.generateCV);

router.get('/education', controller.getEducation);
router.get('/education/:id', controller.getEducationById);
router.post('/education', authenticate, controller.createEducation);
router.put('/education/:id', authenticate, controller.updateEducation);
router.delete('/education/:id', authenticate, controller.deleteEducation);

router.get('/volunteer', controller.getVolunteer);
router.get('/volunteer/:id', controller.getVolunteerById);
router.post('/volunteer', authenticate, controller.createVolunteer);
router.put('/volunteer/:id', authenticate, controller.updateVolunteer);
router.delete('/volunteer/:id', authenticate, controller.deleteVolunteer);

router.get('/publications', controller.getPublication);
router.get('/publications/:id', controller.getPublicationById);
router.post('/publications', authenticate, controller.createPublication);
router.put('/publications/:id', authenticate, controller.updatePublication);
router.delete('/publications/:id', authenticate, controller.deletePublication);

router.get('/courses', controller.getCourse);
router.get('/courses/:id', controller.getCourseById);
router.post('/courses', authenticate, controller.createCourse);
router.put('/courses/:id', authenticate, controller.updateCourse);
router.delete('/courses/:id', authenticate, controller.deleteCourse);

router.get('/certifications', controller.getCertification);
router.get('/certifications/:id', controller.getCertificationById);
router.post('/certifications', authenticate, controller.createCertification);
router.put('/certifications/:id', authenticate, controller.updateCertification);
router.delete('/certifications/:id', authenticate, controller.deleteCertification);

module.exports = router;
