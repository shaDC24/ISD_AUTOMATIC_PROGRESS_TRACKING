const express    = require('express');
const router     = express.Router();
// const verifyToken                      = require('../middleware/auth.middleware');
const { videoUpload, materialUpload }  = require('../middleware/upload.middleware');
const { uploadVideo, uploadMaterial, deleteVideo } = require('../controllers/uploadController');

// All upload routes require authentication
router.use(verifyToken);

// POST /api/upload/video
// Instructor uploads a video lecture (multipart/form-data)
router.post('/video', videoUpload.single('file'), uploadVideo);

// POST /api/upload/material
// Instructor uploads PDF/ZIP/image (multipart/form-data)
router.post('/material', materialUpload.single('file'), uploadMaterial);

// DELETE /api/upload/video/:lectureId
// Remove a video lecture
router.delete('/video/:lectureId', deleteVideo);

module.exports = router;