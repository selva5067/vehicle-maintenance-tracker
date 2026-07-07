const express = require('express');
const {
  getServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getServiceRecords).post(createServiceRecord);
router.route('/:id').get(getServiceRecordById).put(updateServiceRecord).delete(deleteServiceRecord);

module.exports = router;
