import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import CourseContentPage from './pages/CourseContentPage';
import StudentDashboard from './pages/StudentDashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/student/course/:courseId" element={<CourseContentPage />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                
            </Routes>
        </BrowserRouter>
    );
}




export default App;