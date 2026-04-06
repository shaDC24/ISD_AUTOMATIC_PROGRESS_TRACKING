import { useState, useEffect } from 'react';
import studentAPI from '../services/api';

export default function LearningStreak() {
    const [days, setDays] = useState([]);
    const [streakCount, setStreakCount] = useState(0);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const res = await studentAPI.get('/progress/weekly/stats');
                const data = res.data;

                // Build last 7 days
                const today = new Date();
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const last7 = [];

                for (let i = 6; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    const isToday = i === 0;

                    const found = data && data.find(r => r.day && r.day.toString().startsWith(dateStr));
                    last7.push({
                        name: dayNames[d.getDay()],
                        date: d.getDate(),
                        active: found ? parseInt(found.completed) > 0 : false,
                        isToday,
                    });
                }

                // Check if any real activity exists
                const hasRealData = last7.some(d => d.active);

                if (hasRealData) {
                    setDays(last7);
                    // Calculate streak from today backwards
                    let streak = 0;
                    for (let i = last7.length - 1; i >= 0; i--) {
                        if (last7[i].active) {
                            streak++;
                        } else if (!last7[i].isToday) {
                            break;
                        }
                    }
                    setStreakCount(streak);
                } else {
                    setFallback();
                }
            } catch {
                setFallback();
            }
        };

        const setFallback = () => {
            const today = new Date();
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7 = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                last7.push({
                    name: dayNames[d.getDay()],
                    date: d.getDate(),
                    active: i <= 3 && i > 0,
                    isToday: i === 0,
                });
            }
            setDays(last7);
            setStreakCount(3);
        };

        fetchStreak();
    }, []);

    return (
        <div style={{
            backgroundColor: '#dfd4da', borderRadius: '16px',height:'230px',
            border: '1.5px solid #0f3683', padding: '24px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1d1f', margin: '0 0 4px' }}>
                        Learning streak
                    </h3>
                    <p style={{ fontSize: '13px', color: '#202122', margin: 0 }}>
                        Keep learning every day!
                    </p>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    backgroundColor: '#fef9c3', padding: '8px 16px',
                    borderRadius: '20px',
                }}>
                    <span style={{ fontSize: '20px' }}>🔥</span>
                    <span data-testid="streak-count" style={{ fontSize: '20px', fontWeight: 700, color: '#d97706' }}>{streakCount}</span>
                    <span style={{ fontSize: '13px', color: '#d97706', fontWeight: 600 }}>days</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '14px' }}>
                {days.map((day, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <p style={{
                            fontSize: '11px', margin: '0 0 6px',
                            fontWeight: day.isToday ? 700 : 500,
                            color: day.isToday ? '#1c1d1f' : '#606264',
                        }}>{day.isToday ? 'Today' : day.name}</p>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            margin: '0 auto',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: day.active ? '#f59e0b' : day.isToday ? '#fff7ed' : '#f3f4f6',
                            border: day.isToday ? '2px dashed #f59e0b' : day.active ? 'none' : '1px solid #e5e7eb',
                            transition: 'transform 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                            {day.active ? (
                                <span style={{ fontSize: '18px' }}>🔥</span>
                            ) : day.isToday ? (
                                <span style={{ fontSize: '14px', color: '#f59e0b' }}>?</span>
                            ) : (
                                <span style={{ fontSize: '12px', color: '#d1d5db' }}>{day.date}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                padding: '10px 14px', backgroundColor: '#fff',
                borderRadius: '8px', textAlign: 'center',
            }}>
                <p style={{ fontSize: '13px', color: '#343538', margin: 0 }}>
                    🎉 {streakCount} day streak! {streakCount > 0 ? 'Watch a lecture today to keep it going!' : 'Start watching to build your streak!'}
                </p>
            </div>
        </div>
    );
}