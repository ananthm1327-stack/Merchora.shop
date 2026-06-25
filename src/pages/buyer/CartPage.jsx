import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Trash2, ShoppingBag, Plus, Minus, Tag, AlertTriangle, ArrowRight, X } from 'lucide-react';

export const CartPage = () => {
  const { 
    cartItems, coupon, couponError, cartAlerts, 
    updateQuantity, removeFromCart, applyCoupon, removeCoupon, 
    clearAlerts, getSubtotal, getDiscount, getShipping, getTax, getTotal 
  } = useCart();
  
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Handle apply coupon
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setPromoSuccess('');
    if (!couponCode.trim()) return;

    try {
      const data = await applyCoupon(couponCode);
      setPromoSuccess(`Promo code "${data.code}" successfully applied! ${data.description}.`);
      setCouponCode('');
    } catch (err) {
      // error is handled inside context
    }
  };

  return (
    <main className="container" style={{ padding: '40px 20px 80px' }}>
      
      <div style={{ textAlign: 'left', marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px' }}>
          Shopping Cart Bag
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review your items and complete checkout settings
        </p>
      </div>

      {/* RECONCILIATION CATALOG SYSTEM ALERTS */}
      {cartAlerts.length > 0 && (
        <div className="card low-stock-alert" style={{ marginBottom: '30px', animation: 'none', borderColor: 'var(--warning)', backgroundColor: 'var(--warning-bg)' }}>
          <div className="flex align-center justify-between" style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.95rem', borderBottom: '1px solid rgba(245,158,11,0.2)', paddingBottom: '8px', marginBottom: '10px' }}>
            <span className="flex align-center gap-sm">
              <AlertTriangle size={18} /> Cart System Updates
            </span>
            <button onClick={clearAlerts} className="btn-icon-only" style={{ padding: '2px', color: 'var(--text-primary)' }} title="Clear Alerts">
              <X size={16} />
            </button>
          </div>
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc', textAlign: 'left', fontSize: '0.85rem' }}>
            {cartAlerts.map((alert, idx) => (
              <li key={idx} style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {cartItems.length === 0 ? (
        // Empty Cart Visual
        <div className="card flex flex-col align-center justify-center" style={{ padding: '80px 40px', minHeight: '340px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: 'var(--text-tertiary)'
          }}>
            <ShoppingBag size={40} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600 }}>Your Cart is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 24px' }}>
            Looks like you haven't added anything to your cart bag yet. Explore our marketplace collections to discover premium items.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping Collections
          </Link>
        </div>
      ) : (
        <div className="flex gap-lg flex-mobile-col" style={{ alignItems: 'flex-start' }}>
          
          {/* LEFT PANEL: CART ITEMS LIST */}
          <div className="flex-1 flex flex-col gap-md" style={{ width: '100%' }}>
            {cartItems.map(item => (
              <div 
                key={`${item.productId}-${item.variantId}`} 
                className="card flex align-center justify-between flex-mobile-col gap-md"
                style={{ padding: '16px', textAlign: 'left' }}
              >
                
                {/* Visual info */}
                <div className="flex align-center gap-md" style={{ flex: 1, minWidth: 0 }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                  />
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <strong>Option:</strong> {item.variantValue}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginTop: '6px' }}>
                      {formatPrice(item.price)} <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>each</span>
                    </div>
                  </div>
                </div>

                {/* Adjustments & Deletion */}
                <div className="flex align-center gap-lg justify-between flex-mobile-col" style={{ width: 'auto' }}>
                  
                  {/* Quantity Toggles */}
                  <div className="flex align-center" style={{ 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-full)', 
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      style={{ padding: '8px 12px', display: 'flex', alignItems: 'center' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      style={{ padding: '8px 12px', display: 'flex', alignItems: 'center' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Net Total */}
                  <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="btn btn-outline btn-sm text-danger" 
                    style={{ padding: '8px', borderRadius: '50%', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            ))}
          </div>

          {/* RIGHT PANEL: ORDER TOTALS SUMMARY */}
          <aside className="card glass" style={{ width: '380px', flexShrink: 0, padding: '24px', textAlign: 'left', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
              Order Summary
            </h3>

            {/* Price breakdown */}
            <div className="flex flex-col gap-sm" style={{ fontSize: '0.9rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 500 }}>{formatPrice(getSubtotal())}</span>
              </div>
              
              {coupon && (
                <div className="flex justify-between" style={{ color: 'var(--success)' }}>
                  <span className="flex align-center gap-xs">
                    <Tag size={12} /> Coupon ({coupon.code})
                  </span>
                  <span>-{formatPrice(getDiscount())}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Shipping Estimate</span>
                <span style={{ fontWeight: 500 }}>
                  {getShipping() === 0 ? (
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>FREE</span>
                  ) : (
                    formatPrice(getShipping())
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (8.875%)</span>
                <span style={{ fontWeight: 500 }}>{formatPrice(getTax())}</span>
              </div>
            </div>

            {/* Coupons Form */}
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Promo Code / Gift Voucher</label>
              
              {coupon ? (
                <div className="flex align-center justify-between" style={{ padding: '8px 12px', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-bg)', marginTop: '6px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                    Applied: {coupon.code}
                  </div>
                  <button onClick={removeCoupon} style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 600 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-sm" style={{ marginTop: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. MERCHORA10" 
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '0.85rem', flex: 1 }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0 16px' }}>
                    Apply
                  </button>
                </form>
              )}

              {promoSuccess && <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '6px' }}>{promoSuccess}</div>}
              {couponError && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '6px' }}>{couponError}</div>}
            </div>

            {/* Total Net */}
            <div className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--primary)' }}>
                {formatPrice(getTotal())}
              </span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg flex align-center justify-center gap-sm"
              style={{ width: '100%', height: '48px' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <Link to="/shop" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                ← Continue Shopping
              </Link>
            </div>

          </aside>

        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          aside { width: 100% !important; position: static !important; }
        }
      `}</style>
    </main>
  );
};
