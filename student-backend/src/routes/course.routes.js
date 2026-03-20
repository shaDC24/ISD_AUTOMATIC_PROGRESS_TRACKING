const express     = require('express');
const router      = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { getCourseLectures } = require('../controllers/courseController');

router.use(verifyToken);

// GET /api/courses/:courseId/lectures
router.get('/:courseId/lectures', getCourseLectures);

module.exports = router;