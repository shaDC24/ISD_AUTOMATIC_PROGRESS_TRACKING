import { useRef, useState } from 'react';
export default function ProgressBar({ currentTime, duration, onSeek, isCompleted }) {
    const barRef       = useRef(null);
    const [hoverTime,  setHoverTime]  = useState(null);
    const [hoverX,     setHoverX]     = useState(0);
    const [thumbHover, setThumbHover] = useState(false);

    const percentage  = duration > 0 ? (currentTime / duration) * 100 : 0;
    const markerAt80  = 80; // percent

    const formatTime = (secs) => {
        if (!secs || isNaN(secs)) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleClick = (e) => {
        if (!barRef.current || !duration) return;
        const rect    = barRef.current.getBoundingClientRect();
        const clickX  = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        onSeek(Math.max(0, Math.min(newTime, duration)));
    };

    const handleMouseMove = (e) => {
        if (!barRef.current || !duration) return;
        const rect  = barRef.current.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const pct   = x / rect.width;
        const time  = pct * duration;
        setHoverTime(Math.max(0, Math.min(time, duration)));
        setHoverX(x);
    };

    const handleMouseLeave = () => {
        setHoverTime(null);
        setHoverX(0);
    };

    const fillColor  = isCompleted ? '#10b981' : '#7c3aed';
    const thumbColor = isCompleted ? '#10b981' : '#7c3aed';
    const passed80   = percentage >= markerAt80;

    return (
        <div style={styles.wrapper}>
            <span style={styles.time}>{formatTime(currentTime)}</span>

            {/* Track */}
            <div style={styles.trackOuter}>
                <div
                    ref={barRef}
                    style={styles.track}
                    onClick={handleClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={() => setThumbHover(true)}
                >
                    {/* Fill */}
                    <div style={{ ...styles.fill, width: `${percentage}%`, backgroundColor: fillColor }} />

                    {/* 80% marker line */}
                    <div
                        style={{
                            ...styles.marker80,
                            backgroundColor: passed80 ? '#10b981' : '#f59e0b',
                        }}
                        title={passed80 ? 'Completion point passed!' : 'Watch to here to complete'}
                    />

                    {/* Thumb */}
                    <div
                        style={{
                            ...styles.thumb,
                            left:            `${percentage}%`,
                            backgroundColor: thumbColor,
                            width:           thumbHover ? '16px' : '12px',
                            height:          thumbHover ? '16px' : '12px',
                        }}
                        onMouseEnter={() => setThumbHover(true)}
                        onMouseLeave={() => setThumbHover(false)}
                    />

                    {/* Hover tooltip */}
                    {hoverTime !== null && (
                        <div style={{ ...styles.tooltip, left: `${hoverX}px` }}>
                            {formatTime(hoverTime)}
                        </div>
                    )}
                </div>

                {/* 80% label below marker */}
                <div style={{ ...styles.markerLabel, left: `${markerAt80}%` }}>
                    {passed80 ? '✓ 80%' : '80%'}
                </div>
            </div>

            <span style={styles.time}>{formatTime(duration)}</span>

            {isCompleted && <span style={styles.badge}>✓ Completed</span>}
        </div>
    );
}

const styles = {
    wrapper: {
        display:    'flex',
        alignItems: 'center',
        gap:        '10px',
        padding:    '8px 0 16px',
        userSelect: 'none',
    },
    time: {
        fontSize:  '12px',
        color:     '#d1d5db',
        minWidth:  '36px',
        textAlign: 'center',
    },
    trackOuter: {
        flex:     1,
        position: 'relative',
    },
    track: {
        height:          '5px',
        backgroundColor: '#4b5563',
        borderRadius:    '3px',
        cursor:          'pointer',
        position:        'relative',
    },
    fill: {
        height:       '100%',
        borderRadius: '3px',
        transition:   'width 0.2s ease',
    },
    marker80: {
        position:    'absolute',
        left:        '80%',
        top:         '-4px',
        width:       '2px',
        height:      '13px',
        borderRadius:'1px',
        transition:  'background-color 0.4s ease',
        cursor:      'help',
    },
    thumb: {
        position:     'absolute',
        top:          '50%',
        transform:    'translate(-50%, -50%)',
        borderRadius: '50%',
        transition:   'width 0.15s, height 0.15s, left 0.2s',
        cursor:       'pointer',
    },
    tooltip: {
        position:        'absolute',
        bottom:          '14px',
        transform:       'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color:           '#fff',
        fontSize:        '11px',
        padding:         '2px 6px',
        borderRadius:    '4px',
        pointerEvents:   'none',
        whiteSpace:      'nowrap',
    },
    markerLabel: {
        position:  'absolute',
        top:       '8px',
        transform: 'translateX(-50%)',
        fontSize:  '10px',
        color:     '#f59e0b',
        whiteSpace:'nowrap',
    },
    badge: {
        fontSize:        '11px',
        color:           '#10b981',
        fontWeight:      '600',
        backgroundColor: '#d1fae5',
        padding:         '2px 8px',
        borderRadius:    '10px',
        whiteSpace:      'nowrap',
    },
};