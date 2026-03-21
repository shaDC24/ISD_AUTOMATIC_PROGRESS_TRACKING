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

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <span style={styles.logo} onClick={() => navigate('/student/dashboard')}>
                    Udemy
                </span>
                <span style={styles.explore}>Explore</span>
            </div>

            <div style={styles.searchBar}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#9a9b9d" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span style={styles.searchText}>Search for anything</span>
            </div>

            <div style={styles.right}>
                <span
                    style={{
                        ...styles.navLink,
                        borderBottom: location.pathname === '/student/my-learning'
                            ? '2px solid #fff' : '2px solid transparent',
                    }}
                    onClick={() => navigate('/student/my-learning')}
                >
                    My Learning
                </span>

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2" style={styles.icon}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2" style={styles.icon}>
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2" style={styles.icon}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                <div style={styles.avatar} onClick={handleLogout} title="Click to logout">
                    {initials}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '0 20px',
        height: '56px',
        backgroundColor: '#1c1d1f',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    logo: {
        fontSize: '22px',
        fontWeight: 700,
        color: '#fff',
        cursor: 'pointer',
        letterSpacing: '-0.5px',
    },
    explore: {
        fontSize: '14px',
        color: '#ccc',
        cursor: 'pointer',
    },
    searchBar: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#3e4143',
        borderRadius: '999px',
        padding: '8px 18px',
        maxWidth: '500px',
    },
    searchText: {
        fontSize: '14px',
        color: '#9a9b9d',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginLeft: 'auto',
    },
    navLink: {
        fontSize: '14px',
        color: '#fff',
        cursor: 'pointer',
        paddingBottom: '4px',
        whiteSpace: 'nowrap',
    },
    icon: {
        cursor: 'pointer',
        flexShrink: 0,
    },
    avatar: {
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        backgroundColor: '#6b21a8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
    },
};