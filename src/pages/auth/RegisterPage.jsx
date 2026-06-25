import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, Mail, Lock, Shield, Store, MapPin, 
  CreditCard, FileText, Phone, Building, CheckCircle 
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export const RegisterPage = () => {
  const { registerBuyer, registerSeller } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successVerification, setSuccessVerification] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Buyer
  const [shippingAddress, setShippingAddress] = useState(''); // Buyer
  const [paymentPreference, setPaymentPreference] = useState('Credit Card'); // Buyer

  const [businessName, setBusinessName] = useState(''); // Seller
  const [contact, setContact] = useState(''); // Seller
  const [taxId, setTaxId] = useState(''); // Seller
  const [bankAccount, setBankAccount] = useState(''); // Seller
  const [verificationFile, setVerificationFile] = useState(null); // Seller

  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required.';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters.';

    if (role === 'buyer') {
      if (!name) errs.name = 'Full name is required.';
      if (!shippingAddress) errs.shippingAddress = 'Shipping address is required.';
    } else {
      if (!businessName) errs.businessName = 'Business name is required.';
      if (!contact) errs.contact = 'Business contact number is required.';
      if (!taxId) errs.taxId = 'Tax ID number is required.';
      if (!bankAccount) errs.bankAccount = 'Bank account payouts routing is required.';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    try {
      if (role === 'buyer') {
        await registerBuyer(email, password, name, shippingAddress, paymentPreference);
      } else {
        await registerSeller(email, password, businessName, contact, taxId, bankAccount);
      }
      setSuccessVerification(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (limit 5MB) and type (pdf, png, jpg)
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        addToast('Invalid file format. Please upload PDF, PNG or JPEG business files.', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast('File size exceeds 5MB limit.', 'error');
        return;
      }
      setVerificationFile(file);
      addToast('Business document loaded successfully. Click register below to submit.', 'success');
    }
  };

  const handleFinishVerification = () => {
    setSuccessVerification(false);
    if (role === 'seller') {
      navigate('/seller/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <main className="container flex align-center justify-center" style={{ minHeight: '85vh', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* Theme-Adaptive Inline Logo */}
          <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
            <svg width="220" height="44" viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradReg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5C55E6" />
                  <stop offset="100%" stopColor="#E63595" />
                </linearGradient>
              </defs>
              <g className="mini-fold" transform="scale(0.18) translate(60, 60)">
                <path d="M100 400 L180 120 L256 320 Z" fill="url(#logoGradReg)" />
                <path d="M412 400 L332 120 L256 320 Z" fill="url(#logoGradReg)" />
                <path d="M180 120 L256 320 L332 120 L256 80 Z" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeOpacity="0.3" />
              </g>
              <text x="145" y="85">
                <tspan fill="var(--text-primary)" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '76px', letterSpacing: '-1px' }}>Merch</tspan>
                <tspan fill="var(--primary)" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '76px' }}>ora</tspan>
              </text>
            </svg>
          </Link>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Join Merchora to start trading or shopping</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="tabs-header" style={{ marginBottom: '30px' }}>
          <button 
            type="button"
            onClick={() => { setRole('buyer'); setValidationErrors({}); setError(null); }}
            className={`tab-btn flex-1 flex align-center justify-center gap-sm ${role === 'buyer' ? 'active' : ''}`}
            style={{ paddingBottom: '16px' }}
          >
            <User size={18} /> I want to Buy
          </button>
          <button 
            type="button"
            onClick={() => { setRole('seller'); setValidationErrors({}); setError(null); }}
            className={`tab-btn flex-1 flex align-center justify-center gap-sm ${role === 'seller' ? 'active' : ''}`}
            style={{ paddingBottom: '16px' }}
          >
            <Store size={18} /> I want to Sell
          </button>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: 'block', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textAlign: 'center', width: '100%' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          
          {/* Global email/password fields */}
          <div className="grid grid-2 gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              {validationErrors.email && <span className="form-error">{validationErrors.email}</span>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Secure Password</label>
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
          </div>

          {/* BUYER FORM MODULE */}
          {role === 'buyer' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
                {validationErrors.name && <span className="form-error">{validationErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Shipping Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--text-tertiary)' }} />
                  <textarea
                    placeholder="123 Main St, Apt 4B, New York, NY 10001"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="form-input"
                    rows="3"
                    style={{ paddingLeft: '40px', resize: 'vertical' }}
                  />
                </div>
                {validationErrors.shippingAddress && <span className="form-error">{validationErrors.shippingAddress}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Payment Preference</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <select
                    value={paymentPreference}
                    onChange={(e) => setPaymentPreference(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px', appearance: 'none' }}
                  >
                    <option value="Credit Card">Credit Card / Debit Card</option>
                    <option value="PayPal">PayPal Balance</option>
                    <option value="Apple Pay">Apple Pay Checkout</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* SELLER FORM MODULE */}
          {role === 'seller' && (
            <>
              <div className="grid grid-2 gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Business Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Aura Wear Ltd"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {validationErrors.businessName && <span className="form-error">{validationErrors.businessName}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Contact Phone</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {validationErrors.contact && <span className="form-error">{validationErrors.contact}</span>}
                </div>
              </div>

              <div className="grid grid-2 gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tax ID Number (EIN)</label>
                  <div style={{ position: 'relative' }}>
                    <Shield size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      placeholder="XX-XXXXXXX"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {validationErrors.taxId && <span className="form-error">{validationErrors.taxId}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Bank Payout Account</label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      placeholder="Chase Routing/Acct"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {validationErrors.bankAccount && <span className="form-error">{validationErrors.bankAccount}</span>}
                </div>
              </div>

              {/* Styled Mock Document Upload Area */}
              <div className="form-group">
                <label className="form-label">Business Verification Document (.pdf, .png, .jpg)</label>
                <div 
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-tertiary)',
                    position: 'relative'
                  }}
                  onClick={() => document.getElementById('verificationDoc').click()}
                >
                  <FileText size={28} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', color: 'var(--text-secondary)' }}>
                    {verificationFile ? `Selected: ${verificationFile.name}` : 'Click to upload Certificate of Incorporation / Business Registry file'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>
                    Max file size: 5MB
                  </span>
                  <input
                    type="file"
                    id="verificationDoc"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', height: '46px', marginTop: '20px' }}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'buyer' ? 'Buyer' : 'Seller'}`}
          </button>

        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
        </div>

      </div>

      {/* Success Email Verification Modal (Simulated) */}
      {successVerification && (
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
          <div className="modal-content card" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <CheckCircle size={50} style={{ color: 'var(--success)', margin: '0 auto 10px' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Registration Successful!</h3>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              An email verification link has been sent to <strong>{email}</strong>. We have pre-verified this mock account for development.
            </p>

            <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', textAlign: 'left' }}>
              <strong>Verification Status:</strong> Verified<br />
              <strong>Account Type:</strong> {role.toUpperCase()}<br />
              {role === 'seller' && (
                <><strong>Business Listing Portal:</strong> Activated</>
              )}
            </div>

            <button onClick={handleFinishVerification} className="btn btn-primary" style={{ width: '100%', height: '42px', marginTop: '10px' }}>
              Proceed to Account
            </button>
          </div>
        </div>
      )}

    </main>
  );
};
