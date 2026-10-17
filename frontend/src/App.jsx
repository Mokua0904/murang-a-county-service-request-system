import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CitizenPortal from './pages/CitizenPortal';
import AdminDashboard from './pages/staffDashboard';
import Analytics from './pages/Analytics';
import './App.css';

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
    <img src="/muranga-logo.png" alt="" style={{ height: '35px' }} />
    <span>Murang'a County</span>
</Link>
       
        <div className="nav-links">
          <Link to="/citizen" className={`nav-link ${isActive('/citizen') ? 'active' : ''}`}>Citizen Portal</Link>
          <Link to="/staff" className={`nav-link ${isActive('/staff') ? 'active' : ''}`}>Admin Dashboard</Link>
          <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>Analytics</Link>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Murang'a county public service request system</h1>
        <p>Report broken streetlights, water issues or garbage problems directly to murang'a county government. Track your request from submission to resolution</p>
        <div className="hero-actions">
          <Link to="/citizen" className="btn btn-primary btn-lg">Submit a Request</Link>
          <Link to="/staff" className="btn btn-outline btn-lg">Admin Login</Link>
        </div>
      </div>

      <div className="features container">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Report County Issues</h3>
            <p>Quickly report issues like water shortages, broken streetlights, or uncollected garbage in your ward,with optional photo evidence</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>track your request</h3>
            <p>stay updated track the progress of your request as it moves from pending to it progress and finally resolved.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>county analytics</h3>
            <p>Transparency for murang'a residents. view stastics on open vs resolved cases across the county.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>secure Access</h3>
            <p>Registered citizen portal and dedicated dashboard for murang'a county administration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/citizen/*" element={<CitizenPortal />} />
            <Route path="/staff/*" element={<AdminDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
