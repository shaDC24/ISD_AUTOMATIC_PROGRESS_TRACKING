import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAPI from '../services/api';
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';

export default function MyLearning() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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

    const filteredCourses = courses.filter(c => {
        const pct = parseFloat(c.completion_percentage || 0);
        if (filter === 'in-progress') return pct > 0 && pct < 100;
        if (filter === 'completed') return pct >= 100;
        if (filter === 'not-started') return pct === 0;
        return true;
    });

    const completedCount = courses.filter(c => parseFloat(c.completion_percentage) >= 100).length;
    const inProgressCount = courses.filter(c => {
        const p = parseFloat(c.completion_percentage);
        return p > 0 && p < 100;
    }).length;
    const notStartedCount = courses.filter(c => parseFloat(c.completion_percentage) === 0).length;

    const filters = [
        { key: 'all', label: 'All courses', count: courses.length },
        { key: 'in-progress', label: 'In progress', count: inProgressCount },
        { key: 'completed', label: 'Completed', count: completedCount },
        { key: 'not-started', label: 'Not started', count: notStartedCount },
    ];

    if (loading) {
        return (
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <p style={{ color: '#6b7280', fontSize: '15px' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* Header Section */}
            <div style={{ backgroundColor: '#1c1d1f', padding: '32px 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: 0 }}>
                        My learning
                    </h1>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                backgroundColor: '#1c1d1f', borderBottom: '1px solid #3e4143',
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto', padding: '0 48px',
                    display: 'flex', gap: '0',
                }}>
                    {filters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            style={{
                                padding: '14px 20px', backgroundColor: 'transparent',
                                color: filter === f.key ? '#fff' : '#9ca3af',
                                border: 'none', borderBottom: filter === f.key ? '3px solid #a435f0' : '3px solid transparent',
                                fontSize: '14px', fontWeight: filter === f.key ? 700 : 400,
                                cursor: 'pointer', transition: 'all 0.15s',
                            }}
                        >
                            {f.label} ({f.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '32px 48px', width: '100%', boxSizing: 'border-box' }}>
                {/* Weekly Goal + Scheduled Learning */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>

    {/* Start a weekly start */}
    <div style={{
        backgroundColor: '#fff', borderRadius: '8px',
        border: '1px solid #e5e7eb', padding: '28px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
        <div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1c1d1f', margin: '0 0 8px' }}>
                Start a weekly start
            </h3>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
                Watch 5 minutes of video per day to reach your goal
            </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Double ring SVG */}
            <svg width="100" height="100" viewBox="0 0 100 100">
                {/* Outer ring - course minutes (grey + yellow) */}
                <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#d1d5db" strokeWidth="8"
                    strokeDasharray="0 276.5" strokeLinecap="round"
                    transform="rotate(-90 50 50)" />
                {/* Inner ring - visits (grey + green) */}
                <circle cx="50" cy="50" r="32" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="#10b981" strokeWidth="8"
                    strokeDasharray={`${0.5 * 201} ${201}`} strokeLinecap="round"
                    transform="rotate(-90 50 50)" />
            </svg>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>0/30 course min</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>1/1 visit</span>
                </div>
            </div>
        </div>
    </div>

    {/* Scheduled learning time */}
    <div style={{
        backgroundColor: '#fff', borderRadius: '8px',
        border: '1px dashed #d1d5db', padding: '24px 32px',
        display: 'flex', alignItems: 'flex-start', gap: '16px',
    }}>
        <span style={{ fontSize: '36px' }}>⏰</span>
        <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1d1f', margin: '0 0 8px' }}>
                Scheduled learning time
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px', lineHeight: '1.5' }}>
                Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                    padding: '10px 20px', backgroundColor: '#fff',
                    color: '#a435f0', border: '2px solid #a435f0',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                }}>Get Started</button>
                <button style={{
                    padding: '10px 20px', backgroundColor: 'transparent',
                    color: '#a435f0', border: 'none',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                }}>Dismiss</button>
            </div>
        </div>
    </div>
</div>

                {/* Results count */}
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px' }}>
                    {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                </p>

                {filteredCourses.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '60px 20px',
                        backgroundColor: '#fff', borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                    }}>
                        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📚</span>
                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#1c1d1f', margin: '0 0 8px' }}>
                            No courses found
                        </p>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px' }}>
                            {filter === 'completed' ? "You haven't completed any courses yet. Keep learning!"
                                : filter === 'in-progress' ? "No courses in progress right now."
                                : filter === 'not-started' ? "All your courses have been started!"
                                : "You haven't enrolled in any courses yet."}
                        </p>
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            style={{
                                padding: '10px 24px', backgroundColor: '#a435f0',
                                color: '#fff', border: 'none', borderRadius: '6px',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            Browse courses
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredCourses.map(course => {
                            const percent = parseFloat(course.completion_percentage || 0);
                            const isStarted = percent > 0;
                            const isComplete = percent >= 100;
                            const enrollDate = new Date(course.enrolled_at).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                            });

                            return (
                                <div
                                    key={course.id}
                                    style={{
                                        display: 'flex', backgroundColor: '#fff',
                                        borderRadius: '8px', border: '1px solid #e5e7eb',
                                        overflow: 'hidden', cursor: 'pointer',
                                        transition: 'box-shadow 0.2s',
                                    }}
                                    onClick={() => navigate(`/student/course/${course.id}`)}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                >
                                    {/* Thumbnail */}
                                    <div style={{
                                        width: '260px', minHeight: '145px', flexShrink: 0,
                                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                    }}>
                                        <span style={{
                                            color: '#fff', fontSize: '14px', fontWeight: 600,
                                            textAlign: 'center', padding: '0 20px',
                                        }}>{course.title}</span>
                                        {/* Progress strip */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            height: '4px', backgroundColor: 'rgba(255,255,255,0.1)',
                                        }}>
                                            <div style={{
                                                height: '100%', width: `${percent}%`,
                                                backgroundColor: isComplete ? '#34d399' : '#a435f0',
                                            }} />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={{
                                        flex: 1, padding: '18px 24px',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                    }}>
                                        <p style={{
                                            fontSize: '16px', fontWeight: 700, color: '#1c1d1f',
                                            margin: '0 0 4px',
                                        }}>{course.title}</p>
                                        <p style={{
                                            fontSize: '12px', color: '#6b7280', margin: '0 0 4px',
                                        }}>Instructor Karim</p>
                                        <p style={{
                                            fontSize: '11px', color: '#9ca3af', margin: '0 0 12px',
                                        }}>Enrolled {enrollDate}</p>

                                        {/* Progress Bar */}
                                        <div style={{
                                            height: '6px', backgroundColor: '#e5e7eb',
                                            borderRadius: '3px', overflow: 'hidden', marginBottom: '6px',
                                            maxWidth: '400px',
                                        }}>
                                            <div style={{
                                                height: '100%', borderRadius: '3px',
                                                width: `${percent}%`,
                                                backgroundColor: isComplete ? '#34d399' : '#a435f0',
                                                transition: 'width 0.3s',
                                            }} />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                {course.completed_lectures} of {course.total_lectures} lectures
                                            </span>
                                            <span style={{
                                                fontSize: '13px', fontWeight: 700,
                                                color: isComplete ? '#059669' : percent > 0 ? '#a435f0' : '#9ca3af',
                                            }}>
                                                {percent.toFixed(0)}% complete
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right Action */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', padding: '0 24px',
                                        flexShrink: 0,
                                    }}>
                                        <button style={{
                                            padding: '10px 20px', fontSize: '13px',
                                            fontWeight: 700, cursor: 'pointer', borderRadius: '6px',
                                            whiteSpace: 'nowrap',
                                            ...(isComplete ? {
                                                backgroundColor: '#ecfdf5', color: '#059669',
                                                border: '1px solid #a7f3d0',
                                            } : isStarted ? {
                                                backgroundColor: '#a435f0', color: '#fff',
                                                border: 'none',
                                            } : {
                                                backgroundColor: '#fff', color: '#1c1d1f',
                                                border: '2px solid #1c1d1f',
                                            }),
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            {isComplete ? '✓ Completed' : isStarted ? 'Continue' : 'Start'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer2 />
        </div>
    );
}