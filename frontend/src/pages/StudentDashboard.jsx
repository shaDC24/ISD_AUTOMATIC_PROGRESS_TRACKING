import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAPI from '../services/api';
import Navbar from '../components/Navbar';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await studentAPI.get('/progress/enrolled/courses');
                setCourses(res.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const completedCount = courses.filter(c => parseFloat(c.completion_percentage) >= 100).length;
    const inProgressCount = courses.filter(c => parseFloat(c.completion_percentage) > 0 && parseFloat(c.completion_percentage) < 100).length;
    const notStartedCount = courses.filter(c => parseFloat(c.completion_percentage) === 0).length;
    const avgProgress = courses.length > 0
        ? (courses.reduce((sum, c) => sum + parseFloat(c.completion_percentage || 0), 0) / courses.length).toFixed(1)
        : 0;

    const lastAccessed = courses.length > 0
        ? courses.reduce((latest, c) => {
            const d = new Date(c.enrolled_at);
            return d > new Date(latest.enrolled_at) ? c : latest;
        }, courses[0])
        : null;

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={styles.loadingContainer}>
                    <p style={styles.loadingText}>Loading your courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>
                {/* Welcome */}
                <div style={styles.welcomeCard}>
                    <h1 style={styles.welcomeTitle}>Welcome back, {user?.name?.split(' ')[1] || user?.name}!</h1>
                    <p style={styles.welcomeSubtitle}>Continue where you left off</p>
                </div>

                {/* Stats */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>Enrolled</p>
                        <p style={styles.statNumber}>{courses.length}</p>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>Completed</p>
                        <p style={styles.statNumber}>{completedCount}</p>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>In progress</p>
                        <p style={styles.statNumber}>{inProgressCount}</p>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statLabel}>Avg progress</p>
                        <p style={styles.statNumber}>{avgProgress}%</p>
                    </div>
                </div>

                {/* Continue Learning Banner */}
                {lastAccessed && (
                    <div style={styles.continueBanner}>
                        <div style={styles.continueThumb}>
                            {lastAccessed.title.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={styles.continueInfo}>
                            <p style={styles.continueLabel}>CONTINUE LEARNING</p>
                            <p style={styles.continueTitle}>{lastAccessed.title}</p>
                            <p style={styles.continueSubtitle}>
                                {lastAccessed.completed_lectures}/{lastAccessed.total_lectures} lectures completed
                            </p>
                            <div style={styles.miniProgressTrack}>
                                <div style={{
                                    ...styles.miniProgressFill,
                                    width: `${parseFloat(lastAccessed.completion_percentage)}%`
                                }} />
                            </div>
                        </div>
                        <button
                            style={styles.resumeBtn}
                            onClick={() => navigate(`/student/course/${lastAccessed.id}`)}
                        >
                            Resume
                        </button>
                    </div>
                )}

                {/* My Courses */}
                <h2 style={styles.sectionTitle}>My courses</h2>
                <div style={styles.coursesGrid}>
                    {courses.map(course => {
                        const percent = parseFloat(course.completion_percentage || 0);
                        const isStarted = percent > 0;

                        return (
                            <div
                                key={course.id}
                                style={styles.courseCard}
                                onClick={() => navigate(`/student/course/${course.id}`)}
                            >
                                <div style={styles.courseThumbnail}>
                                    <span style={styles.thumbText}>{course.title.split(':')[0]}</span>
                                    <div style={styles.thumbProgress}>
                                        <div style={{
                                            ...styles.thumbProgressFill,
                                            width: `${percent}%`
                                        }} />
                                    </div>
                                </div>

                                <div style={styles.courseBody}>
                                    <p style={styles.courseTitle}>{course.title}</p>
                                    <p style={styles.courseInstructor}>Instructor</p>

                                    <div style={styles.progressTrack}>
                                        <div style={{
                                            ...styles.progressFill,
                                            width: `${percent}%`,
                                            backgroundColor: percent >= 100 ? '#10b981' : '#7c3aed',
                                        }} />
                                    </div>

                                    <div style={styles.progressInfo}>
                                        <span style={styles.lectureCount}>
                                            {course.completed_lectures}/{course.total_lectures} lectures
                                        </span>
                                        <span style={{
                                            ...styles.percentText,
                                            color: percent >= 100 ? '#10b981' : percent > 0 ? '#7c3aed' : '#9ca3af',
                                        }}>
                                            {percent.toFixed(0)}%
                                        </span>
                                    </div>

                                    <button style={isStarted ? styles.continueBtn : styles.startBtn}>
                                        {isStarted ? 'Continue learning' : 'Start course'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Milestones */}
                <h2 style={styles.sectionTitle}>Milestones</h2>
                <div style={styles.milestonesGrid}>
                    {[
                        { pct: 25, label: 'Getting started', color: '#7c3aed', bg: '#f3f0ff' },
                        { pct: 50, label: 'Halfway there', color: '#2563eb', bg: '#eff6ff' },
                        { pct: 75, label: 'Almost done', color: '#d97706', bg: '#fffbeb' },
                        { pct: 100, label: 'Course master', color: '#10b981', bg: '#ecfdf5' },
                    ].map(m => {
                        const achieved = courses.some(c => parseFloat(c.completion_percentage) >= m.pct);
                        return (
                            <div key={m.pct} style={{
                                ...styles.milestoneCard,
                                backgroundColor: achieved ? m.bg : '#f5f5f5',
                                opacity: achieved ? 1 : 0.4,
                            }}>
                                <p style={{
                                    ...styles.milestonePct,
                                    color: achieved ? m.color : '#999',
                                }}>{m.pct}%</p>
                                <p style={{
                                    ...styles.milestoneLabel,
                                    color: achieved ? m.color : '#999',
                                }}>{m.label}</p>
                                <p style={styles.milestoneStatus}>
                                    {achieved ? '✓ Unlocked' : 'Locked'}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f7f9fa',
    },
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '24px 20px',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
    },
    loadingText: {
        fontSize: '16px',
        color: '#6b7280',
    },

    // Welcome
    welcomeCard: {
        marginBottom: '20px',
    },
    welcomeTitle: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#1c1d1f',
        margin: '0 0 4px',
    },
    welcomeSubtitle: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
    },

    // Stats
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '20px',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '16px',
        border: '1px solid #e5e7eb',
    },
    statLabel: {
        fontSize: '12px',
        color: '#6b7280',
        margin: '0 0 4px',
    },
    statNumber: {
        fontSize: '26px',
        fontWeight: 700,
        color: '#1c1d1f',
        margin: 0,
    },

    // Continue Banner
    continueBanner: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        backgroundColor: '#fff',
        border: '2px solid #7c3aed',
        borderRadius: '12px',
        marginBottom: '24px',
    },
    continueThumb: {
        width: '52px',
        height: '52px',
        borderRadius: '8px',
        backgroundColor: '#1c1d1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 600,
        flexShrink: 0,
    },
    continueInfo: {
        flex: 1,
        minWidth: 0,
    },
    continueLabel: {
        fontSize: '11px',
        color: '#7c3aed',
        fontWeight: 600,
        margin: '0 0 2px',
        letterSpacing: '0.5px',
    },
    continueTitle: {
        fontSize: '15px',
        fontWeight: 600,
        color: '#1c1d1f',
        margin: '0 0 4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    continueSubtitle: {
        fontSize: '12px',
        color: '#6b7280',
        margin: '0 0 6px',
    },
    miniProgressTrack: {
        height: '4px',
        backgroundColor: '#e5e7eb',
        borderRadius: '2px',
        maxWidth: '250px',
        overflow: 'hidden',
    },
    miniProgressFill: {
        height: '100%',
        backgroundColor: '#7c3aed',
        borderRadius: '2px',
        transition: 'width 0.3s',
    },
    resumeBtn: {
        padding: '10px 24px',
        backgroundColor: '#7c3aed',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },

    // Section Title
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 700,
        color: '#1c1d1f',
        margin: '0 0 14px',
    },

    // Course Cards
    coursesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '28px',
    },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
    },
    courseThumbnail: {
        height: '100px',
        backgroundColor: '#1c1d1f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    thumbText: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: 600,
    },
    thumbProgress: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    thumbProgressFill: {
        height: '100%',
        backgroundColor: '#7c3aed',
        transition: 'width 0.3s',
    },
    courseBody: {
        padding: '14px 16px',
    },
    courseTitle: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#1c1d1f',
        margin: '0 0 4px',
    },
    courseInstructor: {
        fontSize: '12px',
        color: '#6b7280',
        margin: '0 0 12px',
    },
    progressTrack: {
        height: '6px',
        backgroundColor: '#e5e7eb',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '6px',
    },
    progressFill: {
        height: '100%',
        borderRadius: '3px',
        transition: 'width 0.3s',
    },
    progressInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    lectureCount: {
        fontSize: '12px',
        color: '#6b7280',
    },
    percentText: {
        fontSize: '12px',
        fontWeight: 600,
    },
    continueBtn: {
        width: '100%',
        padding: '8px',
        backgroundColor: '#7c3aed',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
    },
    startBtn: {
        width: '100%',
        padding: '8px',
        backgroundColor: 'transparent',
        color: '#1c1d1f',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
    },

    // Milestones
    milestonesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '20px',
    },
    milestoneCard: {
        borderRadius: '10px',
        padding: '14px',
        textAlign: 'center',
    },
    milestonePct: {
        fontSize: '22px',
        fontWeight: 700,
        margin: '0 0 2px',
    },
    milestoneLabel: {
        fontSize: '11px',
        fontWeight: 600,
        margin: '0 0 2px',
    },
    milestoneStatus: {
        fontSize: '10px',
        color: '#9ca3af',
        margin: 0,
    },
};