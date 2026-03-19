const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Temporarily commented — Issue #1: getLessonsProgress typo in progress_router.js
// Will uncomment after Arpita fixes the bug
// const progressRoutes = require('./routes/progress_router');
// app.use('/api/progress', progressRoutes);

//uploading videos and files
const uploadRoutes = require('./routes/upload.routes');
app.use('/api/upload', uploadRoutes);


// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Student Backend is running!' });
});



const PORT = process.env.STUDENT_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Student Backend running on port ${PORT}`);
});