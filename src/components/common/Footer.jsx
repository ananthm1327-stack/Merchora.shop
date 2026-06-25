import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '60px 0 30px',
      marginTop: 'auto',
      textAlign: 'left'
    }}>
      <div className="container grid grid-4 gap-lg">
        
        {/* Brand Block */}
        <div className="flex flex-col gap-sm">
          <Link to="/" className="flex align-center gap-sm" style={{ fontWeight: 800, fontSize: '1.3rem' }}>
            <img src="/icon.svg" alt="Merchora Icon" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
            <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Merchora</span>
          </Link>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            A premium dual-sided marketplace enabling curated sellers and global buyers to trade securely and effortlessly.
          </p>
        </div>

        {/* Shop links */}
        <div className="flex flex-col gap-sm">
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>SHOPPING</h4>
          <div className="flex flex-col gap-sm" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Link to="/catalog?category=Apparel">Apparel & Fashion</Link>
            <Link to="/catalog?category=Electronics">Electronics & Gear</Link>
            <Link to="/catalog?category=Footwear">Footwear & Sneakers</Link>
            <Link to="/catalog?category=Accessories">Everyday Accessories</Link>
            <Link to="/catalog?category=Beauty%20%26%20Personal%20Care">Beauty & Care</Link>
            <Link to="/catalog?category=Sports%20%26%20Outdoors">Sports & Outdoors</Link>
            <Link to="/catalog?category=Books%20%26%20Media">Books & Media</Link>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex flex-col gap-sm">
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>SELLERS</h4>
          <div className="flex flex-col gap-sm" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Link to="/seller/dashboard">Seller Portal</Link>
            <Link to="/register">Create Business Account</Link>
            <Link to="/login">Inventory Dashboard</Link>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ● Instant Payouts Active
            </span>
          </div>
        </div>

        {/* Newsletter / Contact */}
        <div className="flex flex-col gap-sm">
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>NEWSLETTER</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subscribe for curated product releases and seller platform updates.</p>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: '8px', position: 'relative', marginTop: '4px' }}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="form-input" 
              style={{ fontSize: '0.8rem', padding: '10px 14px', height: '38px', flex: 1, borderRadius: 'var(--radius-sm)' }}
            />
            <button className="btn btn-primary" style={{ padding: '0 12px', height: '38px', borderRadius: 'var(--radius-sm)' }}>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

      </div>

      <div className="container" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>© 2026 Merchora.shop. All rights reserved. Built for buyer-seller separation excellence.</span>
        <div className="flex gap-md" style={{ marginTop: '10px' }}>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-global-modal', { detail: 'privacy' }))}
            style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-global-modal', { detail: 'terms' }))}
            style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Terms of Sale
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-global-modal', { detail: 'support' }))}
            style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </footer>
  );
};
