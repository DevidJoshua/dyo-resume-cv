const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, contactController.getMessages);
router.post('/', contactController.createMessage);
router.delete('/:id', authenticate, contactController.deleteMessage);

module.exports = router;
