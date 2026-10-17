import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import client from '../api/client';
import MapPicker from '../components/MapPicker';
import MapDisplay from '../components/MapDisplay';

// Auth Context for citizen session
const CitizenContext = createContext(null);

function CitizenPortal() {
    const [citizen, setCitizen] = useState(() => {
        const saved = localStorage.getItem('cst_citizen');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (citizenData) => {
        setCitizen(citizenData);
        localStorage.setItem('cst_citizen', JSON.stringify(citizenData));
    };

    const logout = () => {
        setCitizen(null);
        localStorage.removeItem('cst_citizen');
    };

    return (
        <CitizenContext.Provider value={{ citizen, login, logout }}>
            <div>
                <div className="page-header">
                    <div className="container flex justify-between items-center">
                        <div>
                            <h1 className="page-title">Citizen Portal</h1>
                            <p className="text-muted">Report issues, track requests, and rate services</p>
                        </div>
                        {citizen && (
                            <div className="flex items-center gap-4">
                                <span className="text-sm">Welcome, <strong>{citizen.full_name}</strong></span>
                                {citizen.verification_state === 'verified' && <span className="badge badge-resolved">✓ Verified</span>}
                                <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="page-content container">
                    <Routes>
                        <Route path="/" element={<PortalHome />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/verify" element={<VerifyForm />} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
                        <Route path="/track" element={<ProtectedRoute><TrackRequest /></ProtectedRoute>} />
                        <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
                        <Route path="/request/:requestId" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
                    </Routes>
                </div>
            </div>
        </CitizenContext.Provider>
    );
}

// Protected Route Component
function ProtectedRoute({ children }) {
    const { citizen } = useContext(CitizenContext);

    if (!citizen) {
        return (
            <div className="card text-center" style={{ maxWidth: '500px', margin: '2rem auto' }}>
                <div style={{ fontSize: '4rem' }}>🔒</div>
                <h2 className="mt-4">Login Required</h2>
                <p className="text-muted mt-2">You need to login to access this feature</p>
                <div className="flex gap-2 justify-center mt-4">
                    <Link to="/citizen/login" className="btn btn-primary">Login</Link>
                    <Link to="/citizen/register" className="btn btn-outline">Register</Link>
                </div>
            </div>
        );
    }

    if (citizen.verification_state !== 'verified') {
        return (
            <div className="card text-center" style={{ maxWidth: '500px', margin: '2rem auto' }}>
                <div style={{ fontSize: '4rem' }}>⚠️</div>
                <h2 className="mt-4">Verification Required</h2>
                <p className="text-muted mt-2">Your account needs to be verified to access this feature</p>
                <Link to="/citizen/verify" className="btn btn-primary mt-4">Verify Account</Link>
            </div>
        );
    }

    return children;
}

function PortalHome() {
    const { citizen } = useContext(CitizenContext);
    const navigate = useNavigate();

    return (
        <div>
            {!citizen && (
                <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h3>Welcome to Murang'a county citizen porrtal</h3>
                            <p style={{ opacity: 0.9 }}>Login or register to report issues and track your requests</p>
                        </div>
                        <div className="flex gap-2">
                            <Link to="/citizen/login" className="btn" style={{ background: 'white', color: '#2563eb' }}>Login</Link>
                            <Link to="/citizen/register" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Register</Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-2 gap-4 mb-4">
                <div className="card" onClick={() => navigate('/citizen/report')} style={{ cursor: 'pointer' }}>
                    <div className="text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                        <h3>Report an Issue</h3>
                        <p className="text-sm text-muted mt-2">Submit a new service request</p>
                        {!citizen && <span className="badge mt-2" style={{ background: '#fef3c7', color: '#92400e' }}>Login Required</span>}
                    </div>
                </div>
                <div className="card" onClick={() => navigate('/citizen/track')} style={{ cursor: 'pointer' }}>
                    <div className="text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3>Track Request</h3>
                        <p className="text-sm text-muted mt-2">Check status by Request ID</p>
                        {!citizen && <span className="badge mt-2" style={{ background: '#fef3c7', color: '#92400e' }}>Login Required</span>}
                    </div>
                </div>
            </div>

            <div className="grid grid-2 gap-4">
                <div className="card" onClick={() => navigate('/citizen/my-requests')} style={{ cursor: 'pointer' }}>
                    <div className="text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h3>My Requests</h3>
                        <p className="text-sm text-muted mt-2">View all your requests</p>
                        {!citizen && <span className="badge mt-2" style={{ background: '#fef3c7', color: '#92400e' }}>Login Required</span>}
                    </div>
                </div>
                <div className="card" onClick={() => citizen ? navigate('/citizen/profile') : navigate('/citizen/login')} style={{ cursor: 'pointer' }}>
                    <div className="text-center">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                        <h3>{citizen ? 'My Profile' : 'Create Account'}</h3>
                        <p className="text-sm text-muted mt-2">{citizen ? 'Manage your profile' : 'Register as a citizen'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RegisterForm() {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const { login } = useContext(CitizenContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await client.post('/citizens/', {
                full_name: form.full_name,
                password: form.password,
                contacts: { email: form.email, phone: form.phone, preferred_contact: 'email' }
            });
            setResult({ success: true, data: res.data });
            login(res.data);
        } catch (err) {
            setResult({ success: false, message: err.response?.data?.detail || 'Registration failed' });
        }
        setLoading(false);
    };

    if (result?.success) {
        return (
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="text-center">
                    <div style={{ fontSize: '4rem' }}>✅</div>
                    <h2 className="mt-4">Registration Successful!</h2>
                    <p className="text-muted mt-2">Your Citizen ID:</p>
                    <code className="text-lg">{result.data._id}</code>
                    <p className="text-sm text-muted mt-4">Now verify your account to access all features</p>
                    <button className="btn btn-primary mt-4" onClick={() => navigate('/citizen/verify')}>Verify Account</button>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 className="mb-4">Create Citizen Account</h2>
            {result?.message && <div className="text-danger mb-4" style={{ padding: '0.5rem', background: '#fef2f2', borderRadius: '0.25rem' }}>{result.message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
                <p className="text-sm text-muted mt-4">Already have an account? <Link to="/citizen/login" style={{ color: 'var(--primary)' }}>Login here</Link></p>
            </form>
        </div>
    );
}

function LoginForm() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useContext(CitizenContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await client.post('/citizens/login', { email: form.email, password: form.password });
            login(res.data);
            navigate('/citizen');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 className="mb-4">Citizen Login</h2>
            {error && <div className="text-danger mb-4" style={{ padding: '0.5rem', background: '#fef2f2', borderRadius: '0.25rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p className="text-sm text-muted mt-4 text-center">Don't have an account? <Link to="/citizen/register" style={{ color: 'var(--primary)' }}>Register here</Link></p>
            </form>
        </div>
    );
}

function VerifyForm() {
    const { citizen, login } = useContext(CitizenContext);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    if (!citizen) {
        return <Navigate to="/citizen/login" />;
    }

    if (citizen.verification_state === 'verified') {
        return (
            <div className="card text-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h2 className="mt-4">Already Verified!</h2>
                <p className="text-muted">Your account is verified</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/citizen')}>Go to Portal</button>
            </div>
        );
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await client.post(`/citizens/${citizen._id}/verify`, { otp_code: otp });
            const updated = { ...citizen, verification_state: 'verified' };
            login(updated);
            navigate('/citizen');
        } catch (err) {
            setError(err.response?.data?.detail || 'Verification failed');
        }
        setLoading(false);
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 className="mb-4">Verify Your Account</h2>
            <p className="text-muted mb-4">Enter the 6-digit verification code sent to your email/phone</p>
            <div className="p-4 mb-4" style={{ background: '#dbeafe', borderRadius: '0.5rem' }}>
                <strong>Demo Mode:</strong> Enter any 6-digit code (e.g., 123456)
            </div>
            {error && <div className="text-danger mb-4" style={{ padding: '0.5rem', background: '#fef2f2', borderRadius: '0.25rem' }}>{error}</div>}
            <form onSubmit={handleVerify}>
                <div className="form-group">
                    <label className="form-label">Verification Code</label>
                    <input
                        className="form-input"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem' }}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>
        </div>
    );
}

function ProfilePage() {
    const { citizen, login, logout } = useContext(CitizenContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prefs, setPrefs] = useState({});

    useEffect(() => {
        client.get(`/citizens/${citizen._id}`)
            .then(res => {
                setProfile(res.data);
                setPrefs(res.data.preferences || {});
                setLoading(false);
            })
            .catch(err => {
                console.error("Profile fetch failed:", err);
                if (err.response?.status === 404) {
                    alert("Your session has expired or your account no longer exists. Logging out.");
                    logout();
                    navigate('/citizen/login');
                } else {
                    setLoading(false);
                }
            });
    }, [citizen._id, logout, navigate]);

    const savePrefs = async () => {
        try {
            await client.patch(`/citizens/${citizen._id}/preferences`, prefs);
            alert('Preferences saved!');
        } catch (err) {
            alert('Failed to save preferences');
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div> Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card mb-4">
                <h2 className="mb-4">My Profile</h2>
                <div className="grid grid-2 gap-4">
                    <div>
                        <span className="text-muted text-sm">Name</span>
                        <p className="font-medium">{profile?.full_name}</p>
                    </div>
                    <div>
                        <span className="text-muted text-sm">Status</span>
                        <p><span className={`badge badge-${profile?.verification_state}`}>{profile?.verification_state}</span></p>
                    </div>
                    <div>
                        <span className="text-muted text-sm">Email</span>
                        <p>{profile?.contacts?.email}</p>
                    </div>
                    <div>
                        <span className="text-muted text-sm">Phone</span>
                        <p>{profile?.contacts?.phone || 'Not set'}</p>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <h3 className="mb-4">My Statistics</h3>
                <div className="grid grid-4 gap-4">
                    <div className="stat-card">
                        <div className="stat-value">{profile?.stats?.total_requests || 0}</div>
                        <div className="stat-label">Total Requests</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{profile?.stats?.open_requests || 0}</div>
                        <div className="stat-label">Open</div>
                    </div>
                    <div className="stat-card success">
                        <div className="stat-value">{profile?.stats?.resolved_requests || 0}</div>
                        <div className="stat-label">Resolved</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{profile?.stats?.avg_rating || 0}★</div>
                        <div className="stat-label">Avg Rating</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="mb-4">Notification Preferences</h3>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={prefs?.notifications?.on_status_change ?? true} onChange={e => setPrefs({ ...prefs, notifications: { ...prefs.notifications, on_status_change: e.target.checked } })} />
                        <span>Notify on status changes</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={prefs?.notifications?.on_resolution ?? true} onChange={e => setPrefs({ ...prefs, notifications: { ...prefs.notifications, on_resolution: e.target.checked } })} />
                        <span>Notify on resolution</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={prefs?.notifications?.email_enabled ?? true} onChange={e => setPrefs({ ...prefs, notifications: { ...prefs.notifications, email_enabled: e.target.checked } })} />
                        <span>Email notifications (stubbed)</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={prefs?.notifications?.sms_enabled ?? false} onChange={e => setPrefs({ ...prefs, notifications: { ...prefs.notifications, sms_enabled: e.target.checked } })} />
                        <span>SMS notifications (stubbed)</span>
                    </label>
                </div>

                <h3 className="mt-4 mb-4">Privacy Settings</h3>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={prefs?.privacy?.default_anonymous ?? false} onChange={e => setPrefs({ ...prefs, privacy: { ...prefs.privacy, default_anonymous: e.target.checked } })} />
                        <span>Submit requests anonymously by default</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={prefs?.privacy?.share_publicly_on_map ?? true} onChange={e => setPrefs({ ...prefs, privacy: { ...prefs.privacy, share_publicly_on_map: e.target.checked } })} />
                        <span>Show my requests on public map</span>
                    </label>
                </div>

                <button className="btn btn-primary mt-4" onClick={savePrefs}>Save Preferences</button>
            </div>
        </div>
    );
}

function ReportIssue() {
    const { citizen } = useContext(CitizenContext);
    const [form, setForm] = useState({
        category: 'pothole',
        description: '',
        priority: 'medium',
        location: null,
        anonymous: false,
        evidence_files: []
    });
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const categories = [
        { value: 'pothole', label: 'Pothole / Road Damage' },
        { value: 'water_leak', label: 'Water Leak' },
        { value: 'trash', label: 'Missed Trash / Waste' },
        { value: 'lighting', label: 'Street Lighting' },
        { value: 'sewage', label: 'Sewage Issue' },
        { value: 'signage', label: 'Signs / Traffic' },
        { value: 'other', label: 'Other' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.location) {
            alert('Please select a location on the map');
            return;
        }
        setUploading(true);
        try {
            const payload = {
                citizen_id: form.anonymous ? 'anonymous' : citizen._id,
                anonymous: form.anonymous,
                category: form.category,
                description: form.description,
                priority: form.priority,
                location: { type: 'Point', coordinates: form.location },
                evidence: form.evidence_files
            };
            const res = await client.post('/requests/', payload);
            setResult({ success: true, data: res.data });
        } catch (err) {
            setResult({ success: false, message: err.response?.data?.detail || 'Submission failed' });
        }
        setUploading(false);
    };

    if (result?.success) {
        const triageMetadata = result.data.triage_metadata || {};
        const priorityEscalated = triageMetadata.priority_escalated;
        const highImpact = triageMetadata.high_impact_flag;
        
        return (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="text-center">
                    <div style={{ fontSize: '4rem' }}>📨</div>
                    <h2 className="mt-4">Request Submitted!</h2>
                    <p className="text-muted mt-2">Your Request ID:</p>
                    <code className="text-2xl font-bold">{result.data.request_id}</code>
                    
                    {priorityEscalated && (
                        <div className="mt-3 p-3" style={{ background: '#fef3c7', borderRadius: 'var(--radius)', border: '1px solid #fbbf24' }}>
                            <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                            <p className="text-sm font-medium" style={{ color: '#92400e' }}>
                                Priority Auto-Escalated to <strong>{result.data.priority}</strong>
                            </p>
                            {triageMetadata.escalation_reason && (
                                <p className="text-xs mt-1" style={{ color: '#92400e' }}>
                                    Reason: {triageMetadata.escalation_reason}
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div className="mt-4 p-4" style={{ background: 'var(--background)', borderRadius: 'var(--radius)' }}>
                        <div className="flex justify-between mb-2">
                            <span>Status:</span>
                            <span className="badge badge-new">New</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Category:</span>
                            <span>{result.data.category}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Priority:</span>
                            <span className={`badge badge-${result.data.priority}`}>{result.data.priority}</span>
                        </div>
                        {highImpact && (
                            <div className="flex justify-between mb-2">
                                <span>⚠️ High Impact:</span>
                                <span className="text-xs">Near sensitive location</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Expected Resolution:</span>
                            <span>{result.data.sla_policy?.target_hours || 96} hours</span>
                        </div>
                    </div>
                    {result.data.location && (
                        <div className="mt-4 map-container" style={{ height: '200px' }}>
                            <MapDisplay coordinates={result.data.location.coordinates} />
                        </div>
                    )}
                    <div className="flex gap-2 justify-center mt-4">
                        <button className="btn btn-primary" onClick={() => navigate(`/citizen/request/${result.data.request_id}`)}>View Details</button>
                        <button className="btn btn-outline" onClick={() => setResult(null)}>Submit Another</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="mb-4">Report a Service Issue</h2>
            {result?.message && <div className="text-danger mb-4" style={{ padding: '0.5rem', background: '#fef2f2', borderRadius: '0.25rem' }}>{result.message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Issue Category</label>
                        <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." required />
                </div>

                <div className="form-group">
                    <label className="form-label">Evidence (Photos)</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={async (e) => {
                            if (e.target.files?.[0]) {
                                setUploading(true);
                                const formData = new FormData();
                                formData.append('file', e.target.files[0]);
                                try {
                                    const res = await client.post('/upload', formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                    });
                                    setForm(prev => ({
                                        ...prev,
                                        evidence_files: [...prev.evidence_files, { type: 'photo', url: res.data.url }]
                                    }));
                                } catch (err) {
                                    alert('Upload failed');
                                }
                                setUploading(false);
                            }
                        }}
                    />
                    {uploading && <span className="text-sm text-muted">Uploading...</span>}
                    {form.evidence_files.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {form.evidence_files.map((ev, i) => (
                                <div key={i} className="text-sm text-success">✓ Image {i + 1} uploaded</div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })} />
                        <span>Submit anonymously (your identity won't be linked)</span>
                    </label>
                </div>

                <div className="form-group">
                    <label className="form-label">Location (Click on map)</label>
                    <MapPicker onLocationSelect={(loc) => setForm({ ...form, location: loc })} />
                    {form.location && (
                        <p className="text-sm text-muted mt-2">📍 {form.location[1].toFixed(4)}, {form.location[0].toFixed(4)}</p>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Processing...' : 'Submit Request'}</button>
            </form>
        </div>
    );
}

function TrackRequest() {
    const [requestId, setRequestId] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (requestId.trim()) {
            navigate(`/citizen/request/${requestId.trim()}`);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card">
                <h2 className="mb-4">Track Your Request</h2>
                <p className="text-muted mb-4">Enter your Request ID to see status and timeline</p>
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <input
                            className="form-input"
                            value={requestId}
                            onChange={e => setRequestId(e.target.value)}
                            placeholder="Enter Request ID (e.g., CST-2026-0001)"
                            style={{ fontSize: '1.1rem' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Track Request</button>
                </form>
            </div>
        </div>
    );
}

function RequestDetail() {
    const { citizen } = useContext(CitizenContext);
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState({ stars: 0, comment: '', dispute: false, dispute_reason: '' });
    const requestId = window.location.pathname.split('/').pop();

    const fetchRequest = async () => {
        try {
            const res = await client.get(`/requests/${requestId}`);
            setRequest(res.data);
        } catch {
            alert('Request not found');
        }
        setLoading(false);
    };

    useEffect(() => { fetchRequest(); }, [requestId]);

    const handleComment = async () => {
        if (!comment.trim()) return;
        try {
            await client.post(`/requests/${requestId}/comment`, {
                text: comment,
                author_id: citizen._id,
                author_type: 'citizen'
            });
            setComment('');
            fetchRequest();
        } catch (err) {
            alert('Failed to add comment');
        }
    };

    const handleRate = async () => {
        if (rating.stars === 0) {
            alert('Please select a star rating');
            return;
        }
        try {
            await client.post(`/requests/${requestId}/rating`, rating);
            alert('Rating submitted!');
            fetchRequest();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to submit rating');
        }
    };

    const handleAddEvidence = async (url) => {
        if (!url.trim()) return;
        try {
            await client.post(`/requests/${requestId}/evidence`, { url: url, evidence_type: 'photo' });
            alert('Evidence added!');
            fetchRequest();
        } catch (err) {
            alert('Failed to add evidence');
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div> Loading...</div>;
    if (!request) return <div className="empty-state"><p>Request not found</p></div>;

    const canRate = (request.status === 'resolved' || request.status === 'closed') && !request.rating;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/citizen/my-requests" className="btn btn-ghost mb-4">← Back to My Requests</Link>

            <div className="card mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2>{request.request_id}</h2>
                    <span className={`badge badge-${request.status}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>{request.status?.replace('_', ' ')}</span>
                </div>

                <div className="grid grid-2 gap-4 mb-4">
                    <div>
                        <span className="text-muted text-sm">Category</span>
                        <p className="font-medium">{request.category}</p>
                    </div>
                    <div>
                        <span className="text-muted text-sm">Priority</span>
                        <p><span className={`badge badge-${request.priority}`}>{request.priority}</span></p>
                    </div>
                    <div>
                        <span className="text-muted text-sm">Expected Resolution</span>
                        <p>{request.sla_policy?.target_hours || 96} hours</p>
                    </div>
                    <div>
                        <span className="text-muted text-sm">Created</span>
                        <p>{request.timestamps?.created_at ? new Date(request.timestamps.created_at).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="text-muted text-sm">Description</span>
                    <p className="mt-1">{request.description}</p>
                </div>

                {request.evidence?.length > 0 && (
                    <div className="mb-4">
                        <span className="text-muted text-sm">Evidence</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {request.evidence.map((ev, i) => (
                                <a key={i} href={ev.url} target="_blank" rel="noopener noreferrer" className="p-2 border rounded text-sm text-blue-600 hover:bg-gray-50">
                                    📎 {ev.type} {i + 1}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4 p-4" style={{ background: 'var(--background)', borderRadius: 'var(--radius)' }}>
                    <h4 className="text-sm font-medium mb-2">Add Additional Evidence</h4>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            className="form-input text-sm"
                            onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const formData = new FormData();
                                    formData.append('file', e.target.files[0]);
                                    try {
                                        const res = await client.post('/upload', formData, {
                                            headers: { 'Content-Type': 'multipart/form-data' }
                                        });
                                        handleAddEvidence(res.data.url);
                                    } catch (err) {
                                        alert('Upload failed');
                                    }
                                    e.target.value = null;
                                }
                            }}
                        />
                    </div>
                </div>

                {request.location && (
                    <div className="map-container mb-4" style={{ height: '200px' }}>
                        <MapDisplay coordinates={request.location.coordinates} />
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="card mb-4">
                <h3 className="mb-4">Status Timeline</h3>
                <div className="timeline">
                    {['created_at', 'triaged_at', 'assigned_at', 'resolved_at', 'closed_at'].map(key => (
                        <div key={key} className={`timeline-item ${request.timestamps?.[key] ? 'completed' : ''}`}>
                            <strong>{key.replace('_at', '').replace('_', ' ')}</strong>
                            <p className="text-xs text-muted">{request.timestamps?.[key] ? new Date(request.timestamps[key]).toLocaleString() : 'Pending'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comments */}
            <div className="card mb-4">
                <h3 className="mb-4">Comments ({request.comments?.length || 0})</h3>
                {request.comments?.length > 0 ? (
                    <div className="flex flex-col gap-4 mb-4">
                        {request.comments.map((c, i) => (
                            <div key={i} className="p-4" style={{ background: 'var(--background)', borderRadius: 'var(--radius)' }}>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{c.author_type === 'citizen' ? 'You' : 'Staff'}</span>
                                    <span className="text-xs text-muted">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
                                </div>
                                <p>{c.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted mb-4">No comments yet</p>
                )}
                <div className="flex gap-2">
                    <input className="form-input" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." style={{ flex: 1 }} />
                    <button className="btn btn-primary" onClick={handleComment}>Send</button>
                </div>
            </div>

            {/* Rating */}
            {canRate && (
                <div className="card">
                    <h3 className="mb-4">Rate This Service</h3>
                    <div className="stars mb-4">
                        {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} className={`star ${rating.stars >= n ? 'filled' : ''}`} onClick={() => setRating({ ...rating, stars: n })}>★</span>
                        ))}
                    </div>
                    <textarea className="form-textarea mb-4" value={rating.comment} onChange={e => setRating({ ...rating, comment: e.target.value })} placeholder="Leave a comment (optional)" />

                    <div className="mb-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={rating.dispute} onChange={e => setRating({ ...rating, dispute: e.target.checked })} />
                            <span className="text-warning">Flag issue with resolution (dispute)</span>
                        </label>
                        {rating.dispute && (
                            <textarea className="form-textarea mt-2" value={rating.dispute_reason} onChange={e => setRating({ ...rating, dispute_reason: e.target.value })} placeholder="Explain the issue..." />
                        )}
                    </div>

                    <button className="btn btn-primary" onClick={handleRate}>Submit Rating</button>
                </div>
            )}

            {request.rating && (
                <div className="card" style={{ background: '#dcfce7' }}>
                    <h3 className="mb-2">Your Rating</h3>
                    <div className="stars mb-2">
                        {'★'.repeat(request.rating.stars)}{'☆'.repeat(5 - request.rating.stars)}
                    </div>
                    {request.rating.comment && <p className="text-muted">{request.rating.comment}</p>}
                    {request.rating.dispute && <p className="text-warning mt-2">⚠️ Dispute flagged: {request.rating.dispute_reason}</p>}
                </div>
            )}
        </div>
    );
}

function MyRequests() {
    const { citizen } = useContext(CitizenContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        client.get(`/citizens/${citizen._id}/requests`).then(res => {
            setRequests(res.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [citizen._id]);

    if (loading) return <div className="loading"><div className="spinner"></div> Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2>My Requests ({requests.length})</h2>
                <Link to="/citizen/report" className="btn btn-primary">+ New Request</Link>
            </div>

            {requests.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">📭</div>
                    <p>You haven't submitted any requests yet</p>
                    <Link to="/citizen/report" className="btn btn-primary mt-4">Report an Issue</Link>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {requests.map(req => (
                        <div key={req.request_id} className="request-item" onClick={() => navigate(`/citizen/request/${req.request_id}`)} style={{ cursor: 'pointer' }}>
                            <div className="request-info">
                                <h4>{req.request_id} - {req.category}</h4>
                                <p>{req.description?.substring(0, 100)}...</p>
                            </div>
                            <div className="request-meta">
                                <span className={`badge badge-${req.status}`}>{req.status?.replace('_', ' ')}</span>
                                <p className="text-xs text-muted mt-1">{req.timestamps?.created_at ? new Date(req.timestamps.created_at).toLocaleDateString() : ''}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CitizenPortal;
