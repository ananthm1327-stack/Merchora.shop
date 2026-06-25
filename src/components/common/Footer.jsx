import React from 'react';
import { ShoppingBag, ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <>
      <style>{`
        .footer-cta-container {
          max-width: 1200px;
          margin: 80px auto 40px;
          padding: 0 20px;
          width: 100%;
        }
        .footer-cta-card {
          position: relative;
          overflow: hidden;
          background: rgba(10, 10, 18, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(7, 200, 249, 0.2);
          border-radius: var(--radius-lg);
          padding: 60px 50px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(7, 200, 249, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }
        @media (max-width: 992px) {
          .footer-cta-card {
            flex-direction: column;
            text-align: center;
            padding: 40px 30px;
          }
        }
        .footer-cta-bg-glow {
          position: absolute;
          top: -50%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(7, 200, 249, 0.15) 0%, rgba(13, 65, 225, 0.05) 50%, transparent 100%);
          z-index: 1;
          pointer-events: none;
          filter: blur(40px);
        }
        .footer-cta-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
          text-align: left;
        }
        @media (max-width: 992px) {
          .footer-cta-content {
            text-align: center;
          }
        }
        .footer-cta-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .footer-cta-desc {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }
        .footer-cta-actions {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 16px;
          flex-shrink: 0;
        }
        @media (max-width: 576px) {
          .footer-cta-actions {
            flex-direction: column;
            width: 100%;
          }
        }
        .footer-cta-btn-primary {
          background: linear-gradient(90deg, #07C8F9, #0D41E1);
          color: #fff;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: var(--radius-sm);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(7, 200, 249, 0.35);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          cursor: pointer;
        }
        .footer-cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(7, 200, 249, 0.5);
        }
        .footer-cta-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          color: #fff;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: var(--radius-sm);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .footer-cta-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px);
        }
        .futur-footer {
          background-color: #050508 !important;
          color: #a0a5b5 !important;
          border-top: 1px solid rgba(7, 200, 249, 0.15) !important;
          padding: 80px 0 40px !important;
          font-family: var(--font-sans);
          text-align: left;
        }
        .futur-footer h4 {
          font-family: var(--font-display) !important;
          font-weight: 700 !important;
          font-size: 0.9rem !important;
          letter-spacing: 2px !important;
          color: #fff !important;
          margin-bottom: 20px !important;
          text-transform: uppercase;
        }
        .futur-footer a {
          color: #8f95a5 !important;
          transition: all 0.25s ease !important;
          display: inline-block;
          font-size: 0.9rem;
        }
        .futur-footer a:hover {
          color: #07C8F9 !important;
          transform: translateX(4px);
          text-shadow: 0 0 8px rgba(7, 200, 249, 0.4);
        }
        .futur-footer-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #8f95a5;
        }
        .newsletter-form {
          display: flex;
          gap: 8px;
          position: relative;
          margin-top: 8px;
        }
        .newsletter-input {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
          font-size: 0.85rem !important;
          padding: 10px 16px !important;
          height: 42px !important;
          flex: 1;
          border-radius: var(--radius-sm) !important;
          transition: all 0.3s ease !important;
        }
        .newsletter-input:focus {
          border-color: #07C8F9 !important;
          background: rgba(7, 200, 249, 0.03) !important;
          box-shadow: 0 0 15px rgba(7, 200, 249, 0.2) !important;
        }
        .newsletter-btn {
          background: linear-gradient(90deg, #07C8F9, #0D41E1) !important;
          border: none !important;
          color: #fff !important;
          width: 42px !important;
          height: 42px !important;
          border-radius: var(--radius-sm) !important;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }
        .newsletter-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(7, 200, 249, 0.5) !important;
        }
        .footer-capsule-btn {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: var(--radius-full) !important;
          padding: 6px 16px !important;
          font-size: 0.75rem !important;
          color: #8f95a5 !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }
        .footer-capsule-btn:hover {
          color: #07C8F9 !important;
          border-color: #07C8F9 !important;
          background: rgba(7, 200, 249, 0.05) !important;
          box-shadow: 0 0 10px rgba(7, 200, 249, 0.2) !important;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          background-color: var(--success);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px var(--success);
          animation: pulse-glow 1.5s infinite;
        }
        @keyframes pulse-glow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Dynamic CTA Banner above the Footer */}
      <section className="footer-cta-container">
        <div className="footer-cta-card">
          <div className="footer-cta-bg-glow" />
          <div className="footer-cta-content">
            <h3 className="footer-cta-title">
              Ready to Upgrade Your Commerce Experience?
            </h3>
            <p className="footer-cta-desc">
              Create a merchant workspace to list collections in minutes, or explore thousands of verified digital products and streetwear collections.
            </p>
          </div>
          <div className="footer-cta-actions">
            <Link to="/register" className="footer-cta-btn-primary">
              <Zap size={16} /> Start Selling
            </Link>
            <Link to="/catalog" className="footer-cta-btn-secondary">
              Browse Goods <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Futuristic Footer */}
      <footer className="futur-footer">
        <div className="container grid grid-4 gap-lg">
          
          {/* Brand Block */}
          <div className="flex flex-col gap-sm">
            <Link to="/" className="flex align-center gap-sm" style={{ fontWeight: 800, fontSize: '1.3rem' }}>
              <img src="/icon.svg" alt="Merchora Icon" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
              <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>Merchora</span>
            </Link>
            <p className="futur-footer-text" style={{ marginTop: '8px' }}>
              The decentralized-grade dual-sided platform empowering retail collectors and curated builders. Secure escrow ledgers, instant payouts.
            </p>
          </div>

          {/* Shop links */}
          <div className="flex flex-col gap-sm">
            <h4>Shopping</h4>
            <div className="flex flex-col gap-sm">
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
            <h4>Sellers</h4>
            <div className="flex flex-col gap-sm">
              <Link to="/seller/dashboard">Seller Portal</Link>
              <Link to="/register">Create Business Account</Link>
              <Link to="/login">Inventory Dashboard</Link>
              <span style={{ fontSize: '0.8rem', color: '#10b881', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span className="pulse-dot" /> Instant Payouts Active
              </span>
            </div>
          </div>

          {/* Newsletter / Contact */}
          <div className="flex flex-col gap-sm">
            <h4>Newsletter</h4>
            <p className="futur-footer-text">Subscribe for curated product releases and platform updates.</p>
            <form onSubmit={e => e.preventDefault()} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Email address" 
                className="newsletter-input" 
              />
              <button className="newsletter-btn">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        <div className="container" style={{ marginTop: '50px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#6f7585' }}>© 2026 Merchora.shop. All rights reserved. Precision-engineered secure trading.</span>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            <button 
              className="footer-capsule-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-modal', { detail: 'privacy' }))}
            >
              Privacy Policy
            </button>
            <button 
              className="footer-capsule-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-modal', { detail: 'terms' }))}
            >
              Terms of Sale
            </button>
            <button 
              className="footer-capsule-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-modal', { detail: 'support' }))}
            >
              Contact Support
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
