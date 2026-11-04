# Jobify 2.0

Jobify 2.0 is a full-stack, AI-augmented recruitment platform built with **React**, **FastAPI**, and **MongoDB**. It transforms traditional recruitment from a basic listing-and-apply system into a smarter, collaborative, and candidate-friendly hiring platform.

---

## Overview

### Problem Statement

Traditional recruitment platforms, including the current version of Jobify, rely on basic keyword matching, which often filters out qualified candidates simply because their resume wording doesn't exactly match a job posting. This makes the hiring process slow and frustrating for recruiters, who spend a large chunk of their time manually screening resumes, and equally frustrating for candidates, who have no real way to demonstrate their skills beyond a static resume or track where their application stands in the process.

### Target Audience

- **Recruiters & HR Teams**: Small-to-mid-sized organizations and campus placement cells who lack access to proper hiring tools.
- **Hiring Managers & Interview Panels**: Teams who need to evaluate candidates collaboratively.
- **Job Seekers**: Early-career candidates underserved by rigid, keyword-based screening.

### Key Pain Points

- **Keyword Matching Limitations**: Overlooks genuinely qualified candidates due to wording mismatches.
- **Manual Screening Overhead**: Recruiters spend excessive time manually screening resumes instead of focusing on strong candidates.
- **Lack of Collaboration**: No shared pipeline, scoring, or feedback between team members.
- **Limited Candidate Expression**: Candidates have no way to prove real-world skill beyond a resume and get little visibility into application status.

### Proposed Solution

Jobify 2.0 upgrades the platform into a smarter, more collaborative hiring system:

- **Contextual Job Matching**: Understands skills and experience contextually rather than relying on exact keyword matching.
- **Multi-Stage Collaborative Pipeline**: Enables recruiters and teams to review and score candidates together.
- **AI-Assisted Screening**: Summarizes candidate responses for quicker evaluation.
- **Verified Skill Showcase**: Lets candidates demonstrate skills through linked portfolios or micro-tasks.

### Nature of Output

A full-stack, AI-augmented web application that transforms Jobify from a basic listing-and-apply system into a smarter, collaborative, and candidate-friendly recruitment platform.

---

## Project Architecture

```
Jobify/
├── backend/            # FastAPI backend application
│   ├── app/            # Application source code
│   │   ├── __init__.py
│   │   └── main.py     # FastAPI app entry point & MongoDB connection
│   ├── .env            # Environment configuration
│   └── requirements.txt
├── frontend/           # React + Vite frontend application
│   ├── src/            # Frontend React components & styles
│   ├── public/         # Static assets
│   ├── package.json    # Node dependencies and scripts
│   └── vite.config.js  # Vite configuration
└── README.md
```

---

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS v4, Axios
- **Backend**: Python 3, FastAPI, Uvicorn, Motor (Async MongoDB Driver), `python-dotenv`
- **Database**: MongoDB Atlas / MongoDB

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python](https://www.python.org/) (v3.10+ recommended)
- MongoDB Connection String (e.g. MongoDB Atlas)

---

### 1. Backend Setup

1. Navigate to the `backend` directory:

   ```powershell
   cd backend
   ```

2. Install required Python packages:

   ```powershell
   pip install -r requirements.txt
   ```

   Dependencies: `fastapi`, `uvicorn[standard]`, `motor`, `dnspython`, `pydantic[email]`, `pydantic-settings`, `pyjwt`, `passlib[bcrypt]`, `python-multipart`, `python-dotenv`

3. Configure `.env` file in the `backend` directory:
   A `.env` file already exists with MongoDB Atlas credentials. Edit it if you need a different cluster or database:

   **Option A — MongoDB Atlas (cloud):**
   ```env
   MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Jobify
   DATABASE_NAME=jobify
   ```

   **Option B — Local MongoDB:**
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=jobify
   ```

   Other settings:
   ```env
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

   > **Note:** The backend will start even if MongoDB is unreachable. DB-dependent endpoints will return errors until a valid MongoDB connection is configured. Use `GET /db-check` to verify connectivity.

4. Start the FastAPI backend server:
   ```powershell
   uvicorn app.main:app --reload
   ```
   The backend will be running at `http://127.0.0.1:8000`. You can access interactive API docs at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173/`.

---

## Available Scripts

### Frontend (`/frontend`)

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the production bundle.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs `oxlint` code linter.

---

## API Endpoints

All API v1 routes are mounted under the `/api/v1` prefix.

| Method   | Endpoint                              | Description                                    | Auth         |
| -------- | ------------------------------------- | ---------------------------------------------- | ------------ |
| `GET`    | `/health`                             | Health check endpoint                          | Public       |
| `GET`    | `/db-check`                           | Verifies connection to MongoDB                 | Public       |
| `POST`   | `/api/v1/auth/register`               | Register a new user (job_seeker or employer)   | Public       |
| `POST`   | `/api/v1/auth/login`                  | Login (form data / OAuth2)                     | Public       |
| `POST`   | `/api/v1/auth/json-login`             | Login (JSON body)                              | Public       |
| `GET`    | `/api/v1/auth/me`                     | Get current user profile                       | Bearer       |
| `PUT`    | `/api/v1/auth/profile`                | Update current user profile                    | Bearer       |
| `GET`    | `/api/v1/jobs`                        | List jobs (search/filter/paginate)             | Public       |
| `GET`    | `/api/v1/jobs/my/postings`            | Get current employer's job postings            | Bearer       |
| `GET`    | `/api/v1/jobs/{job_id}`               | Get job detail                                 | Public       |
| `POST`   | `/api/v1/jobs`                        | Create a job posting                           | Bearer       |
| `PUT`    | `/api/v1/jobs/{job_id}`               | Update a job posting (status, details, etc.)   | Bearer       |
| `DELETE` | `/api/v1/jobs/{job_id}`               | Delete a job posting                           | Bearer       |
| `POST`   | `/api/v1/applications`                | Apply to a job (seeker)                        | Bearer       |
| `GET`    | `/api/v1/applications/my`             | Get current user's applications                | Bearer       |
| `DELETE` | `/api/v1/applications/{app_id}`       | Withdraw an application                        | Bearer       |
| `PATCH`  | `/api/v1/applications/{app_id}/status`| Update application status (employer)           | Bearer       |
| `GET`    | `/api/v1/applications/job/{job_id}`   | Get applications for a job (employer)          | Bearer       |
| `GET`    | `/api/v1/saved-jobs`                  | Get current user's saved jobs                  | Bearer       |
| `POST`   | `/api/v1/saved-jobs/{job_id}`         | Save a job to bookmarks                        | Bearer       |
| `DELETE` | `/api/v1/saved-jobs/{job_id}`         | Remove a job from bookmarks                    | Bearer       |

Interactive API docs: `http://127.0.0.1:8000/docs`

---

## Frontend → Backend Connection

The React frontend connects to the FastAPI backend through an Axios service layer:

### Frontend Environment (`frontend/.env`)
```env
VITE_API_URL=http://127.0.0.1:8000
```

### API Service Layer (`frontend/src/services/api.js`)
Axios instance with:
- **Base URL** from `VITE_API_URL`
- **Auto JWT injection** — token from `localStorage` (`jobify_token`) added to every request
- **401 handler** — clears token and redirects to `/auth` on unauthorized responses
- **API method groups**: `authAPI`, `jobsAPI`, `applicationsAPI`, `savedJobsAPI`

### Auth Flow
1. **Signup**: `POST /api/v1/auth/register` → creates user → auto-logs in
2. **Login**: `POST /api/v1/auth/json-login` → returns JWT → stored in `localStorage`
3. **Profile**: `GET /api/v1/auth/me` → fetches user data with token
4. **Logout**: clears `jobify_token` and `jobify_user` from `localStorage`

### Running Both Together

**Terminal 1 — Backend:**
```powershell
cd 'd:\Studies\DAU\SEM 3\IT643\Project\Jobify\backend'
uvicorn app.main:app --reload
```

**Terminal 2 — Frontend:**
```powershell
cd 'd:\Studies\DAU\SEM 3\IT643\Project\Jobify\frontend'
npm run dev
```

Frontend: `http://localhost:5173` | Backend: `http://127.0.0.1:8000` | API Docs: `http://127.0.0.1:8000/docs`

---

## Dynamic Data Flow (Frontend ↔ Backend)

All dashboard data is now fetched from the backend API instead of mock data:

| Feature | Frontend Trigger | Backend Endpoint | Method |
|---------|-----------------|-----------------|--------|
| Load jobs on Explore | `useEffect` on mount | `GET /api/v1/jobs` | Fetch |
| Load jobs on Employer Dashboard | `useEffect` on mount | `GET /api/v1/jobs/my/postings` | Fetch |
| Create job posting | PostJobModal submit | `POST /api/v1/jobs` | POST |
| Toggle job status | EmployerJobsPage status toggle | `PUT /api/v1/jobs/{id}` | PUT |
| Load applications | `useEffect` on mount | `GET /api/v1/applications/my` | Fetch |
| Apply to job | JobApplyModal submit | `POST /api/v1/applications` | POST |
| Withdraw application | MyApplicationsPage withdraw | `DELETE /api/v1/applications/{id}` | DELETE |
| Update application status | AtsPipelinePage stage change | `PATCH /api/v1/applications/{id}/status` | PATCH |
| Load saved jobs | `useEffect` on mount | `GET /api/v1/saved-jobs` | Fetch |
| Save/unsave job | ExploreJobsPage bookmark toggle | `POST/DELETE /api/v1/saved-jobs/{id}` | POST/DELETE |
| Auth state persistence | localStorage on app start | `GET /api/v1/auth/me` | Fetch |
