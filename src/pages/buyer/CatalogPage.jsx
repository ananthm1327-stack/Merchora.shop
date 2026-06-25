import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Filter, Eye, Star, Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const CatalogPage = () => {
  const { products, categories, loading } = useProducts();
  const { formatPrice } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();

  // Search parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || 'All';

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('All');
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc', 'views'
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Pagination State (25 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  // Sync state if URL changes
  useEffect(() => {
    setSearch(queryParams.get('search') || '');
    setSelectedCategory(queryParams.get('category') || 'All');
  }, [location.search]);

  // Reset page to 1 whenever filters change to prevent empty viewport index errors
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, minPrice, maxPrice, minRating, showOutOfStock, sortBy]);

  // Handle Search Input Form
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams();
  };

  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    // 1. Publication Status
    if (p.publicationStatus !== 'published') return false;

    // 2. Search Text
    if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // 3. Category
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }

    // 4. Min Price
    if (minPrice && p.price < parseFloat(minPrice)) return false;

    // 5. Max Price
    if (maxPrice && p.price > parseFloat(maxPrice)) return false;

    // 6. Rating Mock matches
    if (minRating !== 'All') {
      const avgRating = p.id === 'prod_1' ? 5 : p.id === 'prod_2' ? 4 : 4.5;
      if (avgRating < parseFloat(minRating)) return false;
    }

    // 7. Out of stock check
    const totalInventory = p.variants.reduce((acc, v) => acc + v.inventory, 0);
    if (!showOutOfStock && totalInventory <= 0) return false;

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0);
    return new Date(b.creationDate) - new Date(a.creationDate); // default newest
  });

  // Pagination Slice
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll back to top of product viewport
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('All');
    setShowOutOfStock(true);
    setSortBy('newest');
    setCurrentPage(1);
    navigate(location.pathname);
  };

  return (
    <main className="container" style={{ padding: '40px 20px 80px' }}>
      
      {/* Page Title */}
      <div style={{ textAlign: 'left', marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px' }}>
          Explore Collections
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Showing {filteredProducts.length} premium listings matching your filters
        </p>
      </div>

      {/* Mobile Toggle Filters Button */}
      <button 
        onClick={() => setShowFiltersMobile(!showFiltersMobile)} 
        className="btn btn-secondary flex-mobile-show" 
        style={{ display: 'none', width: '100%', marginBottom: '20px', justifyContent: 'center', gap: '8px' }}
      >
        <SlidersHorizontal size={16} /> {showFiltersMobile ? 'Hide Filters' : 'Show Filters & Search'}
      </button>

      <div className="flex gap-lg flex-mobile-col" style={{ alignItems: 'flex-start', width: '100%' }}>
        
        {/* FILTER CONTROLS BAR (LEFT SIDE) */}
        <aside 
          className={`card glass ${showFiltersMobile ? 'show-mobile-filters' : 'hide-mobile-filters'}`}
          style={{ width: '280px', flexShrink: 0, padding: '24px', textAlign: 'left', position: 'sticky', top: '90px' }}
        >
          <div className="flex align-center justify-between" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <span className="flex align-center gap-sm" style={{ fontWeight: 600, fontSize: '1.1rem' }}>
              <Filter size={18} /> Filters
            </span>
            <button onClick={resetFilters} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }} className="flex align-center gap-sm">
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          {/* Search box within filters */}
          <div className="form-group">
            <label className="form-label">Keyword Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onBlur={updateUrlParams}
                className="form-input"
                style={{ paddingRight: '32px' }}
              />
              <Search size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            </div>
          </div>

          {/* Categories Selector */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                const params = new URLSearchParams(location.search);
                if (e.target.value === 'All') params.delete('category');
                else params.set('category', e.target.value);
                navigate(`${location.pathname}?${params.toString()}`);
              }}
              className="form-input"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Boundaries */}
          <div className="form-group">
            <label className="form-label">Price Range ($)</label>
            <div className="flex gap-sm">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="form-input"
                style={{ padding: '8px 10px' }}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="form-input"
                style={{ padding: '8px 10px' }}
              />
            </div>
          </div>

          {/* Ratings Filters */}
          <div className="form-group">
            <label className="form-label">Minimum Rating</label>
            <select
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
              className="form-input"
            >
              <option value="All">All Ratings</option>
              <option value="4.5">★ 4.5 & up</option>
              <option value="4.0">★ 4.0 & up</option>
              <option value="3.0">★ 3.0 & up</option>
            </select>
          </div>

          {/* In-Stock toggle */}
          <div className="flex align-center gap-sm" style={{ marginTop: '16px', cursor: 'pointer' }} onClick={() => setShowOutOfStock(!showOutOfStock)}>
            <input
              type="checkbox"
              checked={showOutOfStock}
              onChange={() => {}}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Show Out of Stock</span>
          </div>

        </aside>

        {/* PRODUCTS VIEWPORT (RIGHT SIDE) */}
        <section className="flex-1">
          
          {/* Top Sort Panel */}
          <div className="card" style={{ padding: '12px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing {paginatedProducts.length} of {filteredProducts.length} products (Page {currentPage} of {Math.max(1, totalPages)})
            </span>
            <div className="flex align-center gap-sm">
              <SlidersHorizontal size={14} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-input"
                style={{ width: '150px', padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="views">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="grid grid-3 gap-md">
              {[1, 2, 3, 4, 5, 6].map(idx => (
                <div key={idx} className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="skeleton" style={{ height: '180px', width: '100%' }}></div>
                  <div className="skeleton" style={{ height: '20px', width: '70%' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="card flex flex-col align-center justify-center" style={{ padding: '60px 40px', minHeight: '300px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>No Products Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 20px' }}>
                We couldn't find any products matching your search criteria. Try modifying your filters or clearing search keys.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-3 gap-md">
                {paginatedProducts.map(prod => {
                  const rating = prod.id === 'prod_1' ? 5 : prod.id === 'prod_2' ? 4 : 4.5;
                  const totalStock = prod.variants.reduce((acc, v) => acc + v.inventory, 0);

                  return (
                    <div 
                      key={prod.id} 
                      className="card card-hover flex flex-col justify-between"
                      style={{ padding: '16px', cursor: 'pointer', textAlign: 'left' }}
                      onClick={() => navigate(`/product/${prod.id}`)}
                    >
                      <div>
                        {/* Thumbnail image */}
                        <div style={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '14px',
                          backgroundColor: 'var(--bg-tertiary)'
                        }}>
                          <img 
                            src={prod.images[0]} 
                            alt={prod.title} 
                            style={{ width: '100%', height: '170px', objectFit: 'cover' }} 
                          />
                          
                          {totalStock <= 0 ? (
                            <span className="badge badge-danger" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                              OUT OF STOCK
                            </span>
                          ) : totalStock <= 5 ? (
                            <span className="badge badge-warning" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                              LOW STOCK
                            </span>
                          ) : null}

                          <span className="badge" style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px' }}>
                            <Eye size={10} /> {prod.viewCount || 0}
                          </span>
                        </div>

                        {/* Text Metadata */}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                          {prod.category}
                        </span>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '4px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', height: '40px' }}>
                          {prod.title}
                        </h3>

                        {/* Stars */}
                        <div className="flex align-center gap-sm" style={{ marginBottom: '10px' }}>
                          <div className="stars">
                            {[1,2,3,4,5].map(starIdx => (
                              <Star 
                                key={starIdx} 
                                size={12} 
                                fill={starIdx <= Math.round(rating) ? 'currentColor' : 'none'} 
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rating}</span>
                        </div>
                      </div>

                      {/* Pricing / CTA */}
                      <div className="flex align-center justify-between" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                        <div>
                          {prod.compareAtPrice && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textDecoration: 'line-through', marginRight: '6px' }}>
                              {formatPrice(prod.compareAtPrice)}
                            </span>
                          )}
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                          View Product →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Auto-Adaptive Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex align-center justify-center gap-sm" style={{ marginTop: '40px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 14px' }}
                  >
                    ← Prev
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                      style={{ 
                        minWidth: '36px', 
                        height: '36px', 
                        padding: 0,
                        borderRadius: '50%',
                        fontWeight: currentPage === page ? 700 : 500
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '8px 14px' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

        </section>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .flex-mobile-show { display: inline-flex !important; }
          .hide-mobile-filters { display: none !important; }
          .show-mobile-filters { display: block !important; width: 100% !important; position: static !important; }
        }
      `}</style>
    </main>
  );
};
