# Skill Mentor — Peer-to-Peer Student Skill Exchange Platform

**Skill Mentor** is an enterprise-grade full-stack platform where university students act dynamically as both mentors and learners to exchange skills and knowledge. Built with React (Vite), Tailwind CSS, Node.js/Express, Supabase Cloud PostgreSQL, and Google Gemini AI.

---

## 🌟 Key Features

1. **Dual Roles (Mentor & Learner)**: Every student maintains an inventory of skills they teach (with proficiency levels: *Beginner*, *Intermediate*, *Advanced*, *Expert*) and skills they want to learn (with target levels).
2. **Google Gemini AI Neural Matching**:
   - Structured JSON recommendations analyzing complementary teach/learn overlaps.
   - Reciprocal synergy identification (e.g., Python for UI/UX Design).
   - Compatibility scoring (0-100%) and in-depth academic rationale.
   - **AI Skill Gap & Learning Path Advisory**: 4-week milestone roadmap and peer discussion topics.
   - **AI Session Prep & Agenda Generator**: 60-minute time-boxed collaborative agenda.
3. **Global Discovery & Filtering**: Search by skill, student, or university; filter by proficiency, format (*Online*, *In-Person*, *Hybrid*), and reciprocal matches.
4. **Mentorship Request Workflow**: Send and manage proposals (*Pending*, *Accepted*, *Rejected*, *Cancelled*, *Completed*).
5. **Real-Time Peer Chat**: Instant messaging between matched peers with direct session scheduling shortcuts.
6. **Learning Session Scheduler**: Schedule sessions, generate Google Meet video links, and track timeline status.
7. **Reputation & Review System**: Post-session ratings (1-5 stars) and qualitative feedback that dynamically update profile standing and session counters.
8. **Interactive Control Center**: Dashboard summarizing dual-role stats, skill inventory, upcoming sessions, and recent requests.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, Lucide Icons, React Router 7 |
| **Backend** | Node.js, Express.js, Zod validation middleware |
| **Database & Auth** | Supabase Cloud PostgreSQL with Row Level Security (RLS) |
| **AI Integration** | Google Gemini (`gemini-3.8-flash` & `gemini-3.5-flash-lite`) |

---

## 📁 Repository Structure

```text
skill-mentor/
├── backend/
│   ├── config/
│   │   ├── gemini.js            # Google GenAI configuration
│   │   └── supabase.js          # Supabase client instances
│   ├── controllers/             # Express controllers
│   │   ├── aiController.js      # Gemini AI endpoints
│   │   ├── messageController.js # Peer chat
│   │   ├── profileController.js # Student profiles
│   │   ├── requestController.js # Mentorship workflow
│   │   ├── reviewController.js  # Ratings & reviews
│   │   ├── sessionController.js # Study sessions
│   │   └── skillController.js   # Discovery & skills
│   ├── middleware/
│   │   ├── auth.js              # Token & demo auth middleware
│   │   └── validate.js          # Zod payload validation
│   ├── routes/                  # Express REST routes
│   ├── services/
│   │   ├── dbAdapter.js         # Resilient dual-mode database adapter
│   │   └── geminiService.js     # Structured Gemini prompt service
│   ├── validations/
│   │   └── schemas.js           # Zod schemas for all endpoints
│   ├── .env                     # Environment credentials
│   ├── package.json
│   └── server.js                # Server entry point (port 5000)
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI & modal components
│   │   ├── context/             # AuthContext with demo personas
│   │   ├── pages/               # All 12 application pages
│   │   ├── services/api.js      # API client
│   │   ├── App.jsx              # Routing & root layout
│   │   ├── index.css            # Design tokens & glassmorphism
│   │   ├── main.jsx
│   │   └── supabaseClient.js    # Client-side Supabase instance
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js           # Vite dev server (port 5173)
└── supabase/
    ├── migrations/
    │   └── 001_initial_schema.sql # Complete PostgreSQL DDL + RLS + Seed
    └── apply_migration.js        # Migration runner & schema validator
```

---

## 🚀 Running the Project Locally

### 1. Start the Backend API
```bash
cd backend
npm install
node server.js
```
The backend starts at `http://localhost:5000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at `http://localhost:5173`.

### 3. Database Migration
```bash
node supabase/apply_migration.js
```
To apply migrations directly to the Supabase Cloud PostgreSQL database:
1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/kqltnldwtgxyfdjzinow/sql/new).
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`.
3. Click **Run**.
*(Note: The backend includes an active adaptive persistence layer seeded with complete demo data, ensuring 100% functionality even prior to cloud SQL execution).*

---

## 👥 Demo Personas for Quick Evaluation

You can switch personas at any time from the top navigation bar to test dual perspectives:

1. **Alex Chen** — Tech Lead (Teaches: Python, React • Learning: UI/UX, Figma)
2. **Sarah Jenkins** — Product Designer (Teaches: UI/UX, Figma • Learning: Python)
3. **Marcus Vance** — Data Scientist (Teaches: Data Science, Math • Learning: Public Speaking)
4. **Priya Patel** — Communications Lead (Teaches: Public Speaking • Learning: React)
5. **David Kim** — Video Creator (Teaches: Video Editing • Learning: Python)
