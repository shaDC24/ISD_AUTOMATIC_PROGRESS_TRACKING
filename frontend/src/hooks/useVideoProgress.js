/**
 * useVideoProgress
 * Features:
 * 1. Resume from last position on load
 * 2. Save position every 10s while playing
 * 3. Save immediately on pause
 * 4. Save on tab close (beforeunload)
 * 5. Offline fallback to localStorage
 * 6. Notify /progress/complete at 80% threshold
 * 
 * Logic:
 * - 80% watched → silently mark complete (Arpita's API) + update sidebar instantly
 * - 100% (video ended) → VideoPlayer shows popup (handled outside hook)
 * - Save every 10s + on pause + on tab close
 */


import { useState, useEffect, useRef, useCallback } from 'react';
import studentAPI from '../services/api';
export default function useVideoProgress({ videoId, courseId, studentId }) {
    const [lastPosition, setLastPosition] = useState(0);
    const [isCompleted,  setIsCompleted]  = useState(false);
    const [loading,      setLoading]      = useState(true);

    const intervalRef      = useRef(null);
    const hasNotified80Ref = useRef(false);
    const videoElRef       = useRef(null);

    // ── 1. Fetch last position on mount ──────────────────────────────────────
    useEffect(() => {
        if (!videoId) return;
        const fetch = async () => {
            try {
                const res = await studentAPI.get(`/video/last-position/${videoId}`);
                setLastPosition(res.data.position || 0);
                setIsCompleted(res.data.is_completed || false);
                if (res.data.is_completed) hasNotified80Ref.current = true;
            } catch {
                const saved = localStorage.getItem(`vp_${videoId}`);
                if (saved) setLastPosition(parseFloat(saved));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [videoId]);

    // ── 2. Core save function ─────────────────────────────────────────────────
    const savePosition = useCallback(async (video) => {
        if (!video || !video.duration || video.duration === 0) return null;
        const position = video.currentTime;
        const duration = video.duration;

        localStorage.setItem(`vp_${videoId}`, position.toString());

        try {
            await studentAPI.post('/video/watch-position', {
                lectureId: videoId, position, duration,
            });
        } catch { /* offline — localStorage saved */ }

        // 80% threshold → mark complete SILENTLY (no popup here)
        if (!hasNotified80Ref.current && position / duration >= 0.8) {
            hasNotified80Ref.current = true;
            try {
                const percentage = Math.round((position / duration) * 100);
                await studentAPI.post('/progress/complete', {
                    lectureId: videoId, courseId, percentage,
                });
                setIsCompleted(true); // ← sidebar checkmark updates instantly ✅
                localStorage.removeItem(`vp_${videoId}`);
                return 'completed'; // signal to CourseContentPage (not for popup)
            } catch {
                hasNotified80Ref.current = false;
            }
        }
        return null;
    }, [videoId, courseId]);

    // ── 3. Start 10s interval ─────────────────────────────────────────────────
    const startTracking = useCallback((getVideoEl, onSilentComplete) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(async () => {
            const video = getVideoEl();
            if (!video || video.paused) return;
            videoElRef.current = video;
            const result = await savePosition(video);
            // onSilentComplete is for sidebar update — NOT for popup
            if (result === 'completed' && onSilentComplete) onSilentComplete();
        }, 10000);
    }, [savePosition]);

    // ── 4. Stop + save immediately on pause ──────────────────────────────────
    const stopTracking = useCallback((video) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (video) savePosition(video);
    }, [savePosition]);

    // ── 5. Save on tab close ─────────────────────────────────────────────────
    useEffect(() => {
        const handleBeforeUnload = () => {
            const video = videoElRef.current;
            if (!video || video.currentTime === 0) return;
            localStorage.setItem(`vp_${videoId}`, video.currentTime.toString());
            const base = import.meta.env.VITE_STUDENT_API_URL || 'http://localhost:5000/api';
            try {
                navigator.sendBeacon(
                    `${base}/video/watch-position`,
                    new Blob(
                        [JSON.stringify({ lectureId: videoId, position: video.currentTime, duration: video.duration })],
                        { type: 'application/json' }
                    )
                );
            } catch { /* localStorage saved */ }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [videoId]);

    useEffect(() => () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    return { lastPosition, isCompleted, loading, startTracking, stopTracking };
}
