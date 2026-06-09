const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { authenticate } = require('../middleware/auth');

router.get('/', homeController.getHomeSettings);
router.put('/', authenticate, homeController.updateHomeSettings);

module.exports = router;
