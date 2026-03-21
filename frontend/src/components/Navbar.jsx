import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const categories = [
        'Development', 'Business', 'Finance & Accounting', 'IT & Software',
        'Office Productivity', 'Personal Development', 'Design', 'Marketing', 'Health & Fitness'
    ];

    return (
        <div>
            <nav style={{
                display: 'flex', alignItems: 'center',
                padding: '0 28px', height: '70px',
                backgroundColor: '#fff',
                borderBottom: '1px solid #d1d5db',
                boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            }}>
                {/* Logo */}
                <div >
                    <img
                        src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
                        alt="Udemy"
                        style={{ height: '34px', cursor: 'pointer', marginRight: '16px' }}
                        onClick={() => navigate('/student/dashboard')}
                    />
                </div>

                <span style={{
                    fontSize: '19px', color: '#161515', cursor: 'pointer',
                    padding: '8px 12px', flexShrink: 0, fontWeight: 500,
                }}>Explore</span>

                {/* Search Bar - grey bg, full width, rounded */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '12px',
                    backgroundColor: '#cfc6c6', border: '1px solid #cccccc',
                    borderRadius: '999px', padding: '12px 24px',
                    margin: '0 16px',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#212327" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span style={{ fontSize: '16px', color: '#262627' }}>Search for anything</span>
                </div>

                {/* Right side items */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '20px',
                    flexShrink: 0,
                }}>
                    <span style={{
                        fontSize: '16px', color: '#1c1d1f', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}>Plans & Pricing</span>

                    <span style={{
                        fontSize: '16px', color: '#1c1d1f', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}>Teach on Udemy</span>

                    <span
                        style={{
                            fontSize: '16px', color: '#1c1d1f', cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontWeight: location.pathname.includes('my-learning') ? 700 : 400,
                        }}
                        onClick={() => navigate('/student/my-learning')}
                    >My Learning</span>

                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#000000" strokeWidth="2.6" style={{ cursor: 'pointer', flexShrink: 0 }}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>

                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#1c1d1f" strokeWidth="2.6" style={{ cursor: 'pointer', flexShrink: 0 }}>
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>

                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#1c1d1f" strokeWidth="2.6" style={{ cursor: 'pointer', flexShrink: 0 }}>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>

                    <div
                        style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            backgroundColor: '#100f11', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: '14px', fontWeight: 700,
                            cursor: 'pointer', flexShrink: 0,
                        }}
                        onClick={handleLogout}
                        title="Logout"
                    >{initials}</div>
                </div>
            </nav>

            {/* Category Bar */}
            <div style={{
                display: 'flex', justifyContent: 'center', gap: '24px',
                padding: '12px 28px', borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f3e7e7',
            }}>
                {categories.map(cat => (
                    <span key={cat} style={{
                        fontSize: '16px', color: '#2b2a2a', cursor: 'pointer',
                        whiteSpace: 'nowrap', transition: 'color 0.15s',
                        fontWeight: 500,
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#000000'}
                        onMouseLeave={e => e.currentTarget.style.color = '#2b2a2a'}
                    >{cat}</span>
                ))}
            </div>
        </div>
    );
}