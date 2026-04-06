const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
    origin:[ 'https://g4-isdautomaticprogresstracking.netlify.app',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true 
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);


const progressRoutes = require('./routes/progress_router');
app.use('/api/progress', progressRoutes);

//uploading videos and files
const uploadRoutes = require('./routes/upload.routes');
app.use('/api/upload', uploadRoutes);

//video routes
const videoRoutes = require('./routes/video.routes');
app.use('/api/video', videoRoutes);

// Course content routes
const courseRoutes = require('./routes/course.routes');
app.use('/api/courses', courseRoutes);




// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Student Backend is running!' });
});



//const PORT = process.env.STUDENT_PORT || 5000;
const PORT =process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Student Backend running on port ${PORT}`);
// });
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Student Backend running on port ${PORT}`);
    });
}
module.exports = app;