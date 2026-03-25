# Shatabdi Dutta Chowdhury (2105123)
## Contribution — Student UI + Video API 
### CSE 326 ISD Sessional | Group 4 | Subsection C1

---

## What I Built

I implemented the **Automatic Video Progress Tracking** feature on the student side.
This includes all backend APIs for video playback and file storage, and the full
frontend video player with UX improvements.

---

## Backend Files

All files are inside `student-backend/src/`

### `config/cloudinary.js`
Configures Cloudinary v2 for video and material file storage.

### `middleware/auth.middleware.js`
JWT token verification middleware. Protects all video and upload routes.
Tanmi's `authController.js` creates the token on login — this file verifies it on every request.

### `middleware/upload.middleware.js`
Multer file upload middleware using `memoryStorage + streamifier`.

> **Note:** `multer-storage-cloudinary` is incompatible with Cloudinary v2.
> I replaced it with `multer.memoryStorage()` + `streamifier` to stream
> the file buffer directly to Cloudinary.

### `controllers/videoController.js`
Three endpoints for the video player:

| Endpoint | Description |
|---|---|
| `GET /api/video/:lectureId/url` | Returns Cloudinary video URL + title + duration |
| `GET /api/video/last-position/:lectureId` | Returns last watched position for resume |
| `POST /api/video/watch-position` | Saves current position every 10s |

**Schema used:** `video_lectures`, `video_progress`
**Column names:** `lecture_id` (not `video_id`), `completion_percent`, `last_updated`

### `controllers/uploadController.js`
| Endpoint | Description |
|---|---|
| `POST /api/upload/video` | Instructor uploads a video to Cloudinary |
| `POST /api/upload/material` | Instructor uploads PDF/ZIP/PPT to Cloudinary |
| `DELETE /api/upload/video/:lectureId` | Deletes from Cloudinary + DB |

### `controllers/courseController.js`
| Endpoint | Description |
|---|---|
| `GET /api/courses/:courseId/lectures` | Returns all lectures + materials for a course, grouped by section |

### Routes
- `routes/video.routes.js`
- `routes/upload.routes.js`
- `routes/course.routes.js`

All registered in `index.js`.

---

## Frontend Files

All files are inside `frontend/src/`

### `hooks/useVideoProgress.js`
Custom React hook that handles all progress tracking logic:
- Fetches last watched position on load (for resume)
- Saves position every 10 seconds while playing
- Saves immediately on pause
- Saves on tab close using `navigator.sendBeacon` + `localStorage` fallback
- At **80%** → silently calls Arpita's `POST /progress/complete` API ............................................................
- Returns `isCompleted` state so sidebar checkmark updates instantly

### `components/ProgressBar.jsx`
Custom video progress bar:
- Clickable seek bar
- **80% marker line** (yellow → green when passed)
- Hover tooltip showing time at cursor
- Animated thumb that grows on hover
- Color shifts purple → green on completion

### `components/CircularProgress.jsx`
Small SVG circle showing per-lecture watch percentage in the sidebar.
Shows `✓` when completed, percentage number while in progress.

### `pages/VideoPlayer.jsx`
Full video player with:
- Loads video from Cloudinary URL
- Resumes from last position with toast notification
- Play/Pause, Speed control, Volume slider, Mute button
- CC (subtitle) toggle
- Fullscreen button
- Buffering spinner overlay
- **Keyboard shortcuts:**

  | Key | Action |
  |---|---|
  | `Space` / `K` | Play / Pause |
  | `←` / `→` | Seek ±10 seconds |
  | `↑` / `↓` | Volume up/down |
  | `M` | Mute / Unmute |
  | `F` | Fullscreen |

- **100% completion popup** with 5-second auto-advance countdown to next lecture

### `pages/CourseContentPage.jsx`
Course page with sidebar:
- Sidebar groups lectures by section (collapsible dropdowns like Udemy)
- Per-lecture circular progress indicator
- Materials shown under the selected lecture (PDF, ZIP, PPT download links)
- Sidebar checkmark updates instantly when 80% threshold is reached
- Course progress bar at the bottom of sidebar
- Auto-advance countdown banner when video ends

---

## Database

### `db/student-schema.sql`
Added `subtitle_url VARCHAR(500) DEFAULT NULL` to `video_lectures` table and `reviews` table.

### `db/seed.sql`
- Real Cloudinary video URLs (CSE321 Computer Networks lectures)
- Real publicly accessible PDFs for materials
- `TRUNCATE ... RESTART IDENTITY CASCADE` at the top — no conflict on re-run

---

## ⚠️ Important:My code calls Arpita's progress routes in two places.


**These will silently fail (try/catch) .**

### 1. `useVideoProgress.js` — 80% threshold
```js
// Called when student watches 80% of a lecture
await studentAPI.post('/progress/complete', {
    lectureId: videoId,
    courseId,
    percentage,   
});
```

### 2. `CourseContentPage.jsx` — lecture progress + course %
```js
// Per-lecture completion status (circular progress + checkmarks)
await studentAPI.get(`/progress/lectures/${courseId}`);

// Overall course completion percentage (progress bar)
await studentAPI.get(`/progress/${courseId}`);
```



## Environment Variables I Added to `.env.example`

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## CI/CD & Testing

### `.github/workflows/ci.yml`
GitHub Actions pipeline that runs automatically on every push/PR to main:
- Spins up PostgreSQL test database
- Runs backend unit tests
- Checks frontend build

### `student-backend/tests/videoController.test.js`
Unit + Integration tests for video API:
- `GET /video/:lectureId/url` — 200, 404, 401
- `GET /video/last-position/:lectureId` — first time, resume, completed
- `POST /video/watch-position` — save, 400, 100% cap, 401
- Integration: Save → Fetch → Resume flow

Run tests:
```bash
cd student-backend
npm test
```
---

## Git Branches

| Branch | Status |
|---|---|
| `shatabdi/video-player` | Merged to main |
| `shatabdi/frontend-pages` | Merged to main |
| `shatabdi/ux-improvements` | Merged to main |
