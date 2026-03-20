const express    = require('express');
const router     = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const {
    getVideoUrl,
    getLastPosition,
    saveWatchPosition,
} = require('../controllers/videoController');

// All video routes require authentication
router.use(verifyToken);

// GET /api/video/:lectureId/url
// Returns video streaming URL + metadata
router.get('/:lectureId/url', getVideoUrl);

// GET /api/video/last-position/:lectureId
// Returns last watched position for resume feature
router.get('/last-position/:lectureId', getLastPosition);

// POST /api/video/watch-position
// Saves current position — called every 10s while playing
router.post('/watch-position', saveWatchPosition);

module.exports = router;
