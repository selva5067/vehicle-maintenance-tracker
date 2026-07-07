require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { scheduleReminderJob, runReminderCheck } = require('./jobs/reminderJob');

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Manual trigger for testing the reminder job without waiting for the cron schedule
app.post('/api/dev/run-reminder-check', async (req, res, next) => {
  try {
    await runReminderCheck();
    res.json({ message: 'Reminder check completed' });
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  scheduleReminderJob();
});
