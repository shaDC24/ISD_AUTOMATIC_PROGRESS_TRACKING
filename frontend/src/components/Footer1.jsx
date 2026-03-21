// Footer1 - "Teach the world online" + Links grid
export default function Footer1() {
    const columns = [
        {
            title: 'About',
            links: ['About us', 'Careers', 'Contact us', 'Blog', 'Invest', 'Press', 'Leadership'],
        },
        {
            title: 'Discover Udemy',
            links: ['Get the app', 'Teach on Udemy', 'Plans and Pricing', 'Affiliate', 'Help and Support', 'Business Solutions', 'Gift cards'],
        },
        {
            title: 'Community',
            links: ['Learners', 'Partners', 'Developers', 'Beta Testers', 'Translators', 'Teaching Center', 'Referral Program'],
        },
        {
            title: 'Legal and Accessibility',
            links: ['Accessibility statement', 'Privacy policy', 'Sitemap', 'Terms', 'Cookie Policy', 'Copyright Policy', 'Terms of Use and Service'],
        },
    ];

    return (
        <div style = {{
            width:'1900px'
        }}>
            {/* Teach the world online */}
            <div style={{
                backgroundColor: '#1c1d1f', padding: '40px 48px',weight:'cover',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div>
                    <h2 style={{
                        fontSize: '28px', fontWeight: 700, color: '#fff',
                        margin: '0 0 8px', fontFamily: 'Georgia, serif',
                    }}>Teach the world online</h2>
                    <p style={{
                        fontSize: '15px', color: '#ccc', margin: 0,
                    }}>Create a video course, reach students across the world and earn money</p>
                </div>
                <button style={{
                    padding: '12px 28px', backgroundColor: 'transparent',
                    color: '#fff', border: '2px solid #fff',
                    fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                    whiteSpace: 'nowrap',
                }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >Teach on Udemy</button>
            </div>

            {/* Links grid */}
            <div style={{
                backgroundColor: '#3e1a5c', padding: '40px 48px',
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px',
            }}>
                {columns.map((col) => (
                    <div key={col.title}>
                        <h3 style={{
                            fontSize: '24px', fontWeight: 700, color: '#fff',
                            margin: '0 0 16px',
                        }}>{col.title}</h3>
                        {col.links.map((link) => (
                            <p key={link} style={{
                                fontSize: '22px', color: '#e0d0ec',
                                margin: '0 0 10px', cursor: 'pointer',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = '#e0d0ec'}
                            >{link}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}