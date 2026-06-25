import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext';
import { ProductProvider, useProducts } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { X, Send, Lock, Landmark, Mail, MessageSquare, Sparkles, Bot, Minimize2 } from 'lucide-react';

// Pages
import { HomePage } from './pages/buyer/HomePage';
import { CatalogPage } from './pages/buyer/CatalogPage';
import { ProductDetailPage } from './pages/buyer/ProductDetailPage';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { OrderHistoryPage } from './pages/buyer/OrderHistoryPage';
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Protected Route Guard for Buyers
const BuyerProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading authentication session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'buyer') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Protected Route Guard for Sellers
const SellerProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading merchant credentials...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 🛍️ Cursor and Click Sparks Effect Component
const CursorAndSparks = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device supports hover interactions (desktop vs touch)
    const checkHoverSupport = () => {
      setIsMobile(!window.matchMedia('(hover: hover)').matches);
    };
    checkHoverSupport();
    window.addEventListener('resize', checkHoverSupport);

    // Track mouse position to update cursor position
    const onMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Expand cursor ring when hovering over interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, select, input, textarea, [role="button"], .card, .btn, .tab-btn');
      if (isInteractive) {
        cursorRef.current?.classList.add('hovered');
        ringRef.current?.classList.add('hovered');
      } else {
        cursorRef.current?.classList.remove('hovered');
        ringRef.current?.classList.remove('hovered');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('resize', checkHoverSupport);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Click Sparks listener (spawns floating ecommerce themed emojis)
  useEffect(() => {
    const emojis = ['🛍️', '🛒', '🏷️', '🎁', '✨', '💸', '💎', '💳', '📦'];

    const onClick = (e) => {
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('span');
        spark.className = 'click-spark-emoji';
        spark.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Page coordinates are relative to document page scroll
        spark.style.left = `${e.pageX}px`;
        spark.style.top = `${e.pageY}px`;

        // Calculate dynamic random trajectories
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 80;
        const dx = `${Math.cos(angle) * distance}px`;
        const dy = `${Math.sin(angle) * distance}px`;
        const rot = `${(Math.random() - 0.5) * 180}deg`;

        spark.style.setProperty('--dx', dx);
        spark.style.setProperty('--dy', dy);
        spark.style.setProperty('--rot', rot);

        document.body.appendChild(spark);

        // Remove element once CSS animation has finished
        setTimeout(() => {
          spark.remove();
        }, 800);
      }
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
};

// Main Layout Manager that conditionally renders headers, footers, cookie banners, and global modals
const LayoutManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { products } = useProducts();
  const { formatPrice } = useCurrency();
  const isSellerRoute = location.pathname.startsWith('/seller');

  // Cookie Consent banner state
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  
  // Modals state: 'privacy' | 'terms' | 'support' | null
  const [activeModal, setActiveModal] = useState(null);

  // Contact support form states
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubject, setSupportSubject] = useState('General Inquiry');
  const [supportMessage, setSupportMessage] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);
  const [supportErrors, setSupportErrors] = useState({});

  // AI Shopping Agent Chat panel states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: "Hello! I am LANA, Merchora's AI Shopping Assistant. How can I help you today? You can ask me to recommend items (e.g. 'recommend shoes', 'do you have face serum?'), search under a budget (e.g. 'electronics under $100'), or ask about our escrow and shipping policies."
    }
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatTyping]);

  // AI Shopping Agent message submission handler
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');
    setIsChatTyping(true);

    setTimeout(() => {
      const query = userText.toLowerCase();
      let matched = [];
      let maxPriceFilter = null;

      // Extract price filter boundaries
      const priceMatch = query.match(/(?:under|below|less than|max|budget)\s*\$?\s*(\d+)/);
      if (priceMatch) {
        maxPriceFilter = parseFloat(priceMatch[1]);
      }

      // Catalog recommendation filtering
      matched = products.filter(p => {
        if (p.publicationStatus !== 'published') return false;

        // Apply price constraint
        if (maxPriceFilter && p.price > maxPriceFilter) return false;

        // Keyword checking
        const inTitle = p.title.toLowerCase().includes(query);
        const inDesc = p.description.toLowerCase().includes(query);
        const inCat = p.category.toLowerCase().includes(query);
        const inTags = p.tags.some(t => t.toLowerCase().includes(query));

        // Generic category name checks
        const matchesCategoryShort = (
          (query.includes('clothe') || query.includes('shirt') || query.includes('dress') || query.includes('apparel') || query.includes('jacket') || query.includes('wear')) && p.category === 'Apparel'
        ) || (
          (query.includes('headphone') || query.includes('gear') || query.includes('electronics') || query.includes('speaker') || query.includes('device')) && p.category === 'Electronics'
        ) || (
          (query.includes('shoe') || query.includes('boot') || query.includes('sneaker') || query.includes('footwear') || query.includes('sandal')) && p.category === 'Footwear'
        ) || (
          (query.includes('wallet') || query.includes('bag') || query.includes('backpack') || query.includes('accessories')) && p.category === 'Accessories'
        ) || (
          (query.includes('mug') || query.includes('home') || query.includes('living') || query.includes('bed') || query.includes('pillow')) && p.category === 'Home & Living'
        ) || (
          (query.includes('serum') || query.includes('skin') || query.includes('cream') || query.includes('beauty') || query.includes('makeup') || query.includes('care')) && p.category === 'Beauty & Personal Care'
        ) || (
          (query.includes('yoga') || query.includes('sports') || query.includes('outdoors') || query.includes('hiking') || query.includes('gym') || query.includes('dumbbells')) && p.category === 'Sports & Outdoors'
        ) || (
          (query.includes('book') || query.includes('media') || query.includes('guide')) && p.category === 'Books & Media'
        ) || (
          (query.includes('toy') || query.includes('game') || query.includes('puzzle') || query.includes('chess') || query.includes('kids')) && p.category === 'Toys & Games'
        ) || (
          (query.includes('car') || query.includes('tire') || query.includes('automotive') || query.includes('inflator')) && p.category === 'Automotive'
        );

        return inTitle || inDesc || inCat || inTags || matchesCategoryShort;
      });

      // Sort outputs
      if (query.includes('cheap') || query.includes('lowest price') || query.includes('cheapest')) {
        matched.sort((a, b) => a.price - b.price);
      } else if (query.includes('expensive') || query.includes('highest price')) {
        matched.sort((a, b) => b.price - a.price);
      } else {
        matched.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      }

      const recs = matched.slice(0, 3);
      let reply = '';
      
      if (recs.length > 0) {
        reply = `I found some items in our catalog that might interest you! Click on them to view details:`;
      } else if (query.includes('escrow') || query.includes('safe') || query.includes('protect') || query.includes('security')) {
        reply = "Merchora uses a secure Escrow ledger. All buyer payments are held in escrow and are only transferred to the merchant's payable balance after they provide shipping tracking codes, protecting both parties from fraud.";
      } else if (query.includes('refund') || query.includes('return') || query.includes('refunds')) {
        reply = "We offer a 30-day hassle-free refund policy. If an item is defective or does not arrive as described, customer support will moderate the escrow balance to refund your payment.";
      } else if (query.includes('shipping') || query.includes('delivery') || query.includes('freight')) {
        reply = "Orders are split by merchant and shipped directly. Shipping is FREE for orders over $100; otherwise, flat $9.99. Merchants must supply tracking details to receive escrow payouts.";
      } else if (query.includes('fee') || query.includes('commission') || query.includes('cost') || query.includes('charge')) {
        reply = "Buyers pay no additional usage fees. Sellers pay a flat 10.0% marketplace commission on completed escrow sales to cover secure hosting, payment gateways, and dispute resolution.";
      } else if (query.includes('payout') || query.includes('bank') || query.includes('transfer')) {
        reply = "Verified sellers can request direct payouts of their settled escrow earnings to their target bank accounts instantly. Payout validation takes under 24 hours.";
      } else {
        reply = "I couldn't find any specific items or answers matching your query. You can ask me about catalog recommendations (e.g. 'shoes under $50', 'do you have face serum?'), or ask about our escrow, shipping, and refund guidelines!";
      }

      setChatHistory(prev => [...prev, { sender: 'bot', text: reply, products: recs }]);
      setIsChatTyping(false);
    }, 1200);
  };

  useEffect(() => {
    // Show cookie banner if not accepted yet
    const consent = localStorage.getItem('merchora_cookies_accepted');
    if (!consent) {
      setTimeout(() => setShowCookieConsent(true), 1500); // slight delay for visual impact
    }

    // Global listener to trigger modals from Footer or other links
    const handleOpenModalEvent = (e) => {
      setActiveModal(e.detail);
    };

    window.addEventListener('open-global-modal', handleOpenModalEvent);
    return () => window.removeEventListener('open-global-modal', handleOpenModalEvent);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('merchora_cookies_accepted', 'true');
    setShowCookieConsent(false);
    addToast('Cookie preferences updated. Persistent cart enabled.', 'success');
  };

  const handleDeclineCookies = () => {
    setShowCookieConsent(false);
    addToast('Some convenience preferences like auto-save may be limited.', 'info');
  };

  // Support Ticket Submit Validator
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!supportName.trim()) errs.name = 'Name is required.';
    if (!supportEmail.trim() || !/\S+@\S+\.\S+/.test(supportEmail)) errs.email = 'Valid email is required.';
    if (!supportMessage.trim()) errs.message = 'Message details are required.';

    if (Object.keys(errs).length > 0) {
      setSupportErrors(errs);
      addToast('Please inspect supporting form validation errors.', 'error');
      return;
    }

    setSendingSupport(true);
    setSupportErrors({});

    // Simulate server POST submission
    setTimeout(() => {
      setSendingSupport(false);
      addToast(`Support ticket submitted! Ref Code: MC-TK-${Math.floor(Math.random()*9000+1000)}`, 'success');
      setActiveModal(null); // close modal
      // Reset form
      setSupportName('');
      setSupportEmail('');
      setSupportSubject('General Inquiry');
      setSupportMessage('');
    }, 1200);
  };

  return (
    <>
      <CursorAndSparks />
      <Header />
      
      <div className="flex-1 flex flex-col" style={{ width: '100%' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CatalogPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          <Route path="/checkout" element={
            <BuyerProtectedRoute>
              <CheckoutPage />
            </BuyerProtectedRoute>
          } />
          <Route path="/orders" element={
            <BuyerProtectedRoute>
              <OrderHistoryPage />
            </BuyerProtectedRoute>
          } />

          <Route path="/seller/dashboard" element={
            <SellerProtectedRoute>
              <SellerDashboard />
            </SellerProtectedRoute>
          } />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isSellerRoute && <Footer />}

      {/* 🍪 COOKIE CONSENT GLASS BANNER */}
      {showCookieConsent && (
        <div 
          className="card glass"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '640px',
            padding: '20px',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            animation: 'cookie-slide-up 0.5s ease both',
            flexWrap: 'wrap',
            textAlign: 'left'
          }}
        >
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Cookie Preferences & Persistence
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Merchora uses browser storage to authorize user sessions, persist active shopping bags, and manage automatic logouts. View our <span onClick={() => { setActiveModal('privacy'); }} style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>Privacy Policy</span> for details.
            </p>
          </div>
          
          <div className="flex gap-sm" style={{ flexShrink: 0 }}>
            <button onClick={handleDeclineCookies} className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
              Decline
            </button>
            <button onClick={handleAcceptCookies} className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem' }}>
              Accept Cookies
            </button>
          </div>
        </div>
      )}

      {/* 🔒 GLOBAL POLICY & SUPPORT MODALS */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200
        }}>
          <div className="modal-content card" style={{ maxWidth: '580px', width: '90vw', maxHeight: '85vh', overflowY: 'auto', padding: '30px' }}>
            
            {/* Modal Header */}
            <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }} className="flex align-center gap-xs">
                {activeModal === 'privacy' && <><Lock size={20} style={{ color: 'var(--primary)' }} /> Privacy Policy</>}
                {activeModal === 'terms' && <><Landmark size={20} style={{ color: 'var(--primary)' }} /> Terms of Sale</>}
                {activeModal === 'support' && <><Mail size={20} style={{ color: 'var(--primary)' }} /> Contact Help & Support</>}
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Contents based on trigger type */}
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, textAlign: 'left' }}>
              
              {/* Privacy Policy */}
              {activeModal === 'privacy' && (
                <div className="flex flex-col gap-sm" style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
                  <p><strong>Effective Date: June 25, 2026</strong></p>
                  <p>At Merchora.shop, we hold user security and data privacy in high regard. This policy details how our escrow-based marketplace utilizes data permissions.</p>
                  
                  <h4 style={{ color: 'var(--text-primary)', marginTop: '10px', fontSize: '0.95rem' }}>1. Personal Data Handled</h4>
                  <ul style={{ paddingLeft: '16px', listStyleType: 'disc' }} className="flex flex-col gap-xs">
                    <li><strong>Buyer Details:</strong> Name, secure session token hashes, delivery shipping addresses, and billing payment method preferences.</li>
                    <li><strong>Seller Details:</strong> Registered business names EIN taxes registration numbers, payout bank details, and support phone contacts.</li>
                  </ul>

                  <h4 style={{ color: 'var(--text-primary)', marginTop: '10px', fontSize: '0.95rem' }}>2. Storage & Cookie Usage</h4>
                  <p>We do not store plain-text passwords or card details in localized caches. Browser LocalStorage and SessionStorage are strictly used to coordinate cart persistence, verify active roles, and monitor user inactivity watchdog sessions.</p>
                  
                  <h4 style={{ color: 'var(--text-primary)', marginTop: '10px', fontSize: '0.95rem' }}>3. Inactivity Safeguards</h4>
                  <p>To protect shared workspace terminals, active login tokens are completely deleted from the session storage space following 10 minutes of idle mouse or keyboard inactivity.</p>
                </div>
              )}

              {/* Terms of Sale */}
              {activeModal === 'terms' && (
                <div className="flex flex-col gap-sm" style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }}>
                  <p><strong>Last Updated: June 25, 2026</strong></p>
                  <p>Welcome to Merchora.shop. By checking out items or listing products on our marketplace, you agree to these legal conditions.</p>
                  
                  <h4 style={{ color: 'var(--text-primary)', marginTop: '10px', fontSize: '0.95rem' }}>1. The Escrow System</h4>
                  <p>To prevent fraudulent listings, all payments completed during checkout are held in a secure Escrow ledger. Funds are only calculated as transferable earnings for the merchant once they input valid carrier tracking numbers and the order is marked as fulfilled.</p>
                  
                  <h4 style={{ color: 'var(--text-primary)', marginTop: '10px', fontSize: '0.95rem' }}>2. Split Orders Commission Split</h4>
                  <p>Checkout baskets containing products from multiple distinct sellers will automatically split into separate order statements. Merchora applies a flat 10.0% service commission split on gross sales to sustain hosting, database synchronizations, and customer support.</p>
                  
                  <h4 style={{ color: 'var(--text-primary)', marginTop: '10px', fontSize: '0.95rem' }}>3. Payout Timelines</h4>
                  <p>Verified sellers can request transfers of available balances directly into bank targets using the Financials console. Payouts require verified EIN credentials.</p>
                </div>
              )}

              {/* Contact Support Form */}
              {activeModal === 'support' && (
                <form onSubmit={handleSupportSubmit} className="flex flex-col gap-md">
                  <p style={{ marginBottom: '10px' }}>Submit a ticket to the Merchora support desk. We respond to inquiries within 2 hours.</p>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="e.g. Alex Johnson"
                      value={supportName}
                      onChange={e => setSupportName(e.target.value)}
                    />
                    {supportErrors.name && <span className="form-error">{supportErrors.name}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={supportEmail}
                      onChange={e => setSupportEmail(e.target.value)}
                    />
                    {supportErrors.email && <span className="form-error">{supportErrors.email}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Department Inquiry</label>
                    <select 
                      className="form-input"
                      value={supportSubject}
                      onChange={e => setSupportSubject(e.target.value)}
                    >
                      <option value="General Inquiry">General Marketplace Question</option>
                      <option value="Seller Payout Support">Merchant Banking & EIN Payouts</option>
                      <option value="Escrow Shipping Dispute">Buyer Escrow Delivery Issue</option>
                      <option value="Technical Error Code">System Bug or Tech Feedback</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Inquiry Details</label>
                    <textarea 
                      className="form-input"
                      rows="4"
                      placeholder="Please specify order IDs, product details, or steps to reproduce technical issues..."
                      value={supportMessage}
                      onChange={e => setSupportMessage(e.target.value)}
                    />
                    {supportErrors.message && <span className="form-error">{supportErrors.message}</span>}
                  </div>

                  <div className="flex gap-sm justify-end" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setActiveModal(null)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary flex align-center gap-xs" disabled={sendingSupport}>
                      <Send size={14} /> {sendingSupport ? 'Submitting ticket...' : 'Submit Support Ticket'}
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* General modal close footer */}
            {activeModal !== 'support' && (
              <div className="flex justify-end" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '16px' }}>
                <button onClick={() => setActiveModal(null)} className="btn btn-outline">
                  Close Window
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 🤖 FLOATING AI SHOPPING AGENT WIDGET */}
      {!isSellerRoute && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          
          {/* Expanded Chat Window */}
          {isChatOpen && (
            <div 
              className="card glass" 
              style={{ 
                width: '320px', 
                height: '420px', 
                maxHeight: '65vh', 
                display: 'flex', 
                flexDirection: 'column', 
                padding: 0, 
                overflow: 'hidden', 
                marginBottom: '14px', 
                boxShadow: 'var(--shadow-lg)',
                animation: 'chat-slide-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
                border: '1px solid var(--border-color)',
                textAlign: 'left'
              }}
            >
              {/* Header */}
              <div style={{ 
                backgroundColor: 'var(--bg-tertiary)', 
                padding: '10px 14px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div className="flex align-center gap-sm">
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary-glow)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <Bot size={16} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-display)' }} className="flex align-center gap-xs">
                      LANA <Sparkles size={10} style={{ color: 'var(--primary)' }} />
                    </h4>
                    <span style={{ fontSize: '0.65rem', color: 'var(--success)', display: 'block', fontWeight: 600 }}>● Instant Assistant</span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                  <Minimize2 size={14} />
                </button>
              </div>

              {/* Message Body */}
              <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {chatHistory.map((msg, idx) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: isBot ? 'flex-start' : 'flex-end',
                      maxWidth: '85%',
                      alignSelf: isBot ? 'flex-start' : 'flex-end'
                    }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '2px', fontWeight: 600 }}>
                        {isBot ? 'LANA' : 'You'}
                      </span>
                      
                      <div style={{ 
                        padding: '8px 12px', 
                        borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px', 
                        backgroundColor: isBot ? 'var(--bg-tertiary)' : 'var(--primary)',
                        color: isBot ? 'var(--text-primary)' : 'var(--text-on-accent)',
                        fontSize: '0.78rem',
                        lineHeight: 1.4,
                        boxShadow: 'var(--shadow-sm)',
                        wordBreak: 'break-word'
                      }}>
                        {msg.text}
                      </div>

                      {/* Recommend Product Cards inside bubble */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="flex flex-col gap-xs" style={{ width: '100%', marginTop: '6px' }}>
                          {msg.products.map(p => (
                            <div 
                              key={p.id}
                              onClick={() => { navigate(`/product/${p.id}`); setIsChatOpen(false); }}
                              className="card"
                              style={{ 
                                padding: '6px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                gap: '8px', 
                                backgroundColor: 'var(--bg-secondary)', 
                                borderColor: 'var(--border-color)',
                                borderWidth: '1px',
                                borderRadius: '6px',
                                width: '230px'
                              }}
                            >
                              <img src={p.images[0]} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                                  {p.title}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700 }}>
                                  {formatPrice(p.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isChatTyping && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '2px' }}>LANA</span>
                    <div style={{ padding: '8px 14px', borderRadius: '0 12px 12px 12px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }} className="flex gap-xs align-center">
                      <span className="dot-blink" style={{ animation: 'blink 1s infinite 0.1s' }}>•</span>
                      <span className="dot-blink" style={{ animation: 'blink 1s infinite 0.2s' }}>•</span>
                      <span className="dot-blink" style={{ animation: 'blink 1s infinite 0.3s' }}>•</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input Form Footer */}
              <form onSubmit={handleChatSubmit} style={{ 
                padding: '10px 12px', 
                borderTop: '1px solid var(--border-color)', 
                display: 'flex', 
                gap: '6px', 
                backgroundColor: 'var(--bg-secondary)' 
              }}>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="Recommend beauty serum, shoes..."
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  style={{ fontSize: '0.75rem', padding: '6px 10px', height: '32px', flex: 1 }}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary btn-icon-only" 
                  style={{ width: '32px', height: '32px', padding: 0, borderRadius: 'var(--radius-sm)' }}
                >
                  <Send size={12} />
                </button>
              </form>

            </div>
          )}

          {/* Floating Bubble Button */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)} 
            className="btn btn-primary" 
            style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '50%', 
              padding: 0, 
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: !isChatOpen ? 'pulse-glow 2s infinite' : 'none'
            }}
          >
            {isChatOpen ? <X size={18} /> : <MessageSquare size={18} />}
          </button>

        </div>
      )}

      {/* Styled slide keyframes */}
      <style>{`
        @keyframes cookie-slide-up {
          from { transform: translate(-50%, 150%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes chat-slide-in {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
      `}</style>
    </>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CurrencyProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <LayoutManager />
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
