/**
 * VideoPlayer — Base Version (Phase 1)
 * Essential only:
 * - Load Cloudinary video URL
 * - Resume from last position
 * - Play/Pause + Speed
 * - ProgressBar with seek
 * - Save position every 10s + on pause
 * VideoPlayer v1 — Keyboard Shortcuts
 * Added: Space/K=play, ←→=seek 10s, ↑↓=volume, M=mute, F=fullscreen
  * VideoPlayer v2 — 100% Completion Popup + Buffering Spinner
 * Added on top of v1:
 * - 100% (onEnded) → shows "Lecture Complete!" popup
 * - 80% → isCompleted=true silently (sidebar updates, no popup)
 * - Buffering spinner overlay
 */


import { useRef, useState, useEffect, useCallback } from 'react';
import ProgressBar from '../components/ProgressBar';
import useVideoProgress from '../hooks/useVideoProgress';
import studentAPI from '../services/api';


export default function VideoPlayer({ videoIdProp, courseIdProp, studentIdProp, onComplete }) {
    const user      = JSON.parse(localStorage.getItem('user') || '{}');
    const videoId   = videoIdProp;
    const courseId  = courseIdProp;
    const studentId = studentIdProp || user.id;

    const videoRef   = useRef(null);
    const wrapperRef = useRef(null);

    const [videoData,    setVideoData]    = useState(null);
    const [currentTime,  setCurrentTime]  = useState(0);
    const [duration,     setDuration]     = useState(0);
    const [isPlaying,    setIsPlaying]    = useState(false);
    const [speed,        setSpeed]        = useState(1);
    const [isMuted,      setIsMuted]      = useState(false);
    const [isBuffering,  setIsBuffering]  = useState(false);
    const [showPopup,    setShowPopup]    = useState(false); // 100% popup
    const [error,        setError]        = useState('');
    const [pageLoading,  setPageLoading]  = useState(true);

    const { lastPosition, isCompleted, loading: progressLoading,
            startTracking, stopTracking }
        = useVideoProgress({ videoId, courseId, studentId });

    useEffect(() => {
        if (!videoId) return;
        const fetchVideo = async () => {
            try {
                const res = await studentAPI.get(`/video/${videoId}/url`);
                setVideoData(res.data);
            } catch { setError('Could not load video.'); }
            finally { setPageLoading(false); }
        };
        fetchVideo();
    }, [videoId]);

    const handleLoadedMetadata = () => {
        const v = videoRef.current;
        if (!v) return;
        setDuration(v.duration);
        if (lastPosition > 0 && lastPosition < v.duration - 5)
            v.currentTime = lastPosition;
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    };

    const handlePlay  = () => {
        setIsPlaying(true);
        // onSilentComplete → sidebar update only (no popup)
        startTracking(() => videoRef.current, () => { if (onComplete) onComplete(); });
    };
    const handlePause = () => { setIsPlaying(false); stopTracking(videoRef.current); };

    // 100% → video ended → show popup 🎉
    const handleEnded = () => {
        setIsPlaying(false);
        stopTracking(videoRef.current);
        setShowPopup(true); // ← popup only on 100%
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const togglePlay = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        isPlaying ? v.pause() : v.play();
    }, [isPlaying]);

    const seek = useCallback((delta) => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = Math.max(0, Math.min(v.currentTime + delta, v.duration));
    }, []);

    const toggleMute = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setIsMuted(v.muted);
    }, []);

    const changeVolume = useCallback((delta) => {
        const v = videoRef.current;
        if (!v) return;
        const newVol = Math.max(0, Math.min(v.volume + delta, 1));
        v.volume = newVol;
        setVolume(newVol);              // ← React state update
        setIsMuted(newVol === 0);       // ← mute state update
        if (newVol > 0) v.muted = false; // ← unmute if volume increases
    }, []);

    const toggleFullscreen = useCallback(() => {
        const el = wrapperRef.current;
        if (!el) return;
        if (!document.fullscreenElement) el.requestFullscreen?.();
        else document.exitFullscreen?.();
    }, []);

    // ── Keyboard shortcuts ────────────────────────────────────────────────────
    useEffect(() => {
        const handleKey = (e) => {
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
            switch (e.key) {
                case ' ': case 'k': e.preventDefault(); togglePlay(); break;
                case 'ArrowLeft':   e.preventDefault(); seek(-10);    break;
                case 'ArrowRight':  e.preventDefault(); seek(10);     break;
                case 'ArrowUp':     e.preventDefault(); changeVolume(0.1);  break;
                case 'ArrowDown':   e.preventDefault(); changeVolume(-0.1); break;
                case 'm': case 'M': e.preventDefault(); toggleMute();       break;
                case 'f': case 'F': e.preventDefault(); toggleFullscreen();  break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [togglePlay, seek, toggleMute, toggleFullscreen, changeVolume]);

    if (pageLoading || progressLoading)
        return <div style={styles.center}><div style={styles.spinner} /></div>;
    if (error)
        return <div style={styles.center}><p style={{ color: '#ef4444' }}>{error}</p></div>;

    return (
        <div style={styles.page}>
            <h2 style={styles.title}>{videoData?.title || 'Video Lecture'}</h2>

            <div ref={wrapperRef} style={styles.videoWrapper}>
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
                    onWaiting={handleWaiting}
                    onCanPlay={handleCanPlay}

                />
                {/* Buffering spinner */}
                {isBuffering && (
                    <div style={styles.bufferOverlay}>
                        <div style={styles.spinner} />
                    </div>
                )}

                {/* 100% Completion Popup */}
                {showPopup && (
                    <div style={styles.popupOverlay}>
                        <div style={styles.popup}>
                            <div style={styles.popupEmoji}>🎉</div>
                            <h3 style={styles.popupTitle}>Lecture Complete!</h3>
                            <p style={styles.popupText}>You have finished this lecture.</p>
                            <button
                                onClick={() => setShowPopup(false)}
                                style={styles.popupBtn}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ProgressBar currentTime={currentTime} duration={duration}
                onSeek={(t) => { if (videoRef.current) videoRef.current.currentTime = t; }}
                isCompleted={isCompleted} />

            <div style={styles.controls}>
                <button onClick={togglePlay} style={styles.playBtn}>
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <div style={{ flex: 1 }} />
                <label style={styles.label}>Speed</label>
                <select value={speed}
                    onChange={(e) => { const v = parseFloat(e.target.value); setSpeed(v); if (videoRef.current) videoRef.current.playbackRate = v; }}
                    style={styles.select}>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => <option key={s} value={s}>{s}×</option>)}
                </select>
                <button onClick={toggleFullscreen} style={styles.iconBtn} title="Fullscreen (F)">⛶</button>
            </div>

            {/* Keyboard hint */}
            <div style={styles.shortcuts}>
                <span>⌨</span>
                <code>Space</code> play/pause
                <code>← →</code> seek 10s
                <code>↑ ↓</code> volume
                <code>M</code> mute
                <code>F</code> fullscreen
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
    videoWrapper: { position: 'relative', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' },
    video:        { width: '100%', display: 'block', maxHeight: '480px' },
    bufferOverlay:{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
    spinner:      { width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.2)', borderTop: '4px solid #7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    popupOverlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    popup:        { backgroundColor: '#1f2937', border: '1px solid #7c3aed', borderRadius: '16px', padding: '2rem', textAlign: 'center', minWidth: '280px' },
    popupEmoji:   { fontSize: '48px', marginBottom: '0.5rem' },
    popupTitle:   { color: '#f9fafb', fontSize: '1.4rem', fontWeight: '700', margin: '0 0 0.5rem' },
    popupText:    { color: '#9ca3af', fontSize: '14px', margin: '0 0 1.5rem' },
    popupBtn:     { padding: '10px 28px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
    controls:     { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' },
    playBtn:      { padding: '8px 16px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '18px', cursor: 'pointer' },
    iconBtn:      { background: 'none', border: 'none', color: '#d1d5db', fontSize: '18px', cursor: 'pointer', padding: '4px' },
    label:        { color: '#9ca3af', fontSize: '12px' },
    select:       { backgroundColor: '#1f2937', color: '#f9fafb', border: '1px solid #4b5563', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' },
    shortcuts:    { marginTop: '10px', fontSize: '11px', color: '#6b7280', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' },
    resumeNote:   { color: '#9ca3af', fontSize: '12px', marginTop: '8px' },
    center:       { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', backgroundColor: '#111827' },
};
