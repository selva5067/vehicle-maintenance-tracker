const cron = require('node-cron');
const ServiceRecord = require('../models/ServiceRecord');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

const DAYS_BEFORE = Number(process.env.REMINDER_DAYS_BEFORE) || 3;

// Core logic, exported separately so it can also be triggered manually/for testing
const runReminderCheck = async () => {
  const now = new Date();
  const reminderWindow = new Date();
  reminderWindow.setDate(now.getDate() + DAYS_BEFORE);

  // Records due within the reminder window that haven't been reminded yet
  const upcoming = await ServiceRecord.find({
    nextDueDate: { $gte: now, $lte: reminderWindow },
    reminderSent: false,
  }).populate('vehicle');

  // Records that are now overdue
  const overdue = await ServiceRecord.find({
    nextDueDate: { $lt: now },
    status: { $ne: 'overdue' },
  }).populate('vehicle');

  for (const record of upcoming) {
    await createNotificationAndEmail(record, 'reminder');
    record.reminderSent = true;
    record.status = 'upcoming';
    await record.save();
  }

  for (const record of overdue) {
    await createNotificationAndEmail(record, 'overdue');
    record.status = 'overdue';
    await record.save();
  }

  console.log(
    `[reminderJob] Checked at ${now.toISOString()} — ${upcoming.length} upcoming, ${overdue.length} overdue`
  );
};

const createNotificationAndEmail = async (record, type) => {
  const user = await User.findById(record.owner);
  if (!user) return;

  const vehicleLabel = record.vehicle
    ? record.vehicle.nickname || `${record.vehicle.make} ${record.vehicle.model}`
    : 'your vehicle';

  const title = type === 'overdue' ? 'Service overdue' : 'Upcoming service reminder';
  const message =
    type === 'overdue'
      ? `${record.serviceType} for ${vehicleLabel} was due on ${new Date(record.nextDueDate).toDateString()} and is now overdue.`
      : `${record.serviceType} for ${vehicleLabel} is due on ${new Date(record.nextDueDate).toDateString()}.`;

  await Notification.create({
    owner: user._id,
    vehicle: record.vehicle?._id,
    serviceRecord: record._id,
    title,
    message,
    type,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: `${title}: ${vehicleLabel}`,
      html: `<p>Hi ${user.name},</p><p>${message}</p><p>— Vehicle Maintenance Tracker</p>`,
    });
  } catch (err) {
    console.error(`[reminderJob] Failed to send email to ${user.email}:`, err.message);
  }
};

// Schedule: runs once every day at 8:00 AM server time
const scheduleReminderJob = () => {
  cron.schedule('0 8 * * *', () => {
    runReminderCheck().catch((err) => console.error('[reminderJob] Error:', err));
  });
  console.log('[reminderJob] Scheduled to run daily at 08:00');
};

module.exports = { scheduleReminderJob, runReminderCheck };
