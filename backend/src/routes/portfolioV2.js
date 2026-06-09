const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/portfolioV2Controller');
const catCtrl = require('../controllers/portfolioCatController');
const { authenticate } = require('../middleware/auth');

router.get('/categories', catCtrl.getCategories);
router.post('/categories', authenticate, catCtrl.createCategory);
router.put('/categories/:id', authenticate, catCtrl.updateCategory);
router.delete('/categories/:id', authenticate, catCtrl.deleteCategory);

router.get('/', ctrl.getPortfolios);
router.get('/:id', ctrl.getPortfolio);
router.post('/', authenticate, ctrl.createPortfolio);
router.put('/:id', authenticate, ctrl.updatePortfolio);
router.delete('/:id', authenticate, ctrl.deletePortfolio);

module.exports = router;
