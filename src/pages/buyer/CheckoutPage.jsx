import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { 
  CreditCard, MapPin, ClipboardList, CheckCircle, 
  ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Eye 
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, getSubtotal, getDiscount, getShipping, getTax, getTotal } = useCart();
  const { user } = useAuth();
  const { placeOrder, loading } = useOrders();
  const { formatPrice } = useCurrency();
  
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success
  
  // Checkout Form State
  const [shippingName, setShippingName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrders, setPlacedOrders] = useState([]);
  
  // Validation Errors
  const [errors, setErrors] = useState({});

  // Populate from user profile on load
  useEffect(() => {
    if (user && user.role === 'buyer') {
      setShippingName(user.profile.name || '');
      setCardHolder(user.profile.name || '');
      
      const addr = user.profile.shippingAddress || '';
      if (addr) {
        // Simple parser
        const parts = addr.split(',');
        setAddress(parts[0]?.trim() || '');
        setCity(parts[1]?.trim() || '');
        // extract zip
        const zipPart = parts[2]?.trim() || '';
        const zipMatch = zipPart.match(/\b\d{5}\b/);
        setZipCode(zipMatch ? zipMatch[0] : '');
      }
    }
  }, [user]);

  // Redirect if cart is empty and not on success step
  useEffect(() => {
    if (cartItems.length === 0 && step < 4) {
      navigate('/cart');
    }
  }, [cartItems, step, navigate]);

  const validateShipping = () => {
    const err = {};
    if (!shippingName.trim()) err.shippingName = 'Recipient name is required.';
    if (!address.trim()) err.address = 'Street address is required.';
    if (!city.trim()) err.city = 'City is required.';
    if (!zipCode.trim() || !/^\d{5}$/.test(zipCode.trim())) {
      err.zipCode = 'A valid 5-digit zip code is required.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validatePayment = () => {
    const err = {};
    if (!cardHolder.trim()) err.cardHolder = 'Cardholder name is required.';
    if (!cardNumber.trim() || !/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
      err.cardNumber = 'A valid 16-digit card number is required.';
    }
    if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry.trim())) {
      err.expiry = 'Expiration date is required (MM/YY).';
    }
    if (!cvv.trim() || !/^\d{3}$/.test(cvv.trim())) {
      err.cvv = '3-digit CVV number is required.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePlaceOrder = async () => {
    setErrorMsg('');
    const fullAddress = `${address}, ${city}, NY ${zipCode}, ${country}`;

    try {
      const orders = await placeOrder(fullAddress);
      setPlacedOrders(orders);
      setStep(4); // Move to Success Screen
    } catch (err) {
      setErrorMsg(err.message || 'Checkout failed. Please inspect your cart item inventory.');
    }
  };

  return (
    <main className="container" style={{ padding: '40px 20px 80px' }}>
      
      {step < 4 && (
        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px' }}>
            Checkout Portal
          </h1>
          {/* Checkout Steps bar */}
          <div className="flex align-center gap-md" style={{ marginTop: '20px' }}>
            <span style={{ fontWeight: step === 1 ? '700' : '400', color: step === 1 ? 'var(--primary)' : 'var(--text-secondary)' }}>1. Shipping</span>
            <span style={{ color: 'var(--text-tertiary)' }}>→</span>
            <span style={{ fontWeight: step === 2 ? '700' : '400', color: step === 2 ? 'var(--primary)' : 'var(--text-secondary)' }}>2. Payment</span>
            <span style={{ color: 'var(--text-tertiary)' }}>→</span>
            <span style={{ fontWeight: step === 3 ? '700' : '400', color: step === 3 ? 'var(--primary)' : 'var(--text-secondary)' }}>3. Review & Submit</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="badge badge-danger" style={{ display: 'block', padding: '12px', borderRadius: '4px', marginBottom: '24px', textAlign: 'center', width: '100%' }}>
          {errorMsg}
        </div>
      )}

      {/* CORE STEPS GRID */}
      {step < 4 && (
        <div className="flex gap-lg flex-mobile-col" style={{ alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN: ACTIVE STEP FORMS */}
          <div className="flex-1" style={{ width: '100%' }}>
            
            {/* STEP 1: SHIPPING DETAILS */}
            {step === 1 && (
              <div className="card flex flex-col gap-md">
                <h3 className="flex align-center gap-sm" style={{ fontWeight: 600, fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <MapPin size={20} style={{ color: 'var(--primary)' }} /> Shipping Address
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Recipient Name</label>
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={shippingName}
                    onChange={e => setShippingName(e.target.value)}
                    className="form-input"
                  />
                  {errors.shippingName && <span className="form-error">{errors.shippingName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St, Apt 4B"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="form-input"
                  />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className="grid grid-2 gap-md">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="form-input"
                    />
                    {errors.city && <span className="form-error">{errors.city}</span>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      placeholder="10001"
                      value={zipCode}
                      onChange={e => setZipCode(e.target.value)}
                      className="form-input"
                    />
                    {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select 
                    value={country} 
                    onChange={e => setCountry(e.target.value)}
                    className="form-input"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>

                <button 
                  onClick={() => { if (validateShipping()) setStep(2); }} 
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', marginTop: '10px' }}
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT METHOD */}
            {step === 2 && (
              <div className="card flex flex-col gap-md">
                <h3 className="flex align-center gap-sm" style={{ fontWeight: 600, fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <CreditCard size={20} style={{ color: 'var(--primary)' }} /> Payment Details
                </h3>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="form-input"
                  />
                  {errors.cardHolder && <span className="form-error">{errors.cardHolder}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="form-input"
                  />
                  {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
                </div>

                <div className="grid grid-2 gap-md">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Expiration Date (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      className="form-input"
                    />
                    {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Security Code (CVV)</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={e => setCvv(e.target.value)}
                      className="form-input"
                    />
                    {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="flex justify-between" style={{ marginTop: '10px' }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">
                    Back to Shipping
                  </button>
                  <button 
                    onClick={() => { if (validatePayment()) setStep(3); }} 
                    className="btn btn-primary"
                  >
                    Review Order Summary <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUBMIT & REVIEW */}
            {step === 3 && (
              <div className="card flex flex-col gap-md">
                <h3 className="flex align-center gap-sm" style={{ fontWeight: 600, fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <ClipboardList size={20} style={{ color: 'var(--primary)' }} /> Review and Submit Order
                </h3>

                <div className="grid grid-2 gap-md text-left" style={{ fontSize: '0.9rem' }}>
                  <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '20px' }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '6px' }}>Shipping To:</h4>
                    <div>{shippingName}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {address}, {city}, NY {zipCode}, {country}
                    </div>
                  </div>
                  <div style={{ paddingLeft: '10px' }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '6px' }}>Payment Method:</h4>
                    <div>Credit Card</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Visa ending in {cardNumber.slice(-4) || '4242'}
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '10px 0' }}></div>

                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Purchasing Items:</h4>
                <div className="flex flex-col gap-sm">
                  {cartItems.map(item => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between align-center" style={{ fontSize: '0.85rem' }}>
                      <div className="flex align-center gap-sm">
                        <img src={item.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <strong>{item.title}</strong> ({item.variantValue})
                          <div style={{ color: 'var(--text-secondary)' }}>Qty: {item.quantity} @ {formatPrice(item.price)} each</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '14px 0' }}></div>

                <div className="flex justify-between" style={{ marginTop: '10px' }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline" disabled={loading}>
                    Back to Payment
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    className="btn btn-primary btn-lg flex align-center gap-sm"
                    disabled={loading}
                  >
                    {loading ? 'Processing Escrow Securely...' : `Place Secure Escrow Order (${formatPrice(getTotal())})`}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: PRICE REVIEWS */}
          <aside className="card glass" style={{ width: '320px', flexShrink: 0, padding: '20px', textAlign: 'left' }}>
            <h4 style={{ fontWeight: 600, fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '14px' }}>
              Totals Overview
            </h4>
            <div className="flex flex-col gap-sm" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              {getDiscount() > 0 && (
                <div className="flex justify-between" style={{ color: 'var(--success)' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(getDiscount())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{getShipping() === 0 ? 'FREE' : formatPrice(getShipping())}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span>{formatPrice(getTax())}</span>
              </div>
            </div>
            <div className="flex justify-between align-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontWeight: 700 }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{formatPrice(getTotal())}</span>
            </div>
          </aside>

        </div>
      )}

      {/* STEP 4: SUCCESS OVERVIEW PLATFORM */}
      {step === 4 && (
        <section className="card flex flex-col align-center justify-center" style={{ padding: '60px 40px', maxWidth: '600px', marginInline: 'auto', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          
          {/* Floating Confetti Particle Animation (SVG Mocked in CSS) */}
          <div className="confetti-container">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`confetti-particle p-${i}`}></div>
            ))}
          </div>

          <div className="success-checkmark" style={{ marginBottom: '24px' }}>
            <CheckCircle size={64} style={{ color: 'var(--success)', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.3))' }} className="checkmark-bounce" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800 }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '460px', margin: '8px auto 24px' }}>
            Thank you for purchasing! Your transaction has been secured in Escrow. The seller has been notified to fulfill your package.
          </p>

          {/* Order Reference Details */}
          <div className="flex flex-col gap-sm" style={{ padding: '20px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', width: '100%', textAlign: 'left', fontSize: '0.85rem', marginBottom: '30px' }}>
            <div style={{ fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
              Transaction Summaries
            </div>
            {placedOrders.map((o, idx) => (
              <div key={idx} className="flex justify-between align-center" style={{ marginBottom: '6px' }}>
                <div>
                  <strong>Order ID:</strong> {o.id}<br />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Fulfillment Status: {o.fulfillmentStatus.toUpperCase()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 600 }}>{formatPrice(o.totalAmount)}</span>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              <strong>Ship To Address:</strong> {address}, {city}, NY {zipCode}
            </div>
          </div>

          <div className="flex gap-md" style={{ width: '100%' }}>
            <Link to="/orders" className="btn btn-secondary flex-1">
              View Order History
            </Link>
            <Link to="/shop" className="btn btn-primary flex-1">
              Continue Shopping
            </Link>
          </div>
        </section>
      )}

      {/* Styled success elements */}
      <style>{`
        .checkmark-bounce {
          animation: bounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        @keyframes bounce {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Float Confetti styles */
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .confetti-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: var(--primary);
          border-radius: 2px;
          opacity: 0.8;
          top: 0;
        }

        .p-0 { left: 10%; background-color: #ec4899; animation: floatConfetti 3.2s infinite ease-in-out; }
        .p-1 { left: 22%; background-color: #8b5cf6; animation: floatConfetti 2.8s infinite ease-in-out 0.4s; }
        .p-2 { left: 35%; background-color: #10b981; animation: floatConfetti 3.5s infinite ease-in-out 0.2s; }
        .p-3 { left: 48%; background-color: #f59e0b; animation: floatConfetti 3.1s infinite ease-in-out 0.6s; }
        .p-4 { left: 60%; background-color: #ec4899; animation: floatConfetti 2.9s infinite ease-in-out 0.3s; }
        .p-5 { left: 75%; background-color: #8b5cf6; animation: floatConfetti 3.4s infinite ease-in-out 0.5s; }
        .p-6 { left: 88%; background-color: #10b981; animation: floatConfetti 3.0s infinite ease-in-out 0.1s; }
        
        .p-7 { left: 15%; background-color: #f59e0b; animation: floatConfetti 3.6s infinite ease-in-out 0.8s; }
        .p-8 { left: 40%; background-color: #ec4899; animation: floatConfetti 2.7s infinite ease-in-out 0.9s; }
        .p-9 { left: 55%; background-color: #8b5cf6; animation: floatConfetti 3.3s infinite ease-in-out 0.7s; }
        .p-10 { left: 70%; background-color: #10b981; animation: floatConfetti 2.9s infinite ease-in-out 1.1s; }
        .p-11 { left: 92%; background-color: #f59e0b; animation: floatConfetti 3.5s infinite ease-in-out 1.0s; }

        @keyframes floatConfetti {
          0% { top: -20px; transform: rotate(0deg) translateX(0); opacity: 1; }
          50% { transform: rotate(180deg) translateX(15px); }
          100% { top: 110%; transform: rotate(360deg) translateX(-15px); opacity: 0; }
        }
      `}</style>

    </main>
  );
};
