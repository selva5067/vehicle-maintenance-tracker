# Vehicle Maintenance Tracker — Deployment Guide

This project is fully configured for **Single Full-Stack Web Service Deployment**, where the Express backend handles API requests while serving the compiled React Vite frontend build as static assets under a single domain.

---

## 🎯 Option 1: Render Deployment (Recommended — Blueprint Ready)

We have created a `render.yaml` blueprint file in the root directory for 1-click deployment on Render.

### Step-by-Step Instructions:

1. **Push your project to GitHub**:
   ```bash
   git add .
   git commit -m "Configure full-stack single service deployment"
   git push origin main
   ```

2. **Log into Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** -> **Blueprint**.

3. **Connect Repository**:
   - Select your GitHub repository.
   - Render will automatically detect `render.yaml` and populate all configuration settings.

4. **Environment Variables Configured Automatically**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or assigned port)
   - `MONGO_URI`: `mongodb://usersp:5067@ac-bygzsww-shard-00-00.bjv4pyh.mongodb.net:27017,...`
   - `JWT_SECRET`: Pre-generated secret
   - `JWT_EXPIRES_IN`: `7d`
   - `REMINDER_DAYS_BEFORE`: `3`

5. **Deploy**:
   - Click **Apply**. Render will run `npm run build` and `npm start` automatically.
   - Your full-stack MERN application will be live at `https://vehicle-maintenance-tracker.onrender.com`!

---

## 🚀 Option 2: Railway Deployment

1. **Log into Railway**:
   - Go to [railway.app](https://railway.app/).
2. **New Project**:
   - Click **New Project** -> **Deploy from GitHub Repo**.
   - Select your repository.
3. **Set Environment Variables**:
   - In the **Variables** tab, add:
     - `NODE_ENV` = `production`
     - `PORT` = `5000`
     - `MONGO_URI` = `mongodb://usersp:5067@ac-bygzsww-shard-00-00.bjv4pyh.mongodb.net:27017,ac-bygzsww-shard-00-01.bjv4pyh.mongodb.net:27017,ac-bygzsww-shard-00-02.bjv4pyh.mongodb.net:27017/vehicle_maintenance_tracker?ssl=true&replicaSet=atlas-c6f53o-shard-0&authSource=admin&appName=Cluster0`
     - `JWT_SECRET` = `f41830ded5db40eeeaacdfa026f10ffeed27e5ce5f0a05600daf1eb663532b15`
     - `JWT_EXPIRES_IN` = `7d`
4. **Deploy**:
   - Railway will execute `npm run build` followed by `npm start`.

---

## 🌐 Option 3: Separated Deployment (Vercel Frontend + Render Backend)

If you prefer deploying the frontend separately on Vercel:

### Backend (Render Web Service):
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: Add `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (set to your Vercel URL).

### Frontend (Vercel):
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Environment Variables**: Set `VITE_API_URL` to `https://your-backend-service.onrender.com/api`.

---

## 🔍 Verifying Production Build Locally Before Push

You can test the single full-stack production build locally before pushing:

```bash
# 1. Build frontend bundle
npm run build

# 2. Run backend in production mode
cd backend
$env:NODE_ENV="production"; node server.js   # PowerShell
# or
NODE_ENV=production node server.js           # Bash / Mac / Linux

# 3. Open http://localhost:5000 in your browser
```
