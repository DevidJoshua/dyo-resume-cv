const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mediaController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', ctrl.getMediaFiles);
router.get('/:id', ctrl.getMediaFile);
router.post('/upload', authenticate, upload.single('file'), ctrl.uploadMedia);
router.put('/:id', authenticate, ctrl.updateMediaFile);
router.delete('/:id', authenticate, ctrl.deleteMediaFile);

module.exports = router;
