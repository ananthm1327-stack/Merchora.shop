import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { DashboardOverview } from './DashboardOverview';
import { ProductManager } from './ProductManager';
import { OrderManager } from './OrderManager';
import { Financials } from './Financials';
import { ProfileSettings } from './ProfileSettings';

import { 
  BarChart3, Package, ShoppingBag, 
  DollarSign, Settings, Store, ArrowLeft, LogOut 
} from 'lucide-react';

export const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const { fetchSellerOrders, fetchSellerAnalytics, sellerAnalytics, loading } = useOrders();
  const { fetchProducts } = useProducts();
  const { 
    selectedCountry, selectedCurrency, 
    updateCountry, updateCurrency, countries, currencies 
  } = useCurrency();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'products' | 'orders' | 'financials' | 'settings'

  // Refetch seller-related items when dashboard loads
  useEffect(() => {
    if (user && user.role === 'seller') {
      fetchSellerOrders();
      fetchSellerAnalytics();
      fetchProducts();
    }
  }, [user, fetchSellerOrders, fetchSellerAnalytics, fetchProducts]);

  // Auth Guard
  if (!user || user.role !== 'seller') {
    return (
      <main className="container flex align-center justify-center" style={{ minHeight: '80vh', padding: '40px 20px' }}>
        <div className="card text-center" style={{ maxWidth: '460px', width: '100%', padding: '40px' }}>
          <Store size={48} style={{ color: 'var(--danger)', margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700 }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '10px 0 24px', fontSize: '0.95rem' }}>
            Only registered Merchants and Sellers can access the Merchora inventory dashboard.
          </p>
          <div className="flex flex-col gap-sm">
            <Link to="/login" className="btn btn-primary">Log In as Seller</Link>
            <Link to="/" className="btn btn-outline">Back to Homepage</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'orders', label: 'Sales Orders', icon: ShoppingBag },
    { id: 'financials', label: 'Financial overview', icon: DollarSign },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <main className="flex-1 flex flex-mobile-col" style={{ minHeight: '85vh', backgroundColor: 'var(--bg-primary)' }}>
      
      {/* 1. SIDEBAR NAVIGATION PANEL */}
      <aside className="glass" style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        padding: '30px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flexShrink: 0
      }}>
        
        {/* Merchant profile details summary */}
        <div className="seller-profile-aside" style={{ textAlign: 'left', padding: '0 8px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>MERCHORA SELLER CONSOLE</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.profile.businessName || 'Aura Wear Ltd'}
            </h3>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '6px', alignSelf: 'flex-start' }}>
            ● Verified Store
          </span>
        </div>

        {/* Country / Currency Selectors inside Dashboard Sidebar */}
        <div className="flex flex-col gap-xs flex-mobile-hide" style={{ padding: '0 8px', marginTop: '-8px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '16px' }}>
          {/* Country Selector */}
          <div className="flex flex-col gap-xxs">
            <label style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>COUNTRY / REGION</label>
            <select
              value={selectedCountry}
              onChange={(e) => updateCountry(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '6px 20px 6px 8px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b6375\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '8px'
              }}
              title="Select Country"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Selector */}
          <div className="flex flex-col gap-xxs" style={{ marginTop: '8px' }}>
            <label style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>BILLING CURRENCY</label>
            <select
              value={selectedCurrency}
              onChange={(e) => updateCurrency(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '6px 20px 6px 8px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b6375\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '8px'
              }}
              title="Select Currency"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} className="flex-mobile-hide"></div>

        {/* Sidebar Nav Buttons */}
        <nav className="seller-nav-aside flex flex-col gap-sm" style={{ flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn btn-secondary flex align-center gap-sm`}
                style={{
                  justifyContent: 'flex-start',
                  border: 'none',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} className="flex-mobile-hide"></div>

        {/* Bottom utility triggers */}
        <div className="seller-utility-aside flex flex-col gap-sm">
          <Link 
            to="/" 
            className="btn btn-outline btn-sm flex align-center justify-center gap-xs"
            style={{ width: '100%', fontSize: '0.825rem' }}
          >
            <ArrowLeft size={14} /> Back to Buyer Shop
          </Link>
          <button 
            onClick={handleLogout}
            className="btn btn-danger btn-sm flex align-center justify-center gap-xs"
            style={{ width: '100%', fontSize: '0.825rem' }}
          >
            <LogOut size={14} /> Sign Out Console
          </button>
        </div>

      </aside>

      {/* 2. DYNAMIC WORKSPACE PANEL */}
      <section style={{
        flex: 1,
        padding: '40px 30px',
        overflowY: 'auto',
        maxWidth: '100%'
      }}>
        
        {activeTab === 'analytics' && (
          <DashboardOverview analytics={sellerAnalytics} loading={loading} />
        )}

        {activeTab === 'products' && (
          <ProductManager />
        )}

        {activeTab === 'orders' && (
          <OrderManager />
        )}

        {activeTab === 'financials' && (
          <Financials analytics={sellerAnalytics} />
        )}

        {activeTab === 'settings' && (
          <ProfileSettings />
        )}

      </section>

      <style>{`
        @media (max-width: 768px) {
          aside { 
            width: 100% !important; 
            border-right: none !important; 
            border-bottom: 1px solid var(--border-color); 
            padding: 16px !important;
            gap: 16px !important;
          }
          .seller-profile-aside {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          .seller-profile-aside h3 {
            font-size: 1rem !important;
          }
          .seller-nav-aside {
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 8px;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .seller-nav-aside::-webkit-scrollbar {
            display: none;
          }
          .seller-nav-aside button {
            flex-shrink: 0 !important;
          }
          .seller-utility-aside {
            flex-direction: row !important;
          }
          .seller-utility-aside a, .seller-utility-aside button {
            flex: 1 !important;
          }
        }
      `}</style>
    </main>
  );
};
export default SellerDashboard;
