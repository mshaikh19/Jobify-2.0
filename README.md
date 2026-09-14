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
   ```bash
   cd backend
   ```

2. Install required Python packages:
   ```bash
   pip install fastapi uvicorn "pymongo[srv]" motor python-dotenv
   ```
   *(or `pip install -r requirements.txt` if using requirements file)*

3. Create/Configure `.env` file in the `backend` directory:
   ```env
   MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Jobify
   DATABASE_NAME=jobify
   ```

4. Start the FastAPI backend server:
   ```bash
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

| Method | Endpoint    | Description                     |
| ------ | ----------- | ------------------------------- |
| `GET`  | `/health`   | Health check endpoint           |
| `GET`  | `/db-check` | Verifies connection to MongoDB  |
