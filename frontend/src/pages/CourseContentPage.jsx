/**
 * CourseContentPage
 * UX Features:
 * 1. Sidebar with lecture list + completion checkmarks
 * 2. Auto-advance to next lecture after video ends (5s countdown)
 * 3. Course progress bar (uses Arpita's /progress API)
 * 4. Sidebar scrolls to current lecture
 * 5. Instant checkmark update when lecture completes
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import studentAPI from '../services/api';
import CircularProgress from '../components/CircularProgress';

export default function CourseContentPage() {
    const { courseId } = useParams();
    const navigate     = useNavigate();

    const [lectures,        setLectures]        = useState([]);
    const [selectedIdx,     setSelectedIdx]      = useState(0);
    const [completedIds,    setCompletedIds]     = useState(new Set());
    const [materials,       setMaterials]        = useState([]);
    const [lectureProgress, setLectureProgress]  = useState({}); // {lectureId: percent}
    const [courseProgress,  setCourseProgress]   = useState(0);
    const [loading,         setLoading]          = useState(true);

    // Auto-advance countdown state
    const [countdown,       setCountdown]        = useState(null); // null = not active
    const [countdownTimer,  setCountdownTimer]   = useState(null);

    const selectedLecture = lectures[selectedIdx] || null;
    const user            = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId       = user.id;

    // ── Load lectures + progress ──────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await studentAPI.get(`/courses/${courseId}/lectures`);
                setLectures(res.data.lectures || []);
                setMaterials(res.data.materials || []);                
            } catch (err) {
                console.error('Could not load lectures:', err.message);
            }
            // Load per-lecture progress (completion %)
            try {
                const progRes = await studentAPI.get(`/progress/lectures/${courseId}`);
                const progMap = {};
                (progRes.data.lectures || []).forEach(l => {
                    progMap[l.lecture_id] = {
                        percent:     l.completion_percent || 0,
                        is_completed: l.is_completed || false,
                    };
                });
                setLectureProgress(progMap);
            } catch { /* Arpita's API — ok if not ready */ }            

            try {
                const progressRes = await studentAPI.get(`/progress/lectures/${courseId}`);
                const completed   = new Set(
                    (progressRes.data.lectures || [])
                        .filter(l => l.is_completed)
                        .map(l => l.lecture_id)
                );
                setCompletedIds(completed);
            } catch {
                // Arpita's API not ready yet — that's ok
            }

            try {
                const cpRes = await studentAPI.get(`/progress/${courseId}`);
                setCourseProgress(cpRes.data.completion_percentage || 0);
            } catch { /* ok */ }

            setLoading(false);
        };

        if (courseId) fetchData();
    }, [courseId]);

    // ── Called by VideoPlayer when a lecture completes (80% reached) ──────────
    const handleLectureComplete = useCallback((videoId) => {
        // Instantly update sidebar checkmark
        setCompletedIds(prev => new Set([...prev, parseInt(videoId)]));

        // Refresh course % from Arpita's API
        studentAPI.get(`/progress/${courseId}`)
            .then(res => setCourseProgress(res.data.completion_percentage || 0))
            .catch(() => {});

        // Start auto-advance countdown if not last lecture
        if (selectedIdx < lectures.length - 1) {
            startCountdown();
        }
    }, [selectedIdx, lectures.length, courseId]);

    // ── Auto-advance countdown (5s) ───────────────────────────────────────────
    const startCountdown = useCallback(() => {
        setCountdown(5);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCountdown(null);
                    setSelectedIdx(i => i + 1); // advance to next lecture
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
        setCountdownTimer(timer);
    }, []);

    const cancelCountdown = useCallback(() => {
        if (countdownTimer) clearInterval(countdownTimer);
        setCountdown(null);
        setCountdownTimer(null);
    }, [countdownTimer]);

    // Cleanup on unmount
    useEffect(() => () => { if (countdownTimer) clearInterval(countdownTimer); }, [countdownTimer]);

    if (loading) {
        return (
            <div style={styles.center}>
                <div style={styles.spinner} />
            </div>
        );
    }

    return (
        <div style={styles.layout}>
            {/* ── Left Sidebar ─────────────────────────────────────────────── */}
            <aside style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <button onClick={() => navigate('/student/dashboard')} style={styles.backBtn}>
                        ← Back
                    </button>
                    <h3 style={styles.sidebarTitle}>Course Content</h3>
                </div>

                {/* Lecture list — Section grouped like Udemy */}
                <div style={styles.lectureList}>
                    {(() => {
                        // Group lectures by section
                        const sections = {};
                        lectures.forEach((lecture, idx) => {
                            const key = lecture.section_id;
                            if (!sections[key]) {
                                sections[key] = {
                                    title:    lecture.section_title,
                                    position: lecture.section_position,
                                    lectures: [],
                                };
                            }
                            sections[key].lectures.push({ ...lecture, globalIdx: idx });
                        });

                        return Object.values(sections)
                            .sort((a, b) => a.position - b.position)
                            .map(section => (
                                <div key={section.title}>
                                    {/* Section header */}
                                    <div style={styles.sectionHeader}>
                                        <span style={styles.sectionIcon}>📂</span>
                                        <span style={styles.sectionTitle}>{section.title}</span>
                                        <span style={styles.sectionCount}>
                                            {section.lectures.length} lectures
                                        </span>
                                    </div>

                                    {/* Lectures under this section */}
                                    {section.lectures.map(lecture => {
                                        const isDone     = completedIds.has(lecture.id);
                                        const isSelected = lecture.globalIdx === selectedIdx;
                                        const prog       = lectureProgress[lecture.id];
                                        const percent    = prog?.percent || 0;
                                        const mins       = Math.floor((lecture.duration || 0) / 60);
                                        const secs       = Math.floor((lecture.duration || 0) % 60);
                                        const durationStr = mins > 0
                                            ? `${mins}m ${secs > 0 ? secs + 's' : ''}`
                                            : `${secs}s`;

                                        // Materials for this section
                                        const sectionMats = materials.filter(
                                            m => m.section_id === lecture.section_id
                                        );

                                        return (
                                            <div key={lecture.id}>
                                                {/* Lecture row */}
                                                <div
                                                    onClick={() => { cancelCountdown(); setSelectedIdx(lecture.globalIdx); }}
                                                    style={{
                                                        ...styles.lectureItem,
                                                        ...(isSelected ? styles.lectureItemActive : {}),
                                                    }}
                                                >
                                                    <CircularProgress
                                                        percent={percent}
                                                        isCompleted={isDone}
                                                        size={26}
                                                    />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={styles.lectureName}>{lecture.title}</p>
                                                        <p style={styles.lectureMeta}>
                                                            🕐 {durationStr}
                                                            {isDone && ' · ✓ Completed'}
                                                            {!isDone && percent > 0 && ` · ${Math.round(percent)}% watched`}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Materials — show only under selected lecture */}
                                                {isSelected && sectionMats.length > 0 && (
                                                    <div style={styles.materialsBox}>
                                                        <p style={styles.materialsTitle}>📎 Section Materials</p>
                                                        {sectionMats.map(mat => (
                                                            <a
                                                                key={mat.id}
                                                                href={mat.file_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                style={styles.materialLink}
                                                                download={mat.download_allowed}
                                                            >
                                                                <span style={styles.materialIcon}>
                                                                    {mat.file_type === 'pdf'  ? '📄' :
                                                                     mat.file_type === 'zip'  ? '📦' :
                                                                     mat.file_type === 'ppt' || mat.file_type === 'pptx' ? '📊' : '📁'}
                                                                </span>
                                                                <span style={styles.materialName}>{mat.title}</span>
                                                                {mat.download_allowed && (
                                                                    <span style={styles.downloadBadge}>↓ Download</span>
                                                                )}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ));
                    })()}
                </div>


                {/* Course progress bar */}
                <div style={styles.progressBox}>
                    <div style={styles.progressTopRow}>
                        <span style={styles.progressLabel}>Your progress</span>
                        <span style={styles.progressPct}>{Math.round(courseProgress)}%</span>
                    </div>
                    <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${courseProgress}%` }} />
                    </div>
                    <p style={styles.progressSub}>
                        {completedIds.size} / {lectures.length} lectures completed
                    </p>
                </div>
            </aside>

            {/* ── Right Panel ──────────────────────────────────────────────── */}
            <main style={styles.main}>
                {selectedLecture ? (
                    <div style={{ position: 'relative' }}>
                        <VideoPlayer
                            key={selectedLecture.id}
                            videoIdProp={selectedLecture.id}
                            courseIdProp={courseId}
                            studentIdProp={studentId}
                            onComplete={() => handleLectureComplete(selectedLecture.id)}
                            onNextLecture={
                                selectedIdx < lectures.length - 1
                                    ? () => { cancelCountdown(); setSelectedIdx(i => i + 1); }
                                    : null
                            }
                        />

                        {/* Auto-advance banner */}
                        {countdown !== null && (
                            <div style={styles.advanceBanner}>
                                <span>
                                    🎉 Lecture complete! Next lecture in <strong>{countdown}s</strong>
                                </span>
                                <div style={styles.advanceBtns}>
                                    <button
                                        onClick={() => { cancelCountdown(); setSelectedIdx(i => i + 1); }}
                                        style={styles.nextBtn}
                                    >
                                        Next Now →
                                    </button>
                                    <button onClick={cancelCountdown} style={styles.cancelBtn}>
                                        Stay here
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={styles.center}>
                        <p style={{ color: '#9ca3af' }}>Select a lecture to start watching</p>
                    </div>
                )}
            </main>
        </div>
    );
}

const styles = {
    layout: {
        display:         'flex',
        height:          '100vh',
        backgroundColor: '#111827',
        overflow:        'hidden',
    },
    sidebar: {
        width:           '300px',
        backgroundColor: '#1f2937',
        borderRight:     '1px solid #374151',
        display:         'flex',
        flexDirection:   'column',
        overflowY:       'auto',
        flexShrink:      0,
    },
    sidebarHeader: {
        padding:      '1rem',
        borderBottom: '1px solid #374151',
    },
    backBtn: {
        background:   'none',
        border:       'none',
        color:        '#9ca3af',
        cursor:       'pointer',
        fontSize:     '13px',
        marginBottom: '6px',
        padding:      0,
    },
    sidebarTitle: {
        color:  '#f9fafb',
        margin: 0,
        fontSize: '16px',
    },
    lectureList: {
        flex:    1,
        padding: '4px 0',
    },
    lectureItem: {
        display:      'flex',
        alignItems:   'center',
        gap:          '10px',
        padding:      '10px 1rem',
        cursor:       'pointer',
        borderBottom: '1px solid #374151',
        transition:   'background 0.15s',
    },
    lectureItemActive: {
        backgroundColor: '#374151',
        borderLeft:      '3px solid #7c3aed',
    },
    checkDone: {
        width:           '22px',
        height:          '22px',
        borderRadius:    '50%',
        backgroundColor: '#10b981',
        color:           '#fff',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        fontSize:        '12px',
        fontWeight:      '700',
        flexShrink:      0,
    },
    checkEmpty: {
        width:          '22px',
        height:         '22px',
        borderRadius:   '50%',
        border:         '1px solid #6b7280',
        color:          '#9ca3af',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '11px',
        flexShrink:     0,
    },
    lectureName: {
        color:    '#f3f4f6',
        fontSize: '13px',
        margin:   0,
    },
    lectureMeta: {
        color:    '#9ca3af',
        fontSize: '11px',
        margin:   0,
    },
    progressBox: {
        padding:   '1rem',
        borderTop: '1px solid #374151',
    },
    progressTopRow: {
        display:        'flex',
        justifyContent: 'space-between',
        marginBottom:   '6px',
    },
    progressLabel: {
        color:     '#f9fafb',
        fontSize:  '13px',
        fontWeight:'600',
    },
    progressPct: {
        color:     '#7c3aed',
        fontSize:  '13px',
        fontWeight:'700',
    },
    progressTrack: {
        height:          '8px',
        backgroundColor: '#374151',
        borderRadius:    '4px',
    },
    progressFill: {
        height:          '100%',
        backgroundColor: '#7c3aed',
        borderRadius:    '4px',
        transition:      'width 0.6s ease',
    },
    progressSub: {
        color:    '#9ca3af',
        fontSize: '11px',
        margin:   '4px 0 0',
    },
    main: {
        flex:      1,
        overflowY: 'auto',
        position:  'relative',
    },
    advanceBanner: {
        position:        'absolute',
        bottom:          '20px',
        left:            '50%',
        transform:       'translateX(-50%)',
        backgroundColor: '#1f2937',
        border:          '1px solid #7c3aed',
        borderRadius:    '10px',
        padding:         '12px 20px',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        gap:             '10px',
        color:           '#f9fafb',
        fontSize:        '14px',
        boxShadow:       '0 4px 20px rgba(0,0,0,0.5)',
        whiteSpace:      'nowrap',
        zIndex:          10,
    },
    advanceBtns: {
        display: 'flex',
        gap:     '8px',
    },
    nextBtn: {
        padding:         '6px 16px',
        backgroundColor: '#7c3aed',
        color:           '#fff',
        border:          'none',
        borderRadius:    '6px',
        fontSize:        '13px',
        fontWeight:      '600',
        cursor:          'pointer',
    },
    cancelBtn: {
        padding:         '6px 16px',
        backgroundColor: 'transparent',
        color:           '#9ca3af',
        border:          '1px solid #4b5563',
        borderRadius:    '6px',
        fontSize:        '13px',
        cursor:          'pointer',
    },
    center: {
        display:        'flex',
        justifyContent: 'center',
        alignItems:     'center',
        height:         '100%',
        backgroundColor:'#111827',
    },
    spinner: {
        width:       '36px',
        height:      '36px',
        border:      '4px solid rgba(255,255,255,0.15)',
        borderTop:   '4px solid #7c3aed',
        borderRadius:'50%',
        animation:   'spin 0.8s linear infinite',
    },
    sectionTitle: {
        color: '#f3f4f6',
        fontSize: '14px',
    },
    materialsTitle: {
        color: '#9ca3af',
        fontSize: '11px',
    },
    materialsBox:  { 
        backgroundColor: '#250229', 
        padding: '8px 1rem 12px', 
        borderBottom: '1px solid #cad0d9' 
    },
    materialLink: { 
        display: 'block',        
        color: '#7c3aed', 
        fontSize: '12px', 
        padding: '5px 0',       
        textDecoration: 'none', 
        cursor: 'pointer',
        whiteSpace: 'nowrap',   
        overflow: 'hidden',
        textOverflow: 'ellipsis' 
    },    
};
