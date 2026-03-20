const express = require('express');
const router = express.Router();

const progressController = require('../controllers/progressController'); //controller import for prgress tracking

router.get('/:courseId',progressController.getCourseProgress);
router.get('/lessons/:courseId',progressController.getLessonProgress);
router.post('/complete',progressController.MarkLessonComplete);


module.exports = router;