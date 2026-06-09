const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { authenticate } = require('../middleware/auth');

router.get('/', socialController.getSocialLinks);
router.post('/', authenticate, socialController.createSocialLink);
router.put('/:id', authenticate, socialController.updateSocialLink);
router.delete('/:id', authenticate, socialController.deleteSocialLink);

module.exports = router;
