import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../../contexts/OrderContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ShoppingBag, Truck, Calendar, CreditCard, RefreshCw, Clipboard } from 'lucide-react';

export const OrderHistoryPage = () => {
  const { buyerOrders, fetchBuyerOrders, loading } = useOrders();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBuyerOrders();
    }
  }, [user, fetchBuyerOrders]);

  if (!user || user.role !== 'buyer') {
    return (
      <main className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Access Denied</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '10px 0 20px' }}>You must be logged in as a Buyer to view your order history.</p>
        <Link to="/login" className="btn btn-primary">Log In</Link>
      </main>
    );
  }

  // Reorder Handler: Add all items from a past order back into active cart
  const handleReorder = (order) => {
    // We add each item. Note: we mock finding the product variant
    // In our simplified mock db, we can find the matching product in the catalog and add its first active variant.
    // If some items are sold out, addToCart will notify the user.
    order.products.forEach(item => {
      const mockProduct = {
        id: item.productId,
        title: item.title.split('(')[0].trim(),
        images: [item.image],
        sellerId: order.sellerId
      };
      
      const mockVariant = {
        id: item.variantId || 'v1',
        name: 'Size',
        value: item.title.split('(')[1]?.replace(')', '')?.split(':')[1]?.trim() || 'Default',
        inventory: 10, // assumed in-stock for reorder
        price: item.price
      };
      
      addToCart(mockProduct, mockVariant, item.quantity);
    });

    navigate('/cart');
  };

  return (
    <main className="container" style={{ padding: '40px 20px 80px', textAlign: 'left' }}>
      
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px' }}>
          My Purchase History
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track shipping and manage past transactions
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-md">
          {[1,2].map(idx => (
            <div key={idx} className="card" style={{ height: '140px' }}>
              <div className="skeleton" style={{ height: '24px', width: '30%', marginBottom: '14px' }}></div>
              <div className="skeleton" style={{ height: '40px', width: '100%' }}></div>
            </div>
          ))}
        </div>
      ) : buyerOrders.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 40px' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>No Orders Placed Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 20px' }}>
            You haven't bought anything from the Merchora catalog yet. Fill your cart with items to checkout.
          </p>
          <Link to="/shop" className="btn btn-primary">Browse Shop Catalog</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-lg">
          {buyerOrders.map(order => {
            const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            // Get badge color by status
            const statusBadges = {
              pending: 'badge-warning',
              processing: 'badge-primary',
              shipped: 'badge-success',
              completed: 'badge-success'
            };

            return (
              <div key={order.id} className="card" style={{ padding: '24px' }}>
                
                {/* Header info */}
                <div className="flex justify-between align-center flex-mobile-col gap-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div className="flex gap-md flex-wrap" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span className="flex align-center gap-xs">
                      <Clipboard size={14} /> ID: <strong>{order.id}</strong>
                    </span>
                    <span className="flex align-center gap-xs">
                      <Calendar size={14} /> Date: <strong>{dateStr}</strong>
                    </span>
                    <span className="flex align-center gap-xs">
                      <CreditCard size={14} /> Amount: <strong style={{ color: 'var(--primary)' }}>{formatPrice(order.totalAmount)}</strong>
                    </span>
                  </div>
                  <div>
                    <span className={`badge ${statusBadges[order.fulfillmentStatus] || 'badge-primary'}`} style={{ textTransform: 'uppercase', padding: '6px 14px' }}>
                      {order.fulfillmentStatus}
                    </span>
                  </div>
                </div>

                {/* Items grid */}
                <div className="flex flex-col gap-sm">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex align-center justify-between flex-mobile-col gap-sm" style={{ padding: '8px 0' }}>
                      <div className="flex align-center gap-md">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity} @ {formatPrice(item.price)}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & reorder controls */}
                <div className="flex justify-between align-center flex-mobile-col gap-md" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '14px', fontSize: '0.85rem' }}>
                  
                  {/* Tracking numbers */}
                  <div className="flex align-center gap-sm">
                    <Truck size={16} style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      {order.trackingNumber ? (
                        <span>
                          <strong>Tracking Code:</strong> <code style={{ fontSize: '0.75rem', padding: '2px 6px' }}>{order.trackingNumber}</code>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          Awaiting tracking details from seller
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reorder Button */}
                  <button 
                    onClick={() => handleReorder(order)} 
                    className="btn btn-outline btn-sm flex align-center gap-xs"
                  >
                    <RefreshCw size={12} /> Buy Again (Reorder)
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </main>
  );
};
