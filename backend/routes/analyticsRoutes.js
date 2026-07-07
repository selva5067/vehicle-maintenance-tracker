const express = require('express');
const {
  getSummary,
  getMonthlyExpenses,
  getExpensesByType,
  getExpensesByVehicle,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyExpenses);
router.get('/by-type', getExpensesByType);
router.get('/by-vehicle', getExpensesByVehicle);

module.exports = router;
