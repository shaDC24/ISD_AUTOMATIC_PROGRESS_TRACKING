const pool = require('../db');

// GET /api/courses/:courseId/lectures
// Returns all lectures for a course grouped by section
// Returns all lectures + materials for a course
const getCourseLectures = async (req, res) => {
    const { courseId } = req.params;

    try {
        // Get course info
        const course = await pool.query(
            'SELECT id, title, description FROM courses WHERE id = $1',
            [courseId]
        );

        if (course.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // All lectures via sections
        const lecturesResult = await pool.query(
            `SELECT
                vl.id,
                vl.title,
                vl.video_url,
                vl.duration,
                vl.position,
                s.id       AS section_id,
                s.title    AS section_title,
                s.position AS section_position
             FROM video_lectures vl
             JOIN sections s ON vl.section_id = s.id
             WHERE s.course_id = $1
             ORDER BY s.position, vl.position`,
            [courseId]
        );
        // All materials for this course
        const materialsResult = await pool.query(
            `SELECT
                m.id,
                m.title,
                m.file_url,
                m.file_type,
                m.download_allowed,
                m.section_id
             FROM materials m
             JOIN sections s ON m.section_id = s.id
             WHERE s.course_id = $1
             ORDER BY s.position, m.id`,
            [courseId]
        );   

        res.status(200).json({
            courseId:  parseInt(courseId),
            title:     course.rows[0].title,
            lectures:  lecturesResult.rows,
            materials: materialsResult.rows,
            total:     lecturesResult.rows.length,
        });

    } catch (error) {
        console.error('getCourseLectures error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getCourseLectures };