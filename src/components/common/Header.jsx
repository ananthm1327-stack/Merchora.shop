import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { 
  Search, ShoppingCart, User, LogOut, Heart, 
  Sun, Moon, ChevronDown, Store, ShoppingBag, Menu, X
} from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { products } = useProducts();
  const { 
    selectedCountry, selectedCurrency, 
    updateCountry, updateCurrency, countries, currencies 
  } = useCurrency();

  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Theme switcher
  const [theme, setTheme] = useState(localStorage.getItem('merchora_theme') || 'light');
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('merchora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Debounced search logic matching category + keyword queries
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const filtered = products
        .filter(p => 
          p.publicationStatus === 'published' &&
          (searchCategory === 'All' || p.category === searchCategory) &&
          (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5); // limit suggestions to 5
      setSuggestions(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, searchCategory, products]);

  // Close suggestions and dropdowns on click outside
  useEffect(() => {
    const clickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (searchCategory !== 'All') params.set('category', searchCategory);
    
    navigate(`/catalog?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (prodId) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${prodId}`);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const activeCountryDetail = countries.find(c => c.code === selectedCountry);

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 0'
    }}>
      <div className="header-container container flex align-center justify-between" style={{ position: 'relative' }}>
        
        {/* Logo */}
        <Link to="/" className="flex align-center gap-sm" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
          <img src="/icon.svg" alt="Merchora Icon" style={{ height: '30px', width: '30px', objectFit: 'contain' }} />
          <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Merchora</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--border-color)' }}>shop</span>
        </Link>

        {/* Advanced Unified Search Bar - Hidden on seller dashboard router */}
        {!location.pathname.startsWith('/seller') && (
          <form 
            ref={searchRef} 
            onSubmit={handleSearchSubmit} 
            className="search-form-header flex-1 flex align-center" 
            style={{ 
              maxWidth: '520px', 
              margin: '0 20px', 
              position: 'relative',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-secondary)',
              overflow: 'hidden',
              height: '42px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Category Select (Advanced search) */}
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              style={{
                width: '110px',
                paddingLeft: '14px',
                paddingRight: '6px',
                height: '100%',
                borderRight: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b6375\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '8px'
              }}
              title="Search Category"
            >
              <option value="All">All Depts</option>
              <option value="Apparel">Apparel</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Beauty & Personal Care">Beauty & Personal Care</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Books & Media">Books & Media</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Automotive">Automotive</option>
            </select>

            {/* Input field */}
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              style={{ 
                flex: 1, 
                padding: '0 14px', 
                height: '100%', 
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />

            {/* Search Button */}
            <button 
              type="submit" 
              style={{ 
                height: '100%', 
                padding: '0 18px', 
                backgroundColor: 'var(--primary)', 
                color: 'var(--text-on-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              <Search size={16} />
            </button>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="autocomplete-dropdown card" style={{ padding: '8px 0', marginTop: '48px', width: '100%', left: 0 }}>
                <div style={{ padding: '6px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                  SUGGESTED MATCHES
                </div>
                {suggestions.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleSuggestionClick(prod.id)}
                    className="autocomplete-item"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <img 
                      src={prod.images[0]} 
                      alt={prod.title} 
                      style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                    <div className="flex-1 text-left" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{prod.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{prod.category}</div>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>${prod.price}</div>
                  </div>
                ))}
              </div>
            )}
          </form>
        )}

        {/* Desktop Nav Controls */}
        <nav className="flex align-center gap-md flex-mobile-hide">
          <Link to="/" className="tab-btn" style={{ border: 'none', color: location.pathname === '/' ? 'var(--primary)' : 'inherit', fontWeight: location.pathname === '/' ? '600' : '400' }}>Home</Link>
          <Link to="/catalog" className="tab-btn" style={{ border: 'none', color: (location.pathname === '/catalog' || location.pathname === '/shop') ? 'var(--primary)' : 'inherit', fontWeight: (location.pathname === '/catalog' || location.pathname === '/shop') ? '600' : '400' }}>Catalog</Link>
          
          {/* Seller Link */}
          {user?.role === 'seller' ? (
            <Link to="/seller/dashboard" className="btn btn-secondary btn-sm flex align-center gap-sm">
              <Store size={16} /> Seller Console
            </Link>
          ) : (
            <Link to="/seller/dashboard" className="btn btn-outline btn-sm flex align-center gap-sm" style={{ borderStyle: 'dashed' }}>
              Sell
            </Link>
          )}

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex' }} title="Toggle Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Cart - Hidden for Seller dashboards */}
          {!location.pathname.startsWith('/seller') && (
            <Link to="/cart" style={{ position: 'relative', display: 'flex', padding: '8px', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="badge badge-danger" style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  border: '2px solid var(--bg-secondary)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Unified Profile & Settings dropdown */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="btn btn-outline btn-sm flex align-center gap-sm"
              style={{ minWidth: '130px', justifyContent: 'space-between' }}
            >
              <span className="flex align-center gap-xs">
                {activeCountryDetail?.flag} <User size={14} />
              </span>
              <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user ? (user.profile.name || user.email.split('@')[0]) : 'Settings'}
              </span>
              <ChevronDown size={14} />
            </button>

            {isProfileOpen && (
              <div className="card" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '240px',
                zIndex: 200,
                padding: '14px',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                {/* Account Details Header */}
                {user ? (
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.profile.name || 'User'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Guest Preferences
                    </div>
                  </div>
                )}

                {/* Country and Currency configuration selectors */}
                {true && (
                  <div className="flex flex-col gap-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                    
                    {/* Country Selector */}
                    <div className="flex flex-col gap-xs text-left">
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>COUNTRY / REGION</label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => updateCountry(e.target.value)}
                        style={{
                          width: '100%',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          padding: '6px 24px 6px 8px',
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
                    <div className="flex flex-col gap-xs text-left">
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>BILLING CURRENCY</label>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => updateCurrency(e.target.value)}
                        style={{
                          width: '100%',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          padding: '6px 24px 6px 8px',
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
                            {curr.code} ({curr.symbol}) - {curr.name}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                )}

                {/* Dropdown Options Actions */}
                <div className="flex flex-col gap-xs">
                  {user ? (
                    <>
                      {user.role === 'buyer' && (
                        <>
                          <Link to="/orders" className="autocomplete-item" style={{ borderRadius: '6px', padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => setIsProfileOpen(false)}>
                            Order History
                          </Link>
                          <Link to="/catalog" className="autocomplete-item" style={{ borderRadius: '6px', padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => setIsProfileOpen(false)}>
                            Explore Catalog
                          </Link>
                        </>
                      )}

                      {user.role === 'seller' && (
                        <Link to="/seller/dashboard" className="autocomplete-item" style={{ borderRadius: '6px', padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => setIsProfileOpen(false)}>
                          Seller Dashboard
                        </Link>
                      )}

                      <button 
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                          navigate('/');
                        }} 
                        className="autocomplete-item text-danger" 
                        style={{ width: '100%', borderRadius: '6px', padding: '8px 12px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-sm" style={{ paddingTop: '4px' }}>
                      <Link to="/login" className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => setIsProfileOpen(false)}>
                        Log In
                      </Link>
                      <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => setIsProfileOpen(false)}>
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </nav>

        {/* Mobile menu trigger */}
        <div className="flex align-center gap-sm flex-mobile-show" style={{ display: 'none' }}>
          {/* Cart Icon on Mobile */}
          {!location.pathname.startsWith('/seller') && (
            <Link to="/cart" style={{ position: 'relative', display: 'flex', padding: '8px', borderRadius: '50%', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="badge badge-danger" style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  border: '2px solid var(--bg-secondary)',
                  backgroundColor: 'var(--danger)',
                  color: 'white'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            style={{ padding: '8px', color: 'var(--text-primary)' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="glass flex flex-col gap-md" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          padding: '20px',
          borderBottom: '1px solid var(--border-color)',
          zIndex: 999
        }}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)}>Catalog</Link>
          
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          
          {/* Mobile Country Select */}
          <div className="flex justify-between align-center">
            <span>Shipping Region</span>
            <select
              value={selectedCountry}
              onChange={(e) => updateCountry(e.target.value)}
              style={{ fontSize: '0.85rem', fontWeight: 600, padding: '4px' }}
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Mobile Currency Select */}
          <div className="flex justify-between align-center">
            <span>Billing Currency</span>
            <select
              value={selectedCurrency}
              onChange={(e) => updateCurrency(e.target.value)}
              style={{ fontSize: '0.85rem', fontWeight: 600, padding: '4px' }}
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
              ))}
            </select>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          
          <div className="flex justify-between align-center">
            <span>Theme Mode</span>
            <button onClick={toggleTheme} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logged in as:</span>
                <span style={{ fontWeight: 600 }}>{user.profile.name || user.email} ({user.role})</span>
              </div>
              {user.role === 'buyer' ? (
                <Link to="/orders" className="btn btn-outline" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
              ) : (
                <Link to="/seller/dashboard" className="btn btn-outline" onClick={() => setIsMobileMenuOpen(false)}>Seller Console</Link>
              )}
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} className="btn btn-danger">
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-sm">
              <Link to="/login" className="btn btn-outline" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      {/* Styled utilities for responsive hiding */}
      <style>{`
        @media (max-width: 768px) {
          .flex-mobile-hide { display: none !important; }
          .flex-mobile-show { display: flex !important; }
          .header-container {
            flex-wrap: wrap !important;
            gap: 12px;
          }
          .search-form-header {
            order: 3;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </header>
  );
};
export default Header;
