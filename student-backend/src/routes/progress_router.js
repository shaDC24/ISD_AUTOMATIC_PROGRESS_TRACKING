const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const progressController = require('../controllers/progressController'); 

router.use(verifyToken);

router.get('/enrolled/courses', progressController.getEnrolledCourses);
router.get('/lectures/:courseId',progressController.getLessonProgress);
router.get('/:courseId',progressController.getCourseProgress);

router.post('/complete',progressController.MarkLessonComplete);


module.exports = router;