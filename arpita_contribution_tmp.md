# Arpita Dhar (2105137) — Contribution Summary

## Feature: F2 — Automatic Progress Tracking

I was responsible for the **progress tracking system** — both the backend API that powers course completion tracking and the frontend pages where students view their learning progress.

---

## Backend Contributions

### Progress Controller (`progressController.js`)
Built 6 API endpoints that serve as the backbone of the progress tracking system:

| Endpoint | What it does |
|----------|-------------|
| `GET /progress/enrolled/courses` | Returns all courses a student is enrolled in, along with completion %, lecture counts, and enrollment date. Uses a 3-table JOIN (enrollments → courses → course_progress). |
| `GET /progress/lectures/:courseId` | Returns per-lecture completion status for the course sidebar. JOINs video_progress → video_lectures → sections to filter by course. |
| `GET /progress/:courseId` | Returns overall course completion percentage for the progress circle and dashboard stats. |
| `POST /progress/complete` | Called automatically when a student watches 80% of a lecture. Updates both video_progress (mark complete) and course_progress (recalculate %). Includes duplicate-completion guard. |
| `GET /progress/weekly/stats` | Returns daily completion counts for the past 7 days. Powers both the Weekly Progress bar chart and Learning Streak component. |

### Progress Router (`progress_router.js`)
- Configured route ordering (specific routes before wildcard `:courseId`)
- Applied `verifyToken` middleware for JWT authentication on all progress routes

### Integration with Shatabdi's Video Player
Shatabdi's `useVideoProgress.js` hook calls my `POST /progress/complete` endpoint when a student reaches 80% of a video. My endpoint then:
1. Marks the lecture as completed in `video_progress`
2. Increments `completed_lectures` in `course_progress`
3. Recalculates `completion_percentage`

This data flows back to:
- Sidebar checkmarks (via `GET /progress/lectures/:courseId`)
- Course progress bar (via `GET /progress/:courseId`)
- Dashboard stats (via `GET /progress/enrolled/courses`)

---

## Frontend Contributions

### Pages

**StudentDashboard.jsx** — Main landing page after login
- Welcome banner with hero image
- 4 stat cards (Enrolled, Completed, In Progress, Average Progress)
- Learning Streak + Weekly Progress side by side
- Course cards with progress bars and action buttons
- Responsive hover animations

**MyLearning.jsx** — Dedicated course library page
- Dark header matching Udemy design
- Filter tabs (All, In Progress, Completed, Not Started)
- Horizontal course cards with thumbnails, progress bars, enrolled dates
- Empty state with helpful messaging
- Weekly goal tracker + Scheduled learning time section

**Login.jsx** — Redesigned to match Udemy
- 2-step login flow (email → password)
- Illustration + form side by side layout
- Social login buttons (Google, Facebook, Apple)
- Purple Udemy theming


**HomePage.jsx** — Landing page (first page visitors see)
- Sticky navbar with Log in + Sign up buttons
- Hero image slider with auto-slide (3 banners, arrows, dots)
- Stats section (220,000+ lectures, 75,000+ courses, 62M+ students)
- 4 feature cards with hover float animation
- Dark CTA section with Sign up + Log in
- Footer1 + Footer2

### Components

**Navbar.jsx** — Udemy-style top navigation
- Logo, Explore, Search bar, Plans & Pricing, Teach on Udemy, My Learning
- Heart, Cart, Bell icons + Avatar with logout
- Category bar below (Development, Business, IT & Software, etc.)

**CourseNavbar.jsx** — Dark navbar for video player page
- Udemy logo (purple U) + course title
- Star rating, Progress circle (SVG), Share button, Menu
- Receives `courseProgress` prop from CourseContentPage

**CourseMilestones.jsx** — Per-course milestone cards
- 4 milestones: 25%, 50%, 75%, 100%
- Gradient backgrounds, emoji icons in circles
- Mini progress bars showing how close to each milestone
- UNLOCKED/X% to go badges
- Renders below video player in CourseContentPage

**LearningStreak.jsx** — Streak tracker
- Fetches real data from `/progress/weekly/stats`
- Falls back to demo data if no activity
- 7-day circle grid with fire emojis for active days
- Streak counter badge
- Motivational message

**WeeklyProgress.jsx** — Bar chart
- Fetches real data from `/progress/weekly/stats`
- Falls back to demo data if no activity
- Purple bar chart (height proportional to minutes)
- Total hours + Average per day stats
- Daily goal tracker (30 min target)

**Footer1.jsx** — Full footer
- "Teach the world online" dark section
- Purple links grid (About, Discover, Community, Legal)

**Footer2.jsx** — Bottom bar
- Udemy logo, Copyright, Cookie Settings, Language selector
- Purple top border accent


**CourseCarousel.jsx** — Horizontal scrollable course cards
- Enrolled courses + recommended dummy courses
- Left/Right arrow navigation with circular scroll
- Hover popup showing course details
- Progress bars on enrolled courses
- Star ratings + student count
### Services

**api.js** — Added `getEnrolledCourses` function for dashboard API calls

---

## Database Tables I Work With

```
video_progress: student_id, lecture_id, watch_position, completion_percent, is_completed, last_updated
course_progress: student_id, course_id, completion_percentage, completed_lectures, total_lectures
enrollments: student_id, course_id, enrolled_at
courses: id, title, description, thumbnail_url
```

Schema designed by Tanmi — I query these tables in my controller.

---

## File Summary

| File | Type | Lines | Description |
|------|------|-------|-------------|
| progressController.js | Backend | ~90 | 6 API endpoints |
| progress_router.js | Backend | ~15 | Route configuration |
| StudentDashboard.jsx | Frontend | ~200 | Main dashboard page |
| MyLearning.jsx | Frontend | ~220 | Course library with filters |
| Login.jsx | Frontend | ~180 | Udemy-style login page |
| Navbar.jsx | Frontend | ~120 | Top navigation bar |
| CourseNavbar.jsx | Frontend | ~90 | Video page navbar |
| CourseMilestones.jsx | Frontend | ~100 | Milestone cards |
| LearningStreak.jsx | Frontend | ~100 | Streak tracker |
| WeeklyProgress.jsx | Frontend | ~110 | Bar chart |
| Footer1.jsx | Frontend | ~60 | Full footer |
| Footer2.jsx | Frontend | ~40 | Bottom bar |
| api.js | Frontend | ~5 (added) | API service function |
| HomePage.jsx | Frontend | ~200 | Landing page with hero slider |
| CourseCarousel.jsx | Frontend | ~180 | Carousel with hover popup cards |

