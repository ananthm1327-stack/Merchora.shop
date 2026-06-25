import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, Info } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  
  // Forgot password states
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address format.';
    }
    
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setAuthError(null);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleType) => {
    setLoading(true);
    setAuthError(null);
    const mockEmail = roleType === 'seller' ? 'seller@merchora.shop' : 'buyer@merchora.shop';
    try {
      const loggedInUser = await login(mockEmail, 'password123');
      if (loggedInUser.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetMessage('Please enter a valid email address.');
      return;
    }
    setResetMessage(`Password reset link sent successfully to ${resetEmail}! Please check your inbox.`);
    setResetEmail('');
  };

  return (
    <main className="container flex align-center justify-center" style={{ minHeight: '80vh', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {/* Theme-Adaptive Inline Logo */}
          <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
            <svg width="220" height="44" viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5C55E6" />
                  <stop offset="100%" stopColor="#E63595" />
                </linearGradient>
              </defs>
              <g className="mini-fold" transform="scale(0.18) translate(60, 60)">
                <path d="M100 400 L180 120 L256 320 Z" fill="url(#logoGrad)" />
                <path d="M412 400 L332 120 L256 320 Z" fill="url(#logoGrad)" />
                <path d="M180 120 L256 320 L332 120 L256 80 Z" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeOpacity="0.3" />
              </g>
              <text x="145" y="85">
                <tspan fill="var(--text-primary)" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '76px', letterSpacing: '-1px' }}>Merch</tspan>
                <tspan fill="var(--primary)" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '76px' }}>ora</tspan>
              </text>
            </svg>
          </Link>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Log in to access your Merchora portal</p>
        </div>

        {authError && (
          <div className="badge badge-danger" style={{ display: 'block', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textAlign: 'center', width: '100%' }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            {validationErrors.email && <span className="form-error">{validationErrors.email}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <div className="flex justify-between align-center" style={{ width: '100%' }}>
              <label className="form-label">Password</label>
              <button 
                type="button" 
                onClick={() => { setIsResetOpen(true); setResetMessage(''); }}
                style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            {validationErrors.password && <span className="form-error">{validationErrors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', height: '46px', marginTop: '24px' }}
          >
            {loading ? 'Authenticating...' : (
              <span className="flex align-center justify-center gap-sm">
                Log In <LogIn size={18} />
              </span>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create Account</Link>
        </div>

        {/* Demo Fast Login Sandbox helper */}
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', textAlign: 'left' }}>
          <div className="flex align-center gap-sm" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <Info size={14} style={{ color: 'var(--primary)' }} />
            <span>SANDBOX DEMO MODE: QUICK LOGIN</span>
          </div>
          <div className="grid grid-2 gap-sm">
            <button 
              onClick={() => handleQuickLogin('buyer')}
              className="btn btn-secondary btn-sm flex align-center justify-center"
              style={{ fontSize: '0.78rem' }}
            >
              Log in as Buyer <ArrowRight size={12} />
            </button>
            <button 
              onClick={() => handleQuickLogin('seller')}
              className="btn btn-secondary btn-sm flex align-center justify-center"
              style={{ fontSize: '0.78rem' }}
            >
              Log in as Seller <ArrowRight size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* Forgot Password Dialog */}
      {isResetOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div className="modal-content card" style={{ maxWidth: '400px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Reset Password</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Enter your email address and we'll send a password recovery link.
            </p>

            {resetMessage && (
              <div className="badge badge-success" style={{ display: 'block', padding: '10px', borderRadius: '4px', textAlign: 'center', color: resetMessage.includes('sent') ? 'var(--success)' : 'var(--danger)' }}>
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-md" style={{ width: '100%' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@example.com" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-sm justify-between" style={{ marginTop: '10px' }}>
                <button type="button" onClick={() => setIsResetOpen(false)} className="btn btn-outline flex-1">
                  Close
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};
