import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer1 from '../components/Footer1';
import Footer2 from '../components/Footer2';

export default function HomePage() {
    const navigate = useNavigate();
    const [bannerIdx, setBannerIdx] = useState(0);

  const banners = [
    { title: 'Learn without limits', subtitle: 'Start, switch, or advance your career with thousands of courses from expert instructors.', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=90' },
    { title: 'Skills that drive you forward', subtitle: 'Technology and the world of work change fast — with us, you stay ahead.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=90' },
    { title: 'Unlock your potential', subtitle: 'Whether you want to learn a new skill or sharpen existing ones, there is a course for you.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&q=90' },
];

    useEffect(() => {
        const t = setInterval(() => setBannerIdx(p => (p + 1) % banners.length), 5000);
        return () => clearInterval(t);
    }, []);

    const features = [
        { icon: '🎬', title: 'Video Lectures', desc: 'Watch high-quality video content with playback controls, speed adjustment, and resume support.' },
        { icon: '📊', title: 'Progress Tracking', desc: 'Automatic progress tracking with milestones. See your completion percentage in real-time.' },
        { icon: '📥', title: 'Downloadable Materials', desc: 'Access PDFs, slides, and resources. Download allowed materials for offline study.' },
        { icon: '⭐', title: 'Ratings & Reviews', desc: 'Rate courses and leave reviews. Help other students find the best content.' },
    ];

   const stats = [
    { value: '220,000+', label: 'Video Lectures' },
    { value: '75,000+', label: 'Full Courses' },
    { value: '62M+', label: 'Students' },
    { value: '75+', label: 'Languages' },
];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>

            {/* Navbar */}
            <nav style={{
                display: 'flex', alignItems: 'center', padding: '0 40px', height: '70px',
                backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb',
                position: 'sticky', top: 0, zIndex: 50,
            }}>
                <span style={{
                    fontSize: '28px', fontWeight: 700, color: '#1c1d1f',
                    fontFamily: 'Georgia, serif', cursor: 'pointer', marginRight: '24px',
                }}>
                    <span style={{ color: '#a435f0' }}>U</span>demy
                </span>

                <span style={{ fontSize: '14px', color: '#1c1d1f', cursor: 'pointer', marginRight: '16px' }}>Explore</span>

                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: '#f8fafb', border: '1px solid #ccc',
                    borderRadius: '999px', padding: '10px 20px', maxWidth: '500px',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>Search for anything</span>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#1c1d1f', cursor: 'pointer' }}>Plans & Pricing</span>
                    <span style={{ fontSize: '14px', color: '#1c1d1f', cursor: 'pointer' }}>Teach on Udemy</span>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '10px 20px', backgroundColor: '#fff', color: '#1c1d1f',
                            border: '2px solid #1c1d1f', borderRadius: '4px',
                            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1c1d1f'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#1c1d1f'; }}
                    >Log in</button>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '10px 20px', backgroundColor: '#a435f0', color: '#fff',
                            border: 'none', borderRadius: '4px',
                            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >Sign up</button>
                </div>
            </nav>

            {/* Hero Banner Slider */}
            <div style={{ position: 'relative', overflow: 'hidden', height: '670px' }}>
                <div style={{
                    display: 'flex', height: '100%',
                    width: `${banners.length * 100}%`,
                    transform: `translateX(-${bannerIdx * (100 / banners.length)}%)`,
                    transition: 'transform 0.6s ease-in-out',
                }}>
                    {banners.map((b, i) => (
                        <div key={i} style={{
                            width: `${100 / banners.length}%`, height: '100%', flexShrink: 0,
                            backgroundImage: `url(${b.image})`,
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', position: 'relative',
                        }}>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                background: 'rgba(0,0,0,0.45)',
                            }} />
                            <div style={{ maxWidth: '600px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                <h1 style={{
                                    fontSize: '48px', fontWeight: 700, color: '#fff',
                                    margin: '0 0 16px', lineHeight: '1.1',
                                    fontFamily: 'Georgia, serif',
                                }}>{b.title}</h1>
                                <p style={{
                                    fontSize: '18px', color: 'rgba(255,255,255,0.9)',
                                    margin: '0 0 32px', lineHeight: '1.6',
                                }}>{b.subtitle}</p>
                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => navigate('/register')}
                                        style={{
                                            padding: '14px 32px', backgroundColor: '#fff',
                                            color: '#1c1d1f', border: 'none', borderRadius: '4px',
                                            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = ''}
                                    >Get started for free</button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        style={{
                                            padding: '14px 32px', backgroundColor: 'transparent',
                                            color: '#fff', border: '2px solid #fff', borderRadius: '4px',
                                            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#1c1d1f'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                                    >Log in</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div onClick={() => setBannerIdx(p => p === 0 ? banners.length - 1 : p - 1)} style={arrowStyle('left')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                </div>
                <div onClick={() => setBannerIdx(p => (p + 1) % banners.length)} style={arrowStyle('right')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                </div>

                <div style={{
                    position: 'absolute', bottom: '20px', left: '50%',
                    transform: 'translateX(-50%)', display: 'flex', gap: '8px',
                }}>
                    {banners.map((_, i) => (
                        <div key={i} onClick={() => setBannerIdx(i)} style={{
                            width: i === bannerIdx ? '28px' : '8px', height: '8px',
                            borderRadius: '4px',
                            backgroundColor: i === bannerIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                            cursor: 'pointer', transition: 'all 0.3s',
                        }} />
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div style={{ backgroundColor: '#f7f9fa', padding: '40px 0' }}>
                <div style={{
                    maxWidth: '900px', margin: '0 auto',
                    display: 'flex', justifyContent: 'space-around',
                }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '36px', fontWeight: 700, color: '#a435f0', margin: '0 0 4px' }}>{s.value}</p>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 48px' }}>
                <h2 style={{
                    fontSize: '32px', fontWeight: 700, color: '#1c1d1f',
                    textAlign: 'center', margin: '0 0 8px', fontFamily: 'Georgia, serif',
                }}>A broad selection of features</h2>
                <p style={{
                    fontSize: '16px', color: '#0f3788', textAlign: 'center', margin: '0 0 40px',
                }}>Our platform provides everything you need for an effective learning experience</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    {features.map((f, i) => (
                        <div key={i} style={{
                            padding: '28px 24px', borderRadius: '12px',
                            border: '1px solid #e5e7eb', backgroundColor: '#eee7ee',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'default',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '14px' }}>{f.icon}</span>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1d1f', margin: '0 0 8px' }}>{f.title}</h3>
                            <p style={{ fontSize: '13px', color: '#383a3d', margin: 0, lineHeight: '1.5' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div style={{ backgroundColor: '#1c1d1f', padding: '60px 48px', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '32px', fontWeight: 700, color: '#fff',
                    margin: '0 0 12px', fontFamily: 'Georgia, serif',
                }}>Start learning today</h2>
                <p style={{
                    fontSize: '16px', color: '#9ca3af', margin: '0 0 28px',
                }}>Join our students and start your learning journey</p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '14px 36px', backgroundColor: '#a435f0',
                            color: '#fff', border: 'none', borderRadius: '4px',
                            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = ''}
                    >Sign up for free</button>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '14px 36px', backgroundColor: 'transparent',
                            color: '#fff', border: '2px solid #fff', borderRadius: '4px',
                            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#1c1d1f'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                    >Log in</button>
                </div>
            </div>

            <Footer1 />
            <Footer2 />
        </div>
    );
}

function arrowStyle(side) {
    return {
        position: 'absolute', [side]: '20px', top: '50%', transform: 'translateY(-50%)',
        width: '44px', height: '44px', borderRadius: '50%',
        backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 5, transition: 'background-color 0.2s',
    };
}