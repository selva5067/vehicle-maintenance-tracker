const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      trim: true,
      // e.g. Oil Change, Tyre Rotation, Brake Service, General Checkup
    },
    description: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: 0,
    },
    odometerAtService: {
      type: Number,
      default: 0,
    },
    serviceDate: {
      type: Date,
      required: [true, 'Service date is required'],
    },
    nextDueDate: {
      type: Date,
      // when the next occurrence of this service type is expected
    },
    nextDueOdometer: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['completed', 'upcoming', 'overdue'],
      default: 'completed',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

serviceRecordSchema.index({ owner: 1, serviceDate: -1 });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
