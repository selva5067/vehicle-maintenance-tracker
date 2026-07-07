const Vehicle = require('../models/Vehicle');
const ServiceRecord = require('../models/ServiceRecord');

// @desc    Get all vehicles for logged-in user
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by id
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      res.status(404);
      throw new Error('Vehicle not found');
    }
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private
const createVehicle = async (req, res, next) => {
  try {
    const { nickname, make, model, year, registrationNumber, fuelType, currentOdometer, imageColor } = req.body;

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      nickname,
      make,
      model,
      year,
      registrationNumber,
      fuelType,
      currentOdometer,
      imageColor,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      res.status(404);
      throw new Error('Vehicle not found');
    }

    Object.assign(vehicle, req.body);
    const updated = await vehicle.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a vehicle (and its service records)
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      res.status(404);
      throw new Error('Vehicle not found');
    }

    await ServiceRecord.deleteMany({ vehicle: vehicle._id });
    await vehicle.deleteOne();

    res.json({ message: 'Vehicle and related service records removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
