const mongoose = require('mongoose');
const ServiceRecord = require('../models/ServiceRecord');
const Vehicle = require('../models/Vehicle');

// @desc    Get expense analytics summary for the logged-in user
// @route   GET /api/analytics/summary
// @access  Private
const getSummary = async (req, res, next) => {
  try {
    const ownerId = req.user._id;

    const [totals] = await ServiceRecord.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$cost' },
          totalServices: { $sum: 1 },
          avgCost: { $avg: '$cost' },
        },
      },
    ]);

    const vehicleCount = await Vehicle.countDocuments({ owner: ownerId });
    const overdueCount = await ServiceRecord.countDocuments({ owner: ownerId, status: 'overdue' });
    const upcomingCount = await ServiceRecord.countDocuments({ owner: ownerId, status: 'upcoming' });

    res.json({
      totalSpent: totals?.totalSpent || 0,
      totalServices: totals?.totalServices || 0,
      avgCost: totals?.avgCost || 0,
      vehicleCount,
      overdueCount,
      upcomingCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Monthly expense totals for the last N months (for line/bar chart)
// @route   GET /api/analytics/monthly?months=6
// @access  Private
const getMonthlyExpenses = async (req, res, next) => {
  try {
    const months = Number(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const results = await ServiceRecord.aggregate([
      { $match: { owner: req.user._id, serviceDate: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: '$serviceDate' }, month: { $month: '$serviceDate' } },
          total: { $sum: '$cost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Fill in months with zero spend so the chart has continuous data points
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i);
      const match = results.find((r) => r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1);
      data.push({
        month: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        total: match ? match.total : 0,
        count: match ? match.count : 0,
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Expense breakdown by service type (for pie chart)
// @route   GET /api/analytics/by-type
// @access  Private
const getExpensesByType = async (req, res, next) => {
  try {
    const results = await ServiceRecord.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: '$serviceType',
          total: { $sum: '$cost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(results.map((r) => ({ serviceType: r._id, total: r.total, count: r.count })));
  } catch (error) {
    next(error);
  }
};

// @desc    Expense breakdown by vehicle (for bar chart)
// @route   GET /api/analytics/by-vehicle
// @access  Private
const getExpensesByVehicle = async (req, res, next) => {
  try {
    const results = await ServiceRecord.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: '$vehicle',
          total: { $sum: '$cost' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: '_id',
          as: 'vehicle',
        },
      },
      { $unwind: '$vehicle' },
      { $sort: { total: -1 } },
    ]);

    res.json(
      results.map((r) => ({
        vehicle: r.vehicle.nickname || `${r.vehicle.make} ${r.vehicle.model}`,
        total: r.total,
        count: r.count,
      }))
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getMonthlyExpenses, getExpensesByType, getExpensesByVehicle };
