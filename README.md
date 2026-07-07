# Vehicle Maintenance Tracker

A full-stack MERN application to register vehicles, log service records, get in-app + email reminders for upcoming maintenance, and visualize spending through an analytics dashboard.

**Stack:** React 18 + Vite + Material UI (frontend) · Node.js + Express.js (backend) · MongoDB + Mongoose (database) · JWT auth · Nodemailer + node-cron (reminders)

---

## Features

- **Auth**: Register/login with JWT, bcrypt-hashed passwords
- **Vehicles**: Full CRUD — make, model, year, registration, fuel type, odometer
- **Service records**: Full CRUD — service type, cost, odometer, date, next due date/odometer, auto status (`completed` / `upcoming` / `overdue`)
- **Reminders**: A daily cron job (`node-cron`) scans for services due soon or overdue, creates an in-app notification, and sends an email via Nodemailer
- **Analytics dashboard**: Total spend, monthly spend trend (line chart), spend by service type (pie chart), spend by vehicle (bar chart) — built with Recharts
- **Design**: Custom dark "garage dashboard" theme with a signature circular gauge component showing days until next service

---

## Project Structure

```
vehicle-maintenance-tracker/
├── backend/
│   ├── config/db.js
│   ├── models/          # User, Vehicle, ServiceRecord, Notification
│   ├── controllers/     # business logic per resource
│   ├── routes/          # Express routers
│   ├── middleware/      # auth (JWT), error handler
│   ├── utils/           # generateToken, sendEmail
│   ├── jobs/reminderJob.js   # node-cron daily reminder check
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js         # axios instance + auth interceptor
    │   ├── context/AuthContext.jsx
    │   ├── theme/theme.js       # custom MUI dark theme
    │   ├── components/          # Navbar, VehicleCard, ServiceGauge, forms...
    │   └── pages/                # Login, Register, Dashboard, Vehicles, VehicleDetail, Services, Analytics
    └── .env.example
```

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, and EMAIL_USER/EMAIL_PASS if you want email reminders
npm run dev
```

Backend runs on `http://localhost:5000` by default.

**Note on email:** if you don't configure `EMAIL_USER`/`EMAIL_PASS`, the app still works — it just logs a warning and skips sending the email, while still creating the in-app notification. For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) rather than your regular password (requires 2FA enabled on the Google account).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

### 3. Try it out

1. Register an account
2. Add a vehicle
3. Log a service record with a "Next Due Date" a few days out
4. Visit the Analytics page to see the charts populate
5. To test reminders without waiting for the daily cron (8:00 AM), hit the backend directly:
   ```bash
   curl -X POST http://localhost:5000/api/dev/run-reminder-check
   ```
   This checks for due/overdue services immediately and creates notifications + sends emails.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |
| GET/POST | `/api/vehicles` | List / create vehicles |
| GET/PUT/DELETE | `/api/vehicles/:id` | Read / update / delete a vehicle |
| GET/POST | `/api/services` | List (optionally `?vehicle=<id>`) / create service records |
| GET/PUT/DELETE | `/api/services/:id` | Read / update / delete a service record |
| GET | `/api/analytics/summary` | Totals: spend, vehicle count, upcoming/overdue counts |
| GET | `/api/analytics/monthly?months=6` | Monthly spend series |
| GET | `/api/analytics/by-type` | Spend grouped by service type |
| GET | `/api/analytics/by-vehicle` | Spend grouped by vehicle |
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id/read` | Mark one as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

All routes except `/auth/register` and `/auth/login` require an `Authorization: Bearer <token>` header.

---

## Notes for presenting this project

- Auth uses JWT + bcrypt — a common viva question is "walk me through the login flow," which maps directly to `authController.js` + `middleware/auth.js`.
- The reminder system demonstrates a real background job (`node-cron`) independent of any user request — good to highlight as a differentiator from a plain CRUD app.
- The analytics endpoints use MongoDB aggregation pipelines (`$group`, `$lookup`) — worth explaining if asked about "data visualization" in the backend.
