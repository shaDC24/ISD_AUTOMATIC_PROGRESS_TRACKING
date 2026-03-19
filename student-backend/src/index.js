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

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Student Backend is running!' });
});

const PORT = process.env.STUDENT_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Student Backend running on port ${PORT}`);
});