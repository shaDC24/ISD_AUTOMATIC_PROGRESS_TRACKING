const pool = require('../db');
// GET /api/video/:lectureId/url
// Returns video URL + metadata for the player to load
const getVideoUrl = async (req, res) => {
    const { lectureId } = req.params;

    try {
        const result = await pool.query(
            `SELECT id, title, video_url, duration
             FROM video_lectures
             WHERE id = $1`,
            [lectureId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }
        

        const lecture = result.rows[0];
        const streamUrl = lecture.video_url.replace(
            '/upload/',
            '/upload/f_auto,q_auto/'
        );        
        res.status(200).json({
            lectureId: lecture.id,
            title:     lecture.title,
            url:       streamUrl,
            duration:  parseFloat(lecture.duration),
        });

    } catch (error) {
        console.error('getVideoUrl error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// GET /api/video/last-position/:lectureId
// Returns last watched position so player can resume
const getLastPosition = async (req, res) => {
    const { lectureId } = req.params;
    const studentId     = req.user.id;

    try {
        const result = await pool.query(
            `SELECT watch_position, completion_percent, is_completed
             FROM video_progress
             WHERE student_id = $1 AND lecture_id = $2`,
            [studentId, lectureId]
        );

        if (result.rows.length === 0) {
            // First time watching — start from 0
            return res.status(200).json({
                position:           0,
                completion_percent: 0,
                is_completed:       false,
            });
        }

        const row = result.rows[0];
        res.status(200).json({
            position:           parseFloat(row.watch_position),
            completion_percent: parseFloat(row.completion_percent),
            is_completed:       row.is_completed,
        });

    } catch (error) {
        console.error('getLastPosition error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// POST /api/video/watch-position
// Called every 10s while video is playing — saves current position
// Body: { lectureId, position, duration }
const saveWatchPosition = async (req, res) => {
    const { lectureId, position, duration } = req.body;
    const studentId = req.user.id;

    if (!lectureId || position === undefined || !duration) {
        return res.status(400).json({
            message: 'lectureId, position and duration are required'
        });
    }

    try {
        // Calculate completion percent
        const completionPercent = Math.min(
            parseFloat(((position / duration) * 100).toFixed(2)),
            100
        );

        // Upsert — insert if new, update if exists
        await pool.query(
            `INSERT INTO video_progress
                (student_id, lecture_id, watch_position, completion_percent, is_completed, last_updated)
             VALUES ($1, $2, $3, $4, FALSE, NOW())
             ON CONFLICT (student_id, lecture_id)
             DO UPDATE SET
                watch_position     = EXCLUDED.watch_position,
                completion_percent = EXCLUDED.completion_percent,
                last_updated       = NOW()`,
            [studentId, lectureId, position, completionPercent]
        );

        res.status(200).json({
            message:            'Position saved',
            position,
            completion_percent: completionPercent,
        });

    } catch (error) {
        console.error('saveWatchPosition error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getVideoUrl, getLastPosition, saveWatchPosition };
