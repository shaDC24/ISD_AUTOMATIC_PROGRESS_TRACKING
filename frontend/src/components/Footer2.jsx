
export default function Footer2() {
    return (
        <div style={{
            width:"100%"
        }}>
        <div style={{
            backgroundColor: '#1c1d1f', padding: '16px 48px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '3px solid #a435f0',
        }}>
            {/* Left - Logo + Copyright */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '36px', height: '36px', backgroundColor: '#fff',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <span style={{
                        fontSize: '20px', fontWeight: 800, color: '#1c1d1f',
                        fontFamily: 'Georgia, serif',
                    }}>U</span>
                </div>
                <span style={{ fontSize: '14px', color: '#fff' }}>
                    © 2026 Udemy, Inc.
                </span>
            </div>

            {/* Center - Cookie Settings */}
            <span style={{
                fontSize: '14px', color: '#fff', cursor: 'pointer',
            }}>Cookie Settings</span>

            {/* Right - Language */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>English</span>
            </div>
        </div>

        </div>
    );
}