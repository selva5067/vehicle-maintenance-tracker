const express = require('express');
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getVehicles).post(createVehicle);
router.route('/:id').get(getVehicleById).put(updateVehicle).delete(deleteVehicle);

module.exports = router;
