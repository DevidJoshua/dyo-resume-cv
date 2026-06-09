const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/templateController');
const { authenticate } = require('../middleware/auth');

router.get('/', ctrl.getTemplates);
router.get('/active', ctrl.getActiveTemplate);
router.get('/:id', ctrl.getTemplate);
router.post('/', authenticate, ctrl.createTemplate);
router.put('/:id', authenticate, ctrl.updateTemplate);
router.put('/:id/activate', authenticate, ctrl.setActiveTemplate);
router.put('/:id/configuration', authenticate, ctrl.saveConfiguration);

module.exports = router;
