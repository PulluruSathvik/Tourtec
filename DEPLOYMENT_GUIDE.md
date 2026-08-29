# 🚀 TOURTEC INDIA - Production Deployment Guide

This guide provides step-by-step instructions to deploy the complete TOURTEC Full-Stack Application (**React Frontend + Node.js API + PostgreSQL Database**).

---

## 📋 Pre-Deployment Health & Audit Status

| Component | Status | Verification Details |
| :--- | :---: | :--- |
| **Frontend Bundle (Vite + React)** | ✅ PASS | 0 Errors, dynamic `API_BASE` support, responsive layout |
| **Backend API (Express.js)** | ✅ PASS | Health check `GET /api/health` ➔ 200 OK |
| **Database (PostgreSQL)** | ✅ PASS | Auto-schema migration, tables (`users`, `user_bookings`) |
| **Google SSO (OAuth 2.0)** | ✅ PASS | Client ID configured, OpenSSH RSA 2048-bit key generation |
| **Deployment Configs** | ✅ PASS | `render.yaml`, `vercel.json`, `Dockerfile`, `docker-compose.yml` |

---

## 🌟 Method 1: Deploy on Render.com (Recommended - 100% Free)

Render allows you to deploy the **Frontend, Backend, and PostgreSQL database** together in 1 click using `render.yaml`.

### Steps:
1. Push your TOURTEC repository to **GitHub** (`git push origin main`).
2. Go to 👉 **[dashboard.render.com](https://dashboard.render.com/)** and sign in.
3. Click **New +** ➔ Select **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect `render.yaml` and create:
   * 🐘 **`tourtec-db`**: Free PostgreSQL Database
   * 🚀 **`tourtec-backend`**: Free Node.js Web Service
   * 🌐 **`tourtec-frontend`**: Free Static React Web App
6. Click **Apply** ➔ Your live website will be up with HTTPS in ~3 minutes!

---

## 🌟 Method 2: Deploy on Vercel + Supabase (Fast & Popular)

### Step A: Deploy PostgreSQL on Supabase / Neon
1. Go to 👉 **[supabase.com](https://supabase.com/)** (or [neon.tech](https://neon.tech/)) and create a free project.
2. Copy your **Database Connection String** (`postgres://postgres.xxxx@aws-0.pooler.supabase.com:6543/postgres`).

### Step B: Deploy Backend on Render or Railway
1. Create a Web Service for `backend/`.
2. Add Environment Variables:
   * `NODE_ENV` = `production`
   * `DATABASE_URL` = `<your_supabase_connection_string>`
3. Copy your deployed backend URL (e.g., `https://tourtec-api.onrender.com`).

### Step C: Deploy Frontend on Vercel
1. Go to 👉 **[vercel.com](https://vercel.com/)** ➔ **Add New Project**.
2. Select your repository.
3. Root Directory: `frontend`
4. Add Environment Variables:
   * `VITE_API_URL` = `https://tourtec-api.onrender.com`
   * `VITE_GOOGLE_CLIENT_ID` = `849997510284-lb00lknh9vfbhrhj2pfhmkiqr9qcdgei.apps.googleusercontent.com`
5. Click **Deploy**!

---

## 🐳 Method 3: Deploy with Docker & Docker Compose

For deploying on AWS EC2, DigitalOcean Droplet, GCP Compute Engine, or Railway:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd TOURTEC

# 2. Build and start containers
docker compose up -d --build

# 3. View logs
docker compose logs -f
```

Your app will be running at **`http://<your-server-ip>:5000`** with PostgreSQL automatically configured on port **`5433`**!

---

## ⚙️ Summary of Environment Variables

| Variable | Required In | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend | PostgreSQL connection string (`postgres://user:pass@host:port/db`) |
| `PORT` | Backend | Server port (Default: `5000`) |
| `VITE_API_URL` | Frontend | Backend API URL (Leave blank for same-domain hosting) |
| `VITE_GOOGLE_CLIENT_ID` | Frontend | Google OAuth Client ID for Single Sign-On |
| `FAST2SMS_API_KEY` | Backend | Fast2SMS Indian Gateway API Key (Optional) |
