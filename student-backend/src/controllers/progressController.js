const db = require('../db');



const getCourseProgress = async(req,res)=>{

    try{
        const {courseId} = req.params;
        const userId = req.user.id;

        const result = await db.query(
            'SELECT * FROM  course_progress WHERE student_id = $1 AND course_id = $2',
            [userId,courseId]
        );
        res.json(result.rows[0] || { completion_percentage: 0 });

    } catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getLessonProgress = async(req,res) => {

    try{
        const {courseId} = req.params;
        const userid = req.user.id;

        const result = await db.query(
            `SELECT * FROM video_progress vp 
            JOIN video_lectures vl ON vp.lecture_id = vl.id
            JOIN sections s ON vl.section_id = s.id 
            WHERE vp.student_id = $1 AND s.course_id = $2`,
            [userid,courseId]
        );
        res.json({lectures:result.rows});

    } catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).json({ error: 'Internal server error' });       
        

    }

};


const MarkLessonComplete = async(req,res) => {

    try{
        const { lectureId, courseId , percentage } = req.body;
        const userId = req.user.id;

        await db.query(
            `UPDATE video_progress SET is_completed = true,completion_percent = $3 
            WHERE student_id = $1 AND lecture_id = $2`,
            [userId,lectureId,percentage]
        );

        await db.query(
            `UPDATE course_progress SET completed_lectures = completed_lectures + 1,
            completion_percentage = ((completed_lectures + 1)::float / total_lectures) * 100
            WHERE student_id = $1 AND course_id = $2`,
            [userId,courseId]
        );
        res.json({ message: 'Lesson marked as complete' });
    } catch (error) {
        console.error('Error marking lesson as complete:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getEnrolledCourses = async(req,res)=>{
    try{
        const userId = req.user.id;

        const result = await db.query(
            `SELECT c.id, c.title, c.description, c.thumbnail_url,
            cp.completion_percentage, cp.completed_lectures, cp.total_lectures,
            e.enrolled_at 
            FROM enrollments e JOIN courses c ON e.course_id = c.id LEFT JOIN 
            course_progress cp ON e.student_id = cp.student_id AND
             e.course_id = cp.course_id WHERE e.student_id = $1`,
            [userId]
        );
        console.log('Enrolled courses:', result.rows.length, result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getCourseProgress, getLessonProgress, MarkLessonComplete, getEnrolledCourses };