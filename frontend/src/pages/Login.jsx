import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1 = email, 2 = password

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContinue = (e) => {
        e.preventDefault();
        if (!formData.email) {
            setError('Please enter your email');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await loginUser(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.user.role === 'instructor') {
                navigate('/instructor/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex', alignItems: 'center', padding: '0 28px',
                height: '70px', borderBottom: '1px solid #e5e7eb',
            }}>
                <span style={{
                    fontSize: '28px', fontWeight: 700, color: '#1c1d1f',
                    fontFamily: 'Georgia, serif', cursor: 'pointer',
                    marginRight: '20px',
                }} onClick={() => navigate('/')}>
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
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>Search on anything</span>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#1c1d1f', cursor: 'pointer' }}>Plans and Pricing</span>
                    <span style={{ fontSize: '14px', color: '#1c1d1f', cursor: 'pointer' }}>Teach on udemy</span>
                    <span style={{ fontSize: '14px', color: '#1c1d1f', cursor: 'pointer' }}>About Us</span>
                    <button style={{
                        padding: '10px 20px', backgroundColor: '#fff', color: '#1c1d1f',
                        border: '2px solid #1c1d1f', borderRadius: '4px',
                        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    }}>Login</button>
                    <button style={{
                        padding: '10px 20px', backgroundColor: '#a435f0', color: '#fff',
                        border: 'none', borderRadius: '4px',
                        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    }} onClick={() => navigate('/register')}>Sign up</button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{
                display: 'flex', maxWidth: '1100px', margin: '40px auto',
                padding: '0 48px', gap: '60px', alignItems: 'center',
                minHeight: 'calc(100vh - 150px)',
            }}>
                {/* Left - Illustration */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <img
                        src="https://frontends.udemycdn.com/components/auth/desktop-illustration-step-1-x2.webp"
                        alt="Learning illustration"
                        style={{ maxWidth: '100%', height: 'auto', maxHeight: '500px' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                                <div style="width:400px;height:400px;background:#f8f9fa;border-radius:16px;display:flex;align-items:center;justify-content:center;">
                                    <span style="font-size:80px;">📚</span>
                                </div>
                            `;
                        }}
                    />
                </div>

                {/* Right - Login Form */}
                <div style={{ width: '380px', flexShrink: 0 }}>
                    <h1 style={{
                        fontSize: '24px', fontWeight: 700, color: '#1c1d1f',
                        margin: '0 0 24px', textAlign: 'center', lineHeight: '1.3',
                    }}>
                        Log in to continue your<br />learning journey
                    </h1>

                    {error && (
                        <div style={{
                            padding: '10px 14px', backgroundColor: '#fee2e2',
                            borderRadius: '4px', marginBottom: '16px',
                            fontSize: '13px', color: '#dc2626', textAlign: 'center',
                        }}>{error}</div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleContinue}>
                            <div style={{ marginBottom: '16px' }}>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    style={{
                                        width: '100%', padding: '14px 16px',
                                        border: '2px solid #1c1d1f', borderRadius: '4px',
                                        fontSize: '15px', boxSizing: 'border-box',
                                        outline: 'none',
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = '#a435f0'}
                                    onBlur={e => e.currentTarget.style.borderColor = '#1c1d1f'}
                                />
                            </div>

                            <button type="submit" style={{
                                width: '100%', padding: '14px',
                                backgroundColor: '#a435f0', color: '#fff',
                                border: 'none', borderRadius: '4px',
                                fontSize: '16px', fontWeight: 700,
                                cursor: 'pointer', marginBottom: '24px',
                            }}>
                                Continue
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{
                                padding: '10px 14px', backgroundColor: '#f3f4f6',
                                borderRadius: '4px', marginBottom: '12px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <span style={{ fontSize: '13px', color: '#1c1d1f' }}>{formData.email}</span>
                                <span
                                    style={{ fontSize: '12px', color: '#a435f0', cursor: 'pointer', fontWeight: 600 }}
                                    onClick={() => setStep(1)}
                                >Edit</span>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    autoFocus
                                    style={{
                                        width: '100%', padding: '14px 16px',
                                        border: '2px solid #1c1d1f', borderRadius: '4px',
                                        fontSize: '15px', boxSizing: 'border-box',
                                        outline: 'none',
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = '#a435f0'}
                                    onBlur={e => e.currentTarget.style.borderColor = '#1c1d1f'}
                                />
                            </div>

                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '14px',
                                backgroundColor: loading ? '#c084fc' : '#a435f0',
                                color: '#fff', border: 'none', borderRadius: '4px',
                                fontSize: '16px', fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginBottom: '24px',
                            }}>
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        marginBottom: '20px',
                    }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }} />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Other log in options</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }} />
                    </div>

                    {/* Social Icons */}
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '16px',
                        marginBottom: '24px',
                    }}>
                        {/* Google */}
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '4px',
                            border: '2px solid #1c1d1f', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </div>
                        {/* Facebook */}
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '4px',
                            border: '2px solid #1c1d1f', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </div>
                        {/* Apple */}
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '4px',
                            border: '2px solid #1c1d1f', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}>
                            <svg width="20" height="22" viewBox="0 0 17 20" fill="#1c1d1f">
                                <path d="M13.545 10.239c-.022-2.234 1.823-3.308 1.906-3.358-.037-1.054-.763-2.11-1.583-2.625-.812-.51-1.923-.517-2.493-.527-.508-.054-1.044.03-1.482.202-.5.196-.904.528-1.148.528-.258 0-.657-.316-1.108-.308-.58.008-1.16.263-1.613.713-.73.73-1.195 1.85-1.048 3.247.182 1.724.825 3.602 1.52 4.6.63.983 1.38 2.046 2.384 2.008.954-.039 1.316-.617 2.468-.617 1.143 0 1.478.617 2.479.598 1.032-.02 1.68-.99 2.304-1.977.436-.654.766-1.376.988-2.137-2.147-.823-2.573-3.563-2.574-4.347z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Sign up link */}
                    <div style={{
                        padding: '16px', backgroundColor: '#f8f9fa',
                        borderRadius: '4px', textAlign: 'center',
                        borderBottom: '1px solid #e5e7eb',
                    }}>
                        <p style={{ fontSize: '14px', color: '#1c1d1f', margin: '0 0 12px' }}>
                            Don't have an account?
                            <Link to="/register" style={{
                                color: '#a435f0', fontWeight: 700,
                                textDecoration: 'underline', marginLeft: '4px',
                            }}>Sign up</Link>
                        </p>
                        <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '12px' }} />
                        <p style={{ fontSize: '14px', margin: 0 }}>
                            <span style={{
                                color: '#a435f0', fontWeight: 600,
                                cursor: 'pointer', textDecoration: 'underline',
                            }}>Log in with your organization</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}