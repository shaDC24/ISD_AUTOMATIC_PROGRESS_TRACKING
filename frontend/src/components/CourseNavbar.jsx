import { useNavigate } from 'react-router-dom';

export default function CourseNavbar({ courseTitle, progress = 0, showMilestones, onToggleMilestones }) {
    const navigate = useNavigate();

    const circumference = 2 * Math.PI * 14;
    const filled = (progress / 100) * circumference;

    return (
        <nav style={{
            display: 'flex', alignItems: 'center',
            padding: '0 20px', height: '60px',
            backgroundColor: '#1c1d1f',
            borderBottom: '1px solid #2d2f31',
        }}>
            <span
                style={{
                    fontSize: '22px', fontWeight: 800, color: '#fff',
                    fontFamily: 'Georgia, serif', cursor: 'pointer',
                    marginRight: '20px', flexShrink: 0,
                }}
                onClick={() => navigate('/student/dashboard')}
            >
                <span style={{ color: '#a435f0' }}>U</span>demy
            </span>

            <div style={{ width: '1px', height: '28px', backgroundColor: '#3e4143', marginRight: '20px' }} />

            <p style={{
                fontSize: '14px', color: '#e4e4e4', fontWeight: 500,
                margin: 0, flex: 1, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{courseTitle || 'Course'}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '20px', cursor: 'pointer' }}>
                <span style={{ fontSize: '20px' }}>⭐</span>
                <span style={{ fontSize: '12px', color: '#ccc' }}>Leave a rating</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px', cursor: 'pointer' }}>
                <svg width="36" height="36" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3e4143" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#a435f0" strokeWidth="3"
                        strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round"
                        transform="rotate(-90 18 18)" style={{ transition: 'stroke-dasharray 0.4s ease' }} />
                </svg>
                <div>
                    <p style={{ fontSize: '11px', color: '#ccc', margin: 0 }}>Your Progress</p>
                    <p style={{ fontSize: '12px', color: '#a435f0', fontWeight: 700, margin: 0 }}>{Math.round(progress)}%</p>
                </div>
            </div>

            {/* Milestone Trophy Button */}
            <div
                onClick={onToggleMilestones}
                style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    backgroundColor: showMilestones ? '#a435f0' : '#2d2f31',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: '1.5px solid #3e4143',
                    transition: 'background-color 0.2s', marginRight: '12px',
                }}
                title="View milestones"
            >
                <span style={{ fontSize: '18px' }}>🏆</span>
            </div>

            <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', backgroundColor: 'transparent',
                border: '1px solid #6b7280', borderRadius: '4px',
                color: '#fff', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', marginRight: '8px',
            }}>
                Share
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
            </button>

            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', border: '1px solid #6b7280',
                borderRadius: '4px', cursor: 'pointer',
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                    <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                </svg>
            </div>
        </nav>
    );
}