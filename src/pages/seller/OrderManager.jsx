import React, { useState } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { 
  Package, Search, Eye, Truck, Check, 
  MapPin, Clock, Calendar, X, ExternalLink 
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export const OrderManager = () => {
  const { sellerOrders, updateOrderStatus, loading } = useOrders();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'pending', 'processing', 'shipped', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fulfillment update handler
  const handleFulfillmentUpdate = async (orderId, nextStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus, trackingNumber);
      setSelectedOrder(null);
      setTrackingNumber('');
      addToast(`Order ${orderId} successfully updated to ${nextStatus.toUpperCase()}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Filter & Search Logic
  const filteredOrders = sellerOrders.filter(order => {
    // 1. Status Filter
    if (filterStatus !== 'All' && order.fulfillmentStatus !== filterStatus) return false;

    // 2. Keyword query search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(query);
      const matchBuyer = order.buyerName.toLowerCase().includes(query);
      if (!matchId && !matchBuyer) return false;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      processing: 'badge-primary',
      shipped: 'badge-success',
      completed: 'badge-success'
    };
    return badges[status] || 'badge-primary';
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* 1. Header Actions */}
      <div className="flex justify-between align-center" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Sales Orders Tracker</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fulfill pending items, print invoices, and update shipping tracking details</p>
        </div>

        {/* Search bar inside orders */}
        <div style={{ position: 'relative', width: '260px' }}>
          <input
            type="text"
            placeholder="Search by Buyer Name or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '36px', fontSize: '0.85rem' }}
          />
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        </div>
      </div>

      {/* 2. Status Filters Bar */}
      <div className="tabs-header" style={{ marginBottom: '20px', gap: '10px' }}>
        {['All', 'pending', 'processing', 'shipped', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`tab-btn ${filterStatus === status ? 'active' : ''}`}
            style={{ paddingBottom: '10px', fontSize: '0.85rem', textTransform: 'capitalize' }}
          >
            {status} ({status === 'All' ? sellerOrders.length : sellerOrders.filter(o => o.fulfillmentStatus === status).length})
          </button>
        ))}
      </div>

      {/* 3. Orders Grid List */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Buyer</th>
              <th>Items Ordered</th>
              <th>Total Net Amount</th>
              <th>Fulfillment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No orders found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>{order.id}</td>
                  <td style={{ fontSize: '0.825rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.buyerName}</div>
                  </td>
                  <td>{order.products.reduce((acc, p) => acc + p.quantity, 0)} items</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.fulfillmentStatus)}`} style={{ textTransform: 'uppercase' }}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => { setSelectedOrder(order); setTrackingNumber(order.trackingNumber || ''); }}
                      className="btn btn-secondary btn-sm flex align-center gap-xs"
                      style={{ padding: '6px 12px' }}
                    >
                      <Eye size={12} /> View & Fulfill
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Fulfill Drawer Modal Panel */}
      {selectedOrder && (
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
          <div className="modal-content card" style={{ maxWidth: '540px', width: '90vw', padding: '24px' }}>
            
            <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                Fulfill Order Reference: {selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '14px', margin: '14px 0' }}>
              
              {/* Buyer meta */}
              <div className="grid grid-2 gap-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div>
                  <strong>Buyer Details:</strong>
                  <div>{selectedOrder.buyerName}</div>
                </div>
                <div>
                  <strong>Shipping Address:</strong>
                  <div className="flex align-center gap-xs" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={12} /> {selectedOrder.shippingAddress}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <strong>Manifest Items:</strong>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
                  {selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="flex justify-between align-center" style={{ padding: '8px 12px', borderBottom: idx < selectedOrder.products.length - 1 ? '1px solid var(--border-color)' : 'none', backgroundColor: 'var(--bg-secondary)' }}>
                      <div className="flex align-center gap-sm">
                        <img src={item.image} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <strong>{item.title}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Qty: {item.quantity} @ {formatPrice(item.price)} each</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex justify-between align-center" style={{ marginTop: '10px' }}>
                <span><strong>Order Total:</strong></span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {formatPrice(selectedOrder.totalAmount)}
                </span>
              </div>

              {/* FULFILL ACTIONS FORM */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '10px' }}>
                <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '10px' }}> Fulfill & Ship Package</h4>
                
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Carrier Tracking Code (USPS / UPS / FedEx)</label>
                  <input
                    type="text"
                    placeholder="e.g. MC-87654321-US"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                  />
                </div>

                <div className="flex gap-sm">
                  {selectedOrder.fulfillmentStatus === 'pending' && (
                    <button 
                      onClick={() => handleFulfillmentUpdate(selectedOrder.id, 'processing')}
                      className="btn btn-secondary flex-1 flex align-center justify-center gap-xs btn-sm"
                    >
                      <Clock size={12} /> Accept Order (Mark Processing)
                    </button>
                  )}
                  {(selectedOrder.fulfillmentStatus === 'pending' || selectedOrder.fulfillmentStatus === 'processing') && (
                    <button 
                      onClick={() => {
                        if (!trackingNumber.trim()) {
                          addToast('Please supply a shipment tracking number to mark as Shipped.', 'error');
                          return;
                        }
                        handleFulfillmentUpdate(selectedOrder.id, 'shipped');
                      }}
                      className="btn btn-primary flex-1 flex align-center justify-center gap-xs btn-sm"
                    >
                      <Truck size={12} /> Fulfill Package (Mark Shipped)
                    </button>
                  )}
                  {selectedOrder.fulfillmentStatus === 'shipped' && (
                    <button 
                      onClick={() => handleFulfillmentUpdate(selectedOrder.id, 'completed')}
                      className="btn btn-primary flex-1 flex align-center justify-center gap-xs btn-sm"
                      style={{ backgroundColor: 'var(--success)' }}
                    >
                      <Check size={12} /> Delivery Completed
                    </button>
                  )}
                </div>
              </div>

            </div>

            <div className="flex justify-end" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-outline btn-sm">
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
