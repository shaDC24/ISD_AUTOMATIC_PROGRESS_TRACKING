export default function CourseMilestones({ courseProgress = 0 }) {
    const progress = parseFloat(courseProgress);

    const milestones = [
        { pct: 25, label: 'Getting started', icon: '🚀', lockedIcon: '🎯', color: '#a435f0', lightColor: '#f3e8ff', midColor: '#e9d5ff' },
        { pct: 50, label: 'Halfway there', icon: '🔥', lockedIcon: '📘', color: '#2563eb', lightColor: '#e0f2fe', midColor: '#bfdbfe' },
        { pct: 75, label: 'Almost done', icon: '⭐', lockedIcon: '🎓', color: '#d97706', lightColor: '#fef9c3', midColor: '#fde68a' },
        { pct: 100, label: 'Course master', icon: '🏆', lockedIcon: '👑', color: '#059669', lightColor: '#d1fae5', midColor: '#a7f3d0' },
    ];

    return (
        <div style={{ padding: '20px 24px', backgroundColor: '#0f172a', borderTop: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 14px' }}>
                Course milestones
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {milestones.map((m) => {
                    const achieved = progress >= m.pct;
                    return (
                        <div key={m.pct} style={{
                            textAlign: 'center', borderRadius: '16px',
                            backgroundColor: '#fff', border: '1.5px solid #e5e7eb',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default', overflow: 'hidden',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                            <div style={{
                                height: '6px',
                                background: achieved
                                    ? `linear-gradient(90deg, ${m.color}, ${m.midColor})`
                                    : '#e5e7eb',
                            }} />

                            <div style={{ padding: '24px 16px 28px' }}>
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

                                <p style={{
                                    fontSize: '34px', fontWeight: 800,
                                    color: achieved ? m.color : '#1c1d1f',
                                    margin: '0 0 4px',
                                }}>{m.pct}%</p>

                                <p style={{
                                    fontSize: '14px', fontWeight: 600,
                                    color: achieved ? m.color : '#6b7280',
                                    margin: '0 0 6px',
                                }}>{m.label}</p>

                                <div style={{
                                    width: '80%', height: '4px', backgroundColor: '#e5e7eb',
                                    borderRadius: '2px', margin: '0 auto 14px', overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%', borderRadius: '2px',
                                        width: achieved ? '100%' : `${Math.min((progress / m.pct) * 100, 100)}%`,
                                        backgroundColor: achieved ? m.color : '#d1d5db',
                                        transition: 'width 0.5s',
                                    }} />
                                </div>

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
                                    {achieved ? '✓ UNLOCKED' : `${m.pct - Math.round(progress)}% to go`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}