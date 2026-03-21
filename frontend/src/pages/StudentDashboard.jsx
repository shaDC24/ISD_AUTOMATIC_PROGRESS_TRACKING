import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentAPI from '../services/api';
import Navbar from '../components/Navbar';

import Footer1 from '../components/Footer1';
import Footer2 from '../components/Footer2';


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
    const avgProgress = courses.length > 0
        ? (courses.reduce((sum, c) => sum + parseFloat(c.completion_percentage || 0), 0) / courses.length).toFixed(1)
        : 0;

    const lastAccessed = courses.length > 0
        ? courses.reduce((latest, c) => {
            const d = new Date(c.enrolled_at);
            return d > new Date(latest.enrolled_at) ? c : latest;
        }, courses[0])
        : null;

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

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
        <div style={{ minHeight: '100vh', backgroundColor: '#e6e6e6' }}>
            <Navbar />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 48px' }}>

                {/* Welcome */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    marginBottom: '28px',
                }}>
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        backgroundColor: '#1c1d1f', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '20px', fontWeight: 700,
                    }}>{initials}</div>
                    <h1 style={{
                        fontSize: '28px', fontWeight: 700, color: '#1c1d1f', margin: 0,
                    }}>Welcome Back, {user?.name?.split(' ').pop() || user?.name}</h1>
                </div>

                {/* Hero Banner */}
                <div style={{
                    backgroundImage: 'url(https://t3.ftcdn.net/jpg/06/36/82/78/360_F_636827881_ttVgOQbowRIKW4gaeQHnEjNM45eLeY5v.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px', marginBottom: '36px',
                    position: 'relative', overflow: 'hidden', height: '500px',
                    display: 'flex', alignItems: 'center',
                }}>
                    {/* Text Card */}
                    <div style={{
                        backgroundColor: 'rgba(28,29,31,0.88)', borderRadius: '8px',
                        padding: '32px 36px', marginLeft: '48px', maxWidth: '380px',
                        position: 'relative', zIndex: 1,
                    }}>
                        <h2 style={{
                            fontSize: '28px', fontWeight: 700, color: '#fff',
                            margin: '0 0 12px', lineHeight: '1.2',
                        }}>Move forward on your goals</h2>
                        <p style={{
                            fontSize: '14px', color: 'rgba(255,255,255,0.75)',
                            margin: '0 0 20px', lineHeight: '1.6',
                        }}>
                            Track your progress across all courses. Complete lectures to unlock milestones.
                        </p>
                        {lastAccessed && (
                            <button
                                onClick={() => navigate(`/student/course/${lastAccessed.id}`)}
                                style={{
                                    padding: '12px 24px', backgroundColor: '#fff',
                                    color: '#1c1d1f', border: 'none', fontSize: '15px',
                                    fontWeight: 700, cursor: 'pointer', borderRadius: '4px',
                                }}
                            >
                                Continue learning
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px', marginBottom: '40px',
                }}>
                    {[
                        { label: 'ENROLLED COURSES', value: courses.length, icon: '📚', accent: '#020202' },
                        { label: 'COMPLETED', value: completedCount, icon: '✅', accent: '#107008' },
                        { label: 'IN PROGRESS', value: inProgressCount, icon: '📖', accent: '#11968f' },
                        { label: 'AVERAGE PROGRESS', value: `${avgProgress}%`, icon: '📊', accent: '#162be2' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: '24px', borderRadius: '12px',
                            backgroundColor: '#ded2e4', border: '1.5px solid #91209b',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            cursor: 'default',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <p style={{
                                    fontSize: '11px', color: '#6b7280', margin: 0,
                                    fontWeight: 700, letterSpacing: '0.8px',
                                }}>{stat.label}</p>
                                <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                            </div>
                            <p style={{
                                fontSize: '36px', fontWeight: 700, color: stat.accent, margin: 0,
                            }}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Let's start learning */}
                <h2 style={{
                    fontSize: '24px', fontWeight: 700, color: '#1c1d1f',
                    margin: '0 0 4px',
                }}>Let's start learning</h2>
                <p style={{
                    fontSize: '14px', color: '#6b7280', margin: '0 0 22px',
                }}>Your enrolled courses with progress tracking</p>

                {/* Course Cards */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px', marginBottom: '48px',
                }}>
                    {courses.map(course => {
                        const percent = parseFloat(course.completion_percentage || 0);
                        const isStarted = percent > 0;
                        const isComplete = percent >= 100;

                        return (
                            <div
                                key={course.id}
                                style={{
                                    border: '1px solid #e5e7eb', overflow: 'hidden',
                                    borderRadius: '12px', backgroundColor: '#fff',
                                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onClick={() => navigate(`/student/course/${course.id}`)}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                            >
                                <div style={{
                                    height: '140px',
                                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative',
                                }}>
                                    <span style={{
                                        color: '#fff', fontSize: '16px', fontWeight: 600,
                                        textAlign: 'center', padding: '0 28px',
                                    }}>{course.title}</span>
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0,
                                        height: '4px', backgroundColor: 'rgba(255,255,255,0.1)',
                                    }}>
                                        <div style={{
                                            height: '100%', width: `${percent}%`,
                                            backgroundColor: isComplete ? '#34d399' : '#a435f0',
                                            transition: 'width 0.4s',
                                        }} />
                                    </div>
                                </div>

                                <div style={{ padding: '18px 22px' }}>
                                    <p style={{
                                        fontSize: '17px', fontWeight: 700, color: '#1c1d1f',
                                        margin: '0 0 4px',
                                    }}>{course.title}</p>
                                    <p style={{
                                        fontSize: '13px', color: '#6b7280', margin: '0 0 16px',
                                    }}>Instructor Karim</p>

                                    <div style={{
                                        height: '8px', backgroundColor: '#e5e7eb',
                                        overflow: 'hidden', marginBottom: '8px',
                                        borderRadius: '4px',
                                    }}>
                                        <div style={{
                                            height: '100%', width: `${percent}%`,
                                            backgroundColor: isComplete ? '#34d399' : '#a435f0',
                                            transition: 'width 0.4s', borderRadius: '4px',
                                        }} />
                                    </div>

                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        marginBottom: '16px',
                                    }}>
                                        <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                            {course.completed_lectures} of {course.total_lectures} lectures
                                        </span>
                                        <span style={{
                                            fontSize: '14px', fontWeight: 700,
                                            color: isComplete ? '#059669' : percent > 0 ? '#a435f0' : '#9ca3af',
                                        }}>
                                            {percent.toFixed(0)}% complete
                                        </span>
                                    </div>

                                    <button style={{
                                        width: '100%', padding: '12px',
                                        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                                        borderRadius: '8px',
                                        ...(isComplete ? {
                                            backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0',
                                        } : isStarted ? {
                                            backgroundColor: '#a435f0', color: '#fff', border: 'none',
                                        } : {
                                            backgroundColor: '#fff', color: '#1c1d1f',
                                            border: '2px solid #1c1d1f',
                                        }),
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        {isComplete ? 'Completed' : isStarted ? 'Continue learning' : 'Start course'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Milestones */}
                {/* Milestones */}
                <h2 style={{
                    fontSize: '24px', fontWeight: 700, color: '#1c1d1f',
                    margin: '0 0 4px',
                }}>Your milestones</h2>
                <p style={{
                    fontSize: '14px', color: '#6b7280', margin: '0 0 22px',
                }}>Complete courses to unlock achievements</p>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px', marginBottom: '48px',
                }}>
                    {[
                        { pct: 25, label: 'Getting started', icon: '🚀', lockedIcon: '🎯', color: '#a435f0', lightColor: '#f3e8ff', midColor: '#e9d5ff', darkBg: '#7c3aed' },
                        { pct: 50, label: 'Halfway there', icon: '🔥', lockedIcon: '📘', color: '#2563eb', lightColor: '#e0f2fe', midColor: '#bfdbfe', darkBg: '#1d4ed8' },
                        { pct: 75, label: 'Almost done', icon: '⭐', lockedIcon: '🎓', color: '#d97706', lightColor: '#fef9c3', midColor: '#fde68a', darkBg: '#b45309' },
                        { pct: 100, label: 'Course master', icon: '🏆', lockedIcon: '👑', color: '#059669', lightColor: '#d1fae5', midColor: '#a7f3d0', darkBg: '#047857' },
                    ].map((m) => {
                        const achieved = courses.some(c => parseFloat(c.completion_percentage) >= m.pct);
                        return (
                            <div key={m.pct} style={{
                                textAlign: 'center', borderRadius: '16px',
                                backgroundColor: '#fff', border: `1.5px solid #e5e7eb`,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default', overflow: 'hidden',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                            >
                                {/* Top colored strip */}
                                <div style={{
                                    height: '6px',
                                    background: achieved
                                        ? `linear-gradient(90deg, ${m.color}, ${m.midColor})`
                                        : '#e5e7eb',
                                }} />

                                <div style={{ padding: '24px 16px 28px' }}>
                                    {/* Circle icon */}
                                    <div style={{
                                        width: '72px', height: '72px', borderRadius: '50%',
                                        background: achieved
                                            ? `linear-gradient(135deg, ${m.lightColor}, ${m.midColor})`
                                            : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 16px', fontSize: '32px',
                                        border: `3px solid ${achieved ? m.midColor : '#e5e7eb'}`,
                                    }}>
                                        {achieved ? m.icon : m.lockedIcon}
                                    </div>

                                    {/* Percentage */}
                                    <p style={{
                                        fontSize: '34px', fontWeight: 800,
                                        color: achieved ? m.color : '#1c1d1f',
                                        margin: '0 0 4px',
                                    }}>{m.pct}%</p>

                                    {/* Label */}
                                    <p style={{
                                        fontSize: '14px', fontWeight: 600,
                                        color: achieved ? m.color : '#6b7280',
                                        margin: '0 0 6px',
                                    }}>{m.label}</p>

                                    {/* Progress mini bar */}
                                    <div style={{
                                        width: '80%', height: '4px', backgroundColor: '#e5e7eb',
                                        borderRadius: '2px', margin: '0 auto 14px', overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            height: '100%', borderRadius: '2px',
                                            width: achieved ? '100%' : `${Math.min(parseFloat(avgProgress) / m.pct * 100, 100)}%`,
                                            backgroundColor: achieved ? m.color : '#d1d5db',
                                            transition: 'width 0.5s',
                                        }} />
                                    </div>

                                    {/* Badge */}
                                    <span style={{
                                        display: 'inline-block', padding: '6px 20px',
                                        fontSize: '11px', fontWeight: 700, borderRadius: '20px',
                                        letterSpacing: '0.5px',
                                        ...(achieved ? {
                                            backgroundColor: m.color, color: '#fff',
                                        } : {
                                            backgroundColor: '#f3f4f6', color: '#9ca3af',
                                            border: '1px solid #e5e7eb',
                                        }),
                                    }}>
                                        {achieved ? '✓ UNLOCKED' : `${m.pct - Math.round(parseFloat(avgProgress))}% to go`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

                     <Footer1 />
            <Footer2 />
        </div>
        
    );
}