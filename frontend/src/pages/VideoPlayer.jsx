/**
 * VideoPlayer — Base Version (Phase 1)
 * Essential only:
 * - Load Cloudinary video URL
 * - Resume from last position
 * - Play/Pause + Speed
 * - ProgressBar with seek
 * - Save position every 10s + on pause
 */

import { useRef, useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import useVideoProgress from '../hooks/useVideoProgress';
import studentAPI from '../services/api';



export default function VideoPlayer({ videoIdProp, courseIdProp, studentIdProp, onComplete }) {
    const user      = JSON.parse(localStorage.getItem('user') || '{}');
    const videoId   = videoIdProp;
    const courseId  = courseIdProp;
    const studentId = studentIdProp || user.id;

    const videoRef  = useRef(null);

    const [videoData,   setVideoData]   = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration,    setDuration]    = useState(0);
    const [isPlaying,   setIsPlaying]   = useState(false);
    const [speed,       setSpeed]       = useState(1);
    const [error,       setError]       = useState('');
    const [pageLoading, setPageLoading] = useState(true);

    const { lastPosition, isCompleted, loading: progressLoading,
            startTracking, stopTracking }
        = useVideoProgress({ videoId, courseId, studentId });

    // Load video URL
    useEffect(() => {
        if (!videoId) return;
        const fetchVideo = async () => {
            try {
                const res = await studentAPI.get(`/video/${videoId}/url`);
                setVideoData(res.data);
            } catch (err) {
                setError('Could not load video.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchVideo();
    }, [videoId]);

    // Resume from last position
    const handleLoadedMetadata = () => {
        const v = videoRef.current;
        if (!v) return;
        setDuration(v.duration);
        if (lastPosition > 0 && lastPosition < v.duration - 5) {
            v.currentTime = lastPosition;
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    };

    const handlePlay = () => {
        setIsPlaying(true);
        startTracking(
            () => videoRef.current,
            () => { if (onComplete) onComplete(); }
        );
    };

    const handlePause = () => {
        setIsPlaying(false);
        stopTracking(videoRef.current);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        stopTracking(videoRef.current);
    };

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        isPlaying ? v.pause() : v.play();
    };

    const handleSeek = (newTime) => {
        if (videoRef.current) videoRef.current.currentTime = newTime;
    };

    const handleSpeedChange = (e) => {
        const val = parseFloat(e.target.value);
        setSpeed(val);
        if (videoRef.current) videoRef.current.playbackRate = val;
    };

    if (pageLoading || progressLoading) {
        return <div style={styles.center}><p style={{ color: '#9ca3af' }}>Loading...</p></div>;
    }

    if (error) {
        return <div style={styles.center}><p style={{ color: '#ef4444' }}>{error}</p></div>;
    }

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>{videoData?.title || 'Video Lecture'}</h2>

            <div style={styles.videoWrapper}>
                <video
                    ref={videoRef}
                    src={videoData?.url}
                    style={styles.video}
                    crossOrigin="anonymous"
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                />
            </div>

            <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                isCompleted={isCompleted}
            />

            <div style={styles.controls}>
                <button onClick={togglePlay} style={styles.playBtn}>
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <label style={styles.label}>Speed</label>
                <select value={speed} onChange={handleSpeedChange} style={styles.select}>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                        <option key={s} value={s}>{s}×</option>
                    ))}
                </select>
            </div>

            {lastPosition > 0 && (
                <p style={styles.resumeNote}>
                    ↩ Resumed from {Math.floor(lastPosition / 60)}m {Math.floor(lastPosition % 60)}s
                </p>
            )}
        </div>
    );
}

const styles = {
    page:         { maxWidth: '900px', margin: '0 auto', padding: '1.5rem', backgroundColor: '#111827', minHeight: '100vh', color: '#f9fafb' },
    title:        { fontSize: '1.3rem', marginBottom: '1rem' },
    videoWrapper: { backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' },
    video:        { width: '100%', display: 'block', maxHeight: '480px' },
    controls:     { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' },
    playBtn:      { padding: '8px 20px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    label:        { color: '#9ca3af', fontSize: '13px' },
    select:       { backgroundColor: '#1f2937', color: '#f9fafb', border: '1px solid #4b5563', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', cursor: 'pointer' },
    resumeNote:   { color: '#9ca3af', fontSize: '12px', marginTop: '8px' },
    center:       { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', backgroundColor: '#111827' },
};
