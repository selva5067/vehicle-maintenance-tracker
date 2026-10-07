require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const ServiceRecord = require('../models/ServiceRecord');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await ServiceRecord.deleteMany({});
    await Notification.deleteMany({});

    console.log('Creating demo user...');
    const user = await User.create({
      name: 'Alex Mercer',
      email: 'alex@example.com',
      password: 'password123',
    });

    console.log('Creating demo vehicles...');
    const v1 = await Vehicle.create({
      owner: user._id,
      nickname: 'Daily Driver',
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      registrationNumber: 'KA-01-MJ-8821',
      fuelType: 'Hybrid',
      currentOdometer: 42500,
      imageColor: '#F2A03D',
    });

    const v2 = await Vehicle.create({
      owner: user._id,
      nickname: 'Weekend Cruiser',
      make: 'BMW',
      model: '3 Series',
      year: 2022,
      registrationNumber: 'KA-05-NB-4492',
      fuelType: 'Petrol',
      currentOdometer: 28100,
      imageColor: '#5B9BD5',
    });

    const v3 = await Vehicle.create({
      owner: user._id,
      nickname: 'City Hatchback',
      make: 'Hyundai',
      model: 'i20',
      year: 2020,
      registrationNumber: 'KA-03-TR-1029',
      fuelType: 'Petrol',
      currentOdometer: 35000,
      imageColor: '#3DDC97',
    });

    console.log('Creating service records...');
    const now = new Date();

    // Month offsets for realistic analytics chart
    const getDateMonthsAgo = (m, d = 15) => {
      const date = new Date(now);
      date.setMonth(date.getMonth() - m);
      date.setDate(d);
      return date;
    };

    const records = [
      // Toyota Camry records
      {
        vehicle: v1._id,
        owner: user._id,
        serviceType: 'Oil Change',
        description: 'Synthetic 0W-20 oil change & filter replace at authorized service center.',
        cost: 3500,
        odometerAtService: 35000,
        serviceDate: getDateMonthsAgo(5),
        nextDueDate: getDateMonthsAgo(-1), // Due in 30 days
        nextDueOdometer: 45000,
        status: 'completed',
      },
      {
        vehicle: v1._id,
        owner: user._id,
        serviceType: 'Tyre Rotation',
        description: 'Front to rear rotation & high-speed wheel balancing.',
        cost: 1800,
        odometerAtService: 40000,
        serviceDate: getDateMonthsAgo(2),
        nextDueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days (Upcoming)
        nextDueOdometer: 45000,
        status: 'upcoming',
      },
      {
        vehicle: v1._id,
        owner: user._id,
        serviceType: 'Brake Service',
        description: 'Front brake pad inspection and fluid flush.',
        cost: 6200,
        odometerAtService: 42500,
        serviceDate: getDateMonthsAgo(1),
        nextDueDate: getDateMonthsAgo(-6),
        status: 'completed',
      },

      // BMW 3 Series records
      {
        vehicle: v2._id,
        owner: user._id,
        serviceType: 'General Checkup',
        description: 'Full vehicle scan, spark plug check, suspension lube.',
        cost: 12500,
        odometerAtService: 22000,
        serviceDate: getDateMonthsAgo(4),
        nextDueDate: getDateMonthsAgo(-2),
        status: 'completed',
      },
      {
        vehicle: v2._id,
        owner: user._id,
        serviceType: 'Air Filter',
        description: 'Engine air filter & cabin pollen filter replacement.',
        cost: 4200,
        odometerAtService: 28100,
        serviceDate: getDateMonthsAgo(3),
        nextDueDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // Overdue by 4 days
        status: 'overdue',
      },

      // Hyundai i20 records
      {
        vehicle: v3._id,
        owner: user._id,
        serviceType: 'Battery Replacement',
        description: 'Replaced OEM battery with Amaron 45Ah battery with 5-year warranty.',
        cost: 5400,
        odometerAtService: 32000,
        serviceDate: getDateMonthsAgo(3),
        nextDueDate: getDateMonthsAgo(-24),
        status: 'completed',
      },
      {
        vehicle: v3._id,
        owner: user._id,
        serviceType: 'Coolant Flush',
        description: 'Radiator drain, flush, and fresh ethylene glycol refill.',
        cost: 2900,
        odometerAtService: 35000,
        serviceDate: getDateMonthsAgo(1),
        nextDueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // Due in 10 days
        status: 'upcoming',
      },
    ];

    for (const r of records) {
      await ServiceRecord.create(r);
    }

    console.log('Creating demo notifications...');
    await Notification.create({
      owner: user._id,
      vehicle: v2._id,
      title: 'Service overdue',
      message: `Air Filter for Weekend Cruiser was due on ${new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toDateString()} and is now overdue.`,
      type: 'overdue',
      isRead: false,
    });

    await Notification.create({
      owner: user._id,
      vehicle: v1._id,
      title: 'Upcoming service reminder',
      message: `Tyre Rotation for Daily Driver is due on ${new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toDateString()}.`,
      type: 'reminder',
      isRead: false,
    });

    console.log('----------------------------------------------------');
    console.log('Seed completed successfully!');
    console.log('Demo Account Credentials:');
    console.log('  Email:    alex@example.com');
    console.log('  Password: password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
