# 🚀 PathRecommender — AI-Powered Personalized Learning Path & Skill Verification Platform

<div align="center">

![PathRecommender Banner](https://img.shields.io/badge/Platform-PathRecommender-brightgreen?style=for-the-badge&logo=compass)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)
![AI Engine](https://img.shields.io/badge/AI-Google_Gemini-orange?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An intelligent, adaptive career navigation and skill mastery system that tailors dynamic learning paths, provides actionable mini-curriculums, and verifies proficiency through concept-rich technical assessments.**

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Deployment](#-deployment)

</div>

---

## 🌟 Highlights & Core Principles

PathRecommender is built around a single core principle: **True Personalization**.

Unlike traditional platforms that serve static, hardcoded roadmaps, PathRecommender generates every node, study guide, and assessment dynamically based on the user's authentic:
- **Target Learning Goal** (e.g., *Java Developer*, *Python Backend*, *Machine Learning Engineer*, *Full Stack Web*)
- **Current Skills & Resume Extraction**
- **Verified Assessment Results & Skill Gaps**
- **In-Progress Study Checklists & Hands-On Practice**

---

## ⚡ Key Features

### 1. 🎯 Dynamic Learning Path Engine
- **Single Source of Truth**: Eliminates generic full-stack defaults; target goals strictly determine roadmap curriculum.
- **Adaptive Remediation**: Automatically injects prerequisite remediation nodes if assessment scores fall below 70%.
- **3D Progress Orbit**: Interactive Three.js/WebGL visual representation of roadmap progress and skill milestones.

### 2. 📚 Actionable Module Curriculums ("Open Details & Quiz")
- **Comprehensive Mini-Curriculums**:
  - **Module Overview & Skill Gap Calculation**: Compares Current Level vs. Target Standard (e.g., *Beginner 30% $\to$ Intermediate 65% | 35% Gap*).
  - **Personalized "Why This Module is in Your Path"**: Explains why the node is recommended based on user goals.
  - **Structured Study Checklist**: Interactive checklists with persistent state in MongoDB.
  - **Learning Objectives**: Concrete competency checklists (*"By the end of this module..."*).
  - **Recommended Study Order**: Visual step-by-step learning sequence.
  - **Curated Learning Resources**: Direct links to documentation, interactive playgrounds, video guides, and cheat sheets.
  - **Progressive Practice Tasks**: Hands-on coding challenges (`Easy` $\to$ `Medium` $\to$ `Hard`) with completion toggles.
  - **Live Module Progress Tracking**: Real-time percentage aggregation across topics, practice, and quiz completion.

### 3. 🧠 Technical Assessment Engine (15+ Questions Guarantee)
- **Minimum 15 Questions**: Strict backend validation guarantees at least 15 concept-rich questions per skill/module.
- **Question Rotation & Non-Repetition**: Tracks previously used `questionIds` per user in MongoDB, delivering a fresh question set on every retake.
- **Hybrid Question Sourcing**: Combines deep static question banks (30–50+ questions per module) with on-demand Google Gemini AI question synthesis.
- **Secure Server-Side Grading**: Prevents answer leakage by stripping solutions from client payloads and computing scores server-side.
- **Weighted Skill Calibration Formula**:
  $$\text{finalProficiencyScore} = (\text{declaredScore} \times 0.3) + (\text{assessmentScore} \times 0.7)$$
- **Granular Feedback**: Detailed question-by-question breakdown, explanations, identified strong topics, and targeted areas for improvement.

### 4. 🛡️ Canonical Skill Taxonomy & Validation
- Centralized taxonomy registry prevents gibberish inputs (`"asdfgh"`, `"test123"`) with real-time autocompletion and category normalization.

### 5. 📄 Smart Resume Scanner & Skill Extraction
- Parses uploaded resumes (PDF/Text) to automatically discover existing technical proficiencies, frameworks, and experience levels.

### 6. 💬 Context-Aware AI Career Mentor
- Integrated Gemini AI assistant aware of user goals, skill gaps, and current roadmap progress for real-time coding guidance.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: Modern dark-mode UI with [Tailwind CSS](https://tailwindcss.com/) & Glassmorphism
- **Animations & Effects**: [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **3D Graphics**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing & Networking**: [React Router v6](https://reactrouter.com/), [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose ODM](https://mongoosejs.com/) (with embedded in-memory fallback for local testing)
- **Authentication**: JWT (JSON Web Tokens) with salted [bcrypt](https://www.npmjs.com/package/bcryptjs) password hashing
- **AI Integration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Google Gemini Flash)

---

## 📂 Project Structure

```
PathRecommender/
├── api/
│   └── index.js                      # Vercel Serverless Function entrypoint
├── backend/
│   ├── config/
│   │   ├── db.js                     # MongoDB Atlas connection & memory fallback
│   │   ├── questionBank.js           # Core question bank
│   │   ├── comprehensiveQuestionBank.js # 30-50+ question banks per domain
│   │   └── skillsTaxonomy.js         # Canonical skill registry & categories
│   ├── controllers/
│   │   ├── assessmentController.js   # 15+ Qs generation, grading & retakes
│   │   ├── authController.js         # User registration, login, JWT
│   │   ├── dashboardController.js    # KPIs, stats & verified metrics
│   │   ├── onboardingController.js   # Resume scan & goal setup
│   │   ├── profileController.js      # User skills & proficiency updates
│   │   ├── projectController.js      # Project recommendations
│   │   ├── roadmapController.js      # Learning paths, module guides, quizzes
│   │   └── skillController.js        # Taxonomy validation & autocomplete
│   ├── models/
│   │   ├── Assessment.js
│   │   ├── AssessmentResult.js       # Attempt history, scores, question IDs
│   │   ├── LearningPath.js           # Goal-locked roadmap nodes
│   │   ├── Profile.js                # Verified skills & proficiency
│   │   ├── Project.js
│   │   ├── User.js
│   │   └── UserProgress.js           # Module checklist & task persistence
│   ├── routes/                       # Express route definitions
│   ├── services/
│   │   ├── assessmentService.js      # AI question generator & rotation engine
│   │   ├── moduleDetailsService.js   # Deep mini-curriculums & study guides
│   │   ├── recommendationEngine.js   # Personalized roadmap generator
│   │   ├── resumeParserService.js    # Resume skill extractor
│   │   └── skillValidationService.js # Canonical skill matcher
│   └── server.js                     # Express app setup & middleware
├── frontend/
│   ├── src/
│   │   ├── api/axiosClient.js        # Configured Axios instance (VITE_API_URL / /api)
│   │   ├── components/
│   │   │   ├── 3d/                   # Three.js 3D Progress Orbit
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── SkillAutocompleteInput.jsx # Validated taxonomy selector
│   │   ├── context/AuthContext.jsx   # Global auth state
│   │   ├── pages/
│   │   │   ├── AssessmentPage.jsx    # Skill assessment suite & attempt history
│   │   │   ├── DashboardPage.jsx     # Live KPIs & progress metrics
│   │   │   ├── LearningRoadmapPage.jsx # Interactive path nodes & milestones
│   │   │   ├── ProfilePage.jsx       # Skill manager & level verification
│   │   │   ├── TopicDetailPage.jsx   # Actionable module details & 15-Q quiz
│   │   │   └── ...
│   │   ├── App.jsx                   # React Router route registry
│   │   └── index.css                 # Custom design tokens & utilities
│   ├── vite.config.js                # Vite build config & proxy
│   └── vercel.json                   # Client SPA rewrite rules
├── vercel.json                       # Full-stack Vercel deployment config
├── DEPLOYMENT_GUIDE.md               # Step-by-step production deployment guide
└── package.json                      # Monorepo scripts
```

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: MongoDB Atlas URI (or local MongoDB)
- **Google Gemini API Key**: [Get API Key](https://aistudio.google.com/)

### 2. Clone Repository
```bash
git clone https://github.com/your-username/PathRecommender.git
cd PathRecommender
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Return to root
cd ..
```

### 4. Configure Environment Variables
Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pathRecommender?retryWrites=true&w=majority
JWT_SECRET=your_jwt_super_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

*(Optional)* Create a `.env` file inside the `frontend/` directory for custom backend host:
```env
VITE_API_URL=http://localhost:5000
```

### 5. Run Locally
In separate terminals (or using the root scripts):

```bash
# Start Backend (Port 5000)
npm run dev:backend

# Start Frontend (Port 3000)
npm run dev:frontend
```

Open your browser at `http://localhost:3000`.

---

## 📡 API Reference Overview

| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/roadmap` | Get active personalized learning path | Yes |
| `GET` | `/api/roadmap/topic/:topicId` | Get full actionable module curriculum & quiz | Yes |
| `POST` | `/api/roadmap/topic/:topicId/progress` | Save module study checklist & practice tasks | Yes |
| `POST` | `/api/roadmap/quiz/submit` | Submit module assessment & update progress | Yes |
| `POST` | `/api/roadmap/regenerate` | Rebuild learning path using updated skills | Yes |
| `GET` | `/api/assessments` | Get available technical assessments | Yes |
| `POST` | `/api/assessments/retake` | Generate a fresh, non-repeated 15-question attempt | Yes |
| `POST` | `/api/assessments/:id/submit` | Submit & securely grade assessment | Yes |
| `GET` | `/api/dashboard` | Get calculated KPIs, skill gaps & timeline | Yes |
| `GET` | `/api/skills/validate` | Validate skill against canonical taxonomy | Yes |
| `POST` | `/api/onboarding/resume` | Upload & parse resume for technical skills | Yes |

---

## 🚢 Deployment on Vercel

PathRecommender is configured for **1-click full-stack deployment** on Vercel:

1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." $\to$ "Project"**.
3. Import your `PathRecommender` repository.
4. Add the following **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random secret string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: `production`
5. Click **"Deploy"**.

*For complete details, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).*

---

## 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <b>Built with ❤️ by the PathRecommender Team</b>
</div>
