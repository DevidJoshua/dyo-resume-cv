const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pageController');
const { authenticate } = require('../middleware/auth');

router.get('/templates', ctrl.getPageTemplates);
router.post('/templates', authenticate, ctrl.createPageTemplate);
router.get('/', ctrl.getPages);
router.get('/slug/:slug', ctrl.getPageBySlug);
router.get('/:id', ctrl.getPage);
router.post('/', authenticate, ctrl.createPage);
router.put('/:id', authenticate, ctrl.updatePage);
router.delete('/:id', authenticate, ctrl.deletePage);
router.put('/:id/content', authenticate, ctrl.savePageContent);

module.exports = router;
