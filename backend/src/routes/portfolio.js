const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticate } = require('../middleware/auth');

router.get('/', portfolioController.getPortfolios);
router.get('/:id', portfolioController.getPortfolio);
router.post('/', authenticate, portfolioController.createPortfolio);
router.put('/:id', authenticate, portfolioController.updatePortfolio);
router.delete('/:id', authenticate, portfolioController.deletePortfolio);

module.exports = router;
