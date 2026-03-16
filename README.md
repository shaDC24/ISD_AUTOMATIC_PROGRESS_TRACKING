# Automatic Progress Tracking
### Udemy Course Management System — CSE 326 | Group 4 | Subsection C1 | BUET 

---

## Team Members

| Student ID | Name                       | Role                        |
|------------|----------------------------|-----------------------------|
| 2105123    | Shatabdi Dutta Chowdhury   | Student UI + Video API + DevOps |
| 2105124    | Md. Shadman Abid            | Instructor DevOps + Student Progress UI |
| 2105125    | Md. Yousuf Niaz             | Instructor Analytics UI + API |
| 2105137    | Arpita Dhar                 | Student Progress API + DB Models |
| 2105140    | Nusrat Jahan Tamanna        | Threshold Service + Notification API |
| 2105147    | Tasnimzaman Tanmi           | DB Schema + Project Structure + Student Dashboard UI |

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Recharts          |
| Backend    | Node.js, Express.js               |
| Database   | PostgreSQL 16                     |
| DevOps     | Docker, Docker Compose            |
| CI/CD      | GitHub Actions                    |

---

## Project Structure

```
progress-tracker/                        ← one repo
│
├── frontend/                            ← shared React app (all members)
│   └── src/
│       ├── pages/
│       │   ├── VideoPlayer.jsx          ← 
│       │   ├── CourseContentPage.jsx    ← 
│       │   ├── StudentDashboard.jsx     ← 
│       │   ├── Progress.jsx             ← 
│       │   ├── InstructorDashboard.jsx  ←
│       │   ├── Analytics.jsx            ←
│       │   └── StudentProgressView.jsx  ← 
│       ├── components/
│       │   ├── ProgressBar.jsx          ← 
│       │   ├── CompletionRing.jsx       ← 
│       │   ├── MilestoneBadge.jsx       ← 
│       │   ├── EngagementChart.jsx      ← 
│       │   └── NotificationBell.jsx     ← 
│       ├── hooks/
│       │   └── useVideoProgress.js      ← 
│       └── services/
│           └── api.js                   ← 
│
├── student-backend/                     ← 
│   └── src/
│       ├── routes/
│       │   ├── video.routes.js          ← 
│       │   └── progress.routes.js       ← 
│       ├── controllers/
│       │   ├── videoController.js       ← 
│       │   └── progressController.js    ← 
│       └── models/
│           ├── VideoProgress.js         ← 
│           └── CourseProgress.js        ← 
│
├── instructor-backend/                  ← 
│   └── src/
│       ├── routes/
│       │   ├── analytics.routes.js      ← 
│       │   └── notification.routes.js   ← 
│       ├── controllers/
│       │   ├── analyticsController.js   ← 
│       │   └── notificationController.js← 
│       └── models/
│           ├── Notification.js          ← 
│           └── Milestone.js             ← 
│
├── db/
│   ├── student-schema.sql               ← 
│   ├── instructor-schema.sql            ← 
│   └── seed.sql                         ← 
│
├── .github/
│   └── workflows/
│       ├── student-ci.yml               ← 
│       └── instructor-ci.yml            ← 
│
├── docker-compose.yml                   ← 
├── docker-compose.prod.yml              ← 
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)

---

### Run with Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/<your-org>/progress-tracker.git
cd progress-tracker

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your own values

# 3. Start all services
docker-compose up --build
```

| Service            | URL                    |
|--------------------|------------------------|
| Frontend           | http://localhost:5173  |
| Student Backend    | http://localhost:5000  |
| Instructor Backend | http://localhost:5001  |
| PostgreSQL         | localhost:5432         |

---

### Run Locally (Without Docker)

#### Student Backend
```bash
cd student-backend
npm install
cp ../.env.example .env
npm run dev
```

#### Instructor Backend
```bash
cd instructor-backend
npm install
cp ../.env.example .env
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=progress_tracker
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/progress_tracker

# Student Backend
STUDENT_PORT=5000

# Instructor Backend
INSTRUCTOR_PORT=5001

# Frontend
VITE_STUDENT_API_URL=http://localhost:5000/api
VITE_INSTRUCTOR_API_URL=http://localhost:5001/api

NODE_ENV=development
```

---

## API Reference

### Student Backend — `http://localhost:5000/api`

#### Video Routes (`/video`)
| Method | Endpoint                         | Description                    | Owner    |
|--------|----------------------------------|--------------------------------|----------|
| GET    | `/video/:videoId/url`            | Get video streaming URL        | Shatabdi |
| GET    | `/video/last-position/:videoId`  | Get last watched position      | Shatabdi |
| POST   | `/video/watch-position`          | Save current watch position    | Shatabdi |

#### Progress Routes (`/progress`)
| Method | Endpoint                        | Description                        | Owner  |
|--------|---------------------------------|------------------------------------|--------|
| GET    | `/progress/:courseId`           | Get student's course progress      | Arpita |
| GET    | `/progress/lectures/:courseId`  | Get all lecture completion status  | Arpita |
| POST   | `/progress/complete`            | Mark a lecture as complete         | Arpita |

---

### Instructor Backend — `http://localhost:5001/api`

#### Analytics Routes (`/analytics`)
| Method | Endpoint                          | Description                     | Owner |
|--------|-----------------------------------|---------------------------------|-------|
| GET    | `/analytics/overview/:courseId`   | Get course overview stats       | Niaz  |
| GET    | `/analytics/progress/:courseId`   | Get student progress metrics    | Niaz  |
| GET    | `/analytics/engagement/:courseId` | Get engagement + watch time     | Niaz  |

#### Notification Routes (`/notifications`)
| Method | Endpoint                   | Description                        | Owner   |
|--------|----------------------------|------------------------------------|---------|
| GET    | `/notifications`           | Get all notifications for student  | Tamanna |
| POST   | `/notifications/milestone` | Trigger milestone notification     | Tamanna |
| POST   | `/notifications/reminder`  | Send course reminder               | Tamanna |

---

## Database Schema

### `video_progress`
```sql
id              SERIAL PRIMARY KEY
student_id      INTEGER NOT NULL
video_id        INTEGER NOT NULL
watch_position  FLOAT NOT NULL DEFAULT 0
duration        FLOAT NOT NULL DEFAULT 0
is_completed    BOOLEAN DEFAULT FALSE
last_watched_at TIMESTAMP DEFAULT NOW()
```

### `course_progress`
```sql
id                      SERIAL PRIMARY KEY
student_id              INTEGER NOT NULL
course_id               INTEGER NOT NULL
completion_percentage   FLOAT DEFAULT 0
last_updated_at         TIMESTAMP DEFAULT NOW()
```

### `notifications`
```sql
id          SERIAL PRIMARY KEY
student_id  INTEGER NOT NULL
type        VARCHAR(50)
message     TEXT
is_read     BOOLEAN DEFAULT FALSE
created_at  TIMESTAMP DEFAULT NOW()
```

### `milestones`
```sql
id          SERIAL PRIMARY KEY
student_id  INTEGER NOT NULL
course_id   INTEGER NOT NULL
milestone   INTEGER
achieved_at TIMESTAMP DEFAULT NOW()
```

---

## Branch Strategy

Each member works on their own branch and opens a PR to `main`.

| Branch                        | Owner    |
|-------------------------------|----------|
| `student/video-player`        | Shatabdi |
| `student/progress-api`        | Arpita   |
| `student/devops`              | Shatabdi |
| `instructor/analytics-ui`     | Niaz     |
| `instructor/threshold-api`    | Tamanna  |
| `instructor/devops`           | Shadman  |

### Paired Review
- Shatabdi ↔ Arpita
- Niaz ↔ Tamanna
- Shadman reviews both DevOps PRs

---

## Contribution Summary

| Member    | Frontend files                                  | Backend files                             | DevOps                        |
|-----------|-------------------------------------------------|-------------------------------------------|-------------------------------|
