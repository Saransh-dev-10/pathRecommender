# PathRecommender Production Deployment Guide (Vercel)

This guide walks you through deploying your **PathRecommender MERN + AI** application to **Vercel** so that anyone on the web can use it.

---

## 📋 Prerequisites Checklist

Before deploying, ensure you have:
1. A **GitHub** account (where your code is pushed).
2. A **Vercel** account ([vercel.com](https://vercel.com)).
3. A **MongoDB Atlas** database connection string (`mongodb+srv://...`).
4. A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/)).
5. A secure **JWT Secret** string (e.g. `pathrecommender_super_secret_jwt_key_2026`).

---

## 🚀 Option 1: Full-Stack Deployment on Vercel (Recommended & Easiest)

Both the Express backend (Serverless) and Vite React frontend are deployed together under a single Vercel domain with zero CORS setup.

### Step 1: Push Your Code to GitHub
Open your terminal in the project root and push your project:
```bash
git add .
git commit -m "Configure project for Vercel deployment"
git push origin main
```

### Step 2: Import Project into Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** $\to$ **"Project"**.
3. Select your **`PathRecommender`** GitHub repository and click **Import**.

### Step 3: Configure Project Settings on Vercel
In the project setup screen:
- **Framework Preset**: `Other` (or `Vite`)
- **Root Directory**: `./` (leave default)

### Step 4: Add Environment Variables
Expand the **"Environment Variables"** section and add the following keys:

| Variable Name | Value / Description |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection URI (`mongodb+srv://...`) |
| `JWT_SECRET` | A secure random secret string (e.g. `jwt_secret_path_recommender_2026`) |
| `GEMINI_API_KEY` | Your Google Gemini AI API key |
| `NODE_ENV` | `production` |

### Step 5: Deploy
Click **"Deploy"**. Vercel will build the frontend bundle, package the Express serverless function, and give you a live production URL (e.g., `https://pathrecommender.vercel.app`).

---

## 🌐 Option 2: Split Deployment (Frontend on Vercel + Backend on Render)

If you prefer running a dedicated long-lived Node.js server (e.g. on Render / Railway):

### Step 1: Deploy Backend on Render ([render.com](https://render.com))
1. Create a **New Web Service** from your GitHub repository.
2. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   - `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `NODE_ENV=production`
4. Deploy and copy your backend URL (e.g., `https://pathrecommender-api.onrender.com`).

### Step 2: Deploy Frontend on Vercel
1. In Vercel, import the repo and set **Root Directory**: `frontend`.
2. Set **Framework Preset**: `Vite`.
3. Add Environment Variable:
   - `VITE_API_URL`: `https://pathrecommender-api.onrender.com`
4. Click **Deploy**.

---

## 🔒 Verification & Post-Deployment Testing

Once deployed, visit your live URL:
1. **Sign Up / Log In**: Create a new account or sign in.
2. **Onboarding / Goal Selection**: Set your target role (e.g. Java Developer, Python Developer).
3. **Dashboard & KPIs**: Verify that the personalized KPIs, Skill Gap %, and Roadmap render.
4. **Interactive Module Details**: Click **"Open Details & Quiz"** on any path node. Check off study topics and practice tasks to verify MongoDB persistence.
5. **Assessment**: Complete a 15-question quiz and verify verified proficiency calibration.
