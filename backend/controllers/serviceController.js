const ServiceRecord = require('../models/ServiceRecord');
const Vehicle = require('../models/Vehicle');

// Helper: recompute status based on nextDueDate
const computeStatus = (nextDueDate) => {
  if (!nextDueDate) return 'completed';
  const now = new Date();
  const due = new Date(nextDueDate);
  if (due < now) return 'overdue';
  const daysUntilDue = (due - now) / (1000 * 60 * 60 * 24);
  return daysUntilDue <= 14 ? 'upcoming' : 'completed';
};

// @desc    Get all service records for logged-in user (optionally filtered by vehicle)
// @route   GET /api/services?vehicle=<id>
// @access  Private
const getServiceRecords = async (req, res, next) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.vehicle) filter.vehicle = req.query.vehicle;

    const records = await ServiceRecord.find(filter)
      .populate('vehicle', 'make model nickname registrationNumber')
      .sort({ serviceDate: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service record
// @route   GET /api/services/:id
// @access  Private
const getServiceRecordById = async (req, res, next) => {
  try {
    const record = await ServiceRecord.findOne({ _id: req.params.id, owner: req.user._id }).populate(
      'vehicle',
      'make model nickname registrationNumber'
    );
    if (!record) {
      res.status(404);
      throw new Error('Service record not found');
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a service record
// @route   POST /api/services
// @access  Private
const createServiceRecord = async (req, res, next) => {
  try {
    const {
      vehicle,
      serviceType,
      description,
      cost,
      odometerAtService,
      serviceDate,
      nextDueDate,
      nextDueOdometer,
    } = req.body;

    const vehicleDoc = await Vehicle.findOne({ _id: vehicle, owner: req.user._id });
    if (!vehicleDoc) {
      res.status(404);
      throw new Error('Vehicle not found');
    }

    const record = await ServiceRecord.create({
      vehicle,
      owner: req.user._id,
      serviceType,
      description,
      cost,
      odometerAtService,
      serviceDate,
      nextDueDate,
      nextDueOdometer,
      status: computeStatus(nextDueDate),
    });

    // Keep the vehicle's odometer up to date if this service is more recent
    if (odometerAtService && odometerAtService > vehicleDoc.currentOdometer) {
      vehicleDoc.currentOdometer = odometerAtService;
      await vehicleDoc.save();
    }

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service record
// @route   PUT /api/services/:id
// @access  Private
const updateServiceRecord = async (req, res, next) => {
  try {
    const record = await ServiceRecord.findOne({ _id: req.params.id, owner: req.user._id });
    if (!record) {
      res.status(404);
      throw new Error('Service record not found');
    }

    Object.assign(record, req.body);
    record.status = computeStatus(record.nextDueDate);
    const updated = await record.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service record
// @route   DELETE /api/services/:id
// @access  Private
const deleteServiceRecord = async (req, res, next) => {
  try {
    const record = await ServiceRecord.findOne({ _id: req.params.id, owner: req.user._id });
    if (!record) {
      res.status(404);
      throw new Error('Service record not found');
    }
    await record.deleteOne();
    res.json({ message: 'Service record removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
};
