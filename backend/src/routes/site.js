const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { authenticate } = require('../middleware/auth');

router.get('/', siteController.getSiteSettings);
router.put('/', authenticate, siteController.updateSiteSettings);
router.get('/dashboard', authenticate, siteController.getDashboard);

module.exports = router;
