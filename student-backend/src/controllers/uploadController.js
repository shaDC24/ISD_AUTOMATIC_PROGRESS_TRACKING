const pool       = require('../db');
const cloudinary = require('../config/cloudinary');

// ─────────────────────────────────────────────────────────────
// POST /api/upload/video
// Instructor uploads a video lecture
// Body (multipart): file, sectionId, title, position
// ─────────────────────────────────────────────────────────────
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const { sectionId, title, position = 1 } = req.body;

        if (!sectionId || !title) {
            // Cleanup uploaded file from Cloudinary
            await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'video' });
            return res.status(400).json({ message: 'sectionId and title are required' });
        }

        const videoUrl  = req.file.path;       // Cloudinary URL
        const publicId  = req.file.filename;   // Cloudinary public_id
        const duration  = req.file.duration || 0; // seconds (Cloudinary provides this)

        // Save to video_lectures table
        const result = await pool.query(
            `INSERT INTO video_lectures (section_id, title, video_url, duration, position)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, video_url, duration`,
            [sectionId, title, videoUrl, duration, position]
        );

        res.status(201).json({
            message:   'Video uploaded successfully',
            lecture:   result.rows[0],
            publicId,
        });

    } catch (error) {
        console.error('uploadVideo error:', error.message);
        res.status(500).json({ message: 'Server error during video upload' });
    }
};


// ─────────────────────────────────────────────────────────────
// POST /api/upload/material
// Instructor uploads a PDF, ZIP, image etc.
// Body (multipart): file, sectionId, title, downloadAllowed
// ─────────────────────────────────────────────────────────────
const uploadMaterial = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { sectionId, title, downloadAllowed = true } = req.body;

        if (!sectionId || !title) {
            await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'raw' });
            return res.status(400).json({ message: 'sectionId and title are required' });
        }

        const fileUrl  = req.file.path;
        const fileType = req.file.mimetype;

        // Save to materials table
        const result = await pool.query(
            `INSERT INTO materials (section_id, title, file_url, file_type, download_allowed)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, file_url, file_type, download_allowed`,
            [sectionId, title, fileUrl, fileType, downloadAllowed === 'true' || downloadAllowed === true]
        );

        res.status(201).json({
            message:  'Material uploaded successfully',
            material: result.rows[0],
        });

    } catch (error) {
        console.error('uploadMaterial error:', error.message);
        res.status(500).json({ message: 'Server error during material upload' });
    }
};


// ─────────────────────────────────────────────────────────────
// DELETE /api/upload/video/:publicId
// Remove a video from Cloudinary + DB
// ─────────────────────────────────────────────────────────────
const deleteVideo = async (req, res) => {
    const { lectureId } = req.params;

    try {
        const lecture = await pool.query(
            'SELECT video_url FROM video_lectures WHERE id = $1',
            [lectureId]
        );

        if (lecture.rows.length === 0) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Extract public_id from Cloudinary URL
        const url      = lecture.rows[0].video_url;
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

        // Delete from DB (cascades to video_progress)
        await pool.query('DELETE FROM video_lectures WHERE id = $1', [lectureId]);

        res.status(200).json({ message: 'Video deleted successfully' });

    } catch (error) {
        console.error('deleteVideo error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { uploadVideo, uploadMaterial, deleteVideo };