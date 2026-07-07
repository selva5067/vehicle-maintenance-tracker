const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nickname: {
      type: String,
      trim: true,
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      trim: true,
      uppercase: true,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Petrol',
    },
    currentOdometer: {
      type: Number,
      default: 0,
    },
    imageColor: {
      // used by the frontend to pick a card accent when no photo is uploaded
      type: String,
      default: '#F2A03D',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
