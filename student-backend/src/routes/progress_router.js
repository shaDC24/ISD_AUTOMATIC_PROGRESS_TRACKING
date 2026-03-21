const express = require('express');
const router = express.Router();

const progressController = require('../controllers/progressController'); 

router.get('/enrolled/courses', progressController.getEnrolledCourses);
router.get('/:courseId',progressController.getCourseProgress);
router.get('/lessons/:courseId',progressController.getLessonProgress);
router.post('/complete',progressController.MarkLessonComplete);


module.exports = router;