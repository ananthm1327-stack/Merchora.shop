import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { 
  ArrowRight, ShieldCheck, Truck, RotateCcw, 
  Tv, Shirt, Footprints, Backpack, Home as HomeIcon, Star,
  Sparkles, Dumbbell, BookOpen, Gamepad2, Car
} from 'lucide-react';

export const HomePage = () => {
  const { products, loading } = useProducts();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Carousel Slides Content
  const carouselSlides = [
    {
      title: 'Fashion Apparel Collection',
      description: 'Discover organic cotton oversized shirts and essential streetwear items.',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Acoustic Sound ANC Gear',
      description: 'Indulge in noise-cancelling hybrid wireless headphones and smart devices.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Nomad Running Trainers',
      description: 'Step into high-rebound cushioning trainers designed for the city paths.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'Minimalist Homeware & Living',
      description: 'Handcrafted ceramic mugs and textures for your morning routines.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play interval for the image carousel (every 4 seconds)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, [carouselSlides.length]);

  // Categories list with matching icons
  const homeCategories = [
    { name: 'Apparel', icon: Shirt, bg: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' },
    { name: 'Electronics', icon: Tv, bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' },
    { name: 'Footwear', icon: Footprints, bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' },
    { name: 'Accessories', icon: Backpack, bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' },
    { name: 'Home & Living', icon: HomeIcon, bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
    { name: 'Beauty & Personal Care', icon: Sparkles, bg: 'rgba(217, 70, 239, 0.1)', color: '#d946ef' },
    { name: 'Sports & Outdoors', icon: Dumbbell, bg: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6' },
    { name: 'Books & Media', icon: BookOpen, bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    { name: 'Toys & Games', icon: Gamepad2, bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' },
    { name: 'Automotive', icon: Car, bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }
  ];

  // Get first 4 published products as trending
  const trendingProducts = products
    .filter(p => p.publicationStatus === 'published')
    .slice(0, 4);

  return (
    <main style={{ paddingBottom: '80px' }}>
      
      {/* 1. Split Hero Block with Autoplay Image Carousel */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(236, 72, 153, 0.04) 100%)',
        padding: '60px 0 80px',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'left'
      }}>
        <div className="container flex align-center justify-between gap-lg flex-mobile-col">
          
          {/* Left Column: Heading, descriptions, and CTA links */}
          <div style={{ flex: 1.2, maxWidth: '640px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '0.8rem', letterSpacing: '1px' }}>
              NOW LIVE: DUAL-SIDE MARKETPLACE
            </span>
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '3.4rem', 
              fontWeight: 800, 
              letterSpacing: '-2px',
              lineHeight: 1.1,
              marginBottom: '20px'
            }}>
              Curated Goods. <br />
              <span className="text-gradient">Seamless Marketplace.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
              Discover unique creations from verified sellers worldwide, or spin up your own store in minutes with complete inventory control and instant payouts.
            </p>
            <div className="flex gap-md flex-mobile-col" style={{ width: '100%' }}>
              <Link to="/catalog" className="btn btn-primary btn-lg flex align-center gap-sm">
                Start Shopping <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Sell on Merchora
              </Link>
            </div>
          </div>

          {/* Right Column: Sliding Image Carousel with dots navigation */}
          <div style={{ flex: 0.8, width: '100%', maxWidth: '440px', marginInline: 'auto', position: 'relative' }}>
            <div className="card glass" style={{ padding: '8px', overflow: 'hidden', position: 'relative', height: '360px', width: '100%', border: '1px solid var(--border-color)' }}>
              
              {carouselSlides.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      right: '8px',
                      bottom: '8px',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1) translateX(0)' : 'scale(0.96) translateX(40px)',
                      transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: isActive ? 5 : 1,
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: 'var(--radius-sm)' 
                      }} 
                    />
                    
                    {/* Shadow Overlay + Slide Captions */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '24px 20px 20px',
                      background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
                      color: '#fff',
                      borderBottomLeftRadius: 'var(--radius-sm)',
                      borderBottomRightRadius: 'var(--radius-sm)',
                      textAlign: 'left'
                    }}>
                      <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{slide.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', marginTop: '4px' }}>{slide.description}</p>
                    </div>
                  </div>
                );
              })}
              
              {/* Overlay Dots Nav indicators */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                gap: '8px',
                zIndex: 10
              }}>
                {carouselSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: currentSlide === idx ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                      transition: 'all var(--transition-fast)'
                    }}
                    title={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Selling Points */}
      <section className="container" style={{ marginTop: '-30px' }}>
        <div className="grid grid-3 gap-md">
          <div className="card glass flex align-center gap-md" style={{ padding: '20px' }}>
            <Truck size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Free Shipping</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>On all orders above $100</p>
            </div>
          </div>
          <div className="card glass flex align-center gap-md" style={{ padding: '20px' }}>
            <RotateCcw size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>30-Day Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hassle-free refund policy</p>
            </div>
          </div>
          <div className="card glass flex align-center gap-md" style={{ padding: '20px' }}>
            <ShieldCheck size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Secure Payouts</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Escrow-protected checkout flows</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="container" style={{ marginTop: '80px' }}>
        <div style={{ textAlign: 'left', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Shop by Category</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Browse high-quality merchandise by sector</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
          {homeCategories.map(cat => {
            const IconComponent = cat.icon;
            return (
              <div 
                key={cat.name} 
                onClick={() => navigate(`/catalog?category=${encodeURIComponent(cat.name)}`)}
                className="card card-hover flex flex-col align-center justify-center gap-md"
                style={{ cursor: 'pointer', padding: '30px 20px', textAlign: 'center' }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: cat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cat.color
                }}>
                  <IconComponent size={28} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{cat.name}</h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Promotional Highlights Banner */}
      <section className="container" style={{ marginTop: '80px' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          color: 'var(--text-on-accent)',
          borderRadius: 'var(--radius-lg)',
          padding: '50px',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'var(--text-on-accent)', marginBottom: '14px' }}>
              OFFER OF THE MONTH
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-on-accent)', marginBottom: '14px', lineHeight: 1.1 }}>
              Save 10% on your first checkout purchase
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '30px' }}>
              Use coupon code <strong style={{ textDecoration: 'underline' }}>MERCHORA10</strong> at checkout to apply a 10% discount on all store collections.
            </p>
            <Link to="/catalog" className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              Explore Catalog
            </Link>
          </div>
          <div className="flex-mobile-hide" style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-40px',
            opacity: 0.15,
            fontSize: '12rem',
            fontWeight: 900,
            pointerEvents: 'none',
            userSelect: 'none'
          }}>
            %
          </div>
        </div>
      </section>

      {/* 5. Trending Products Grid */}
      <section className="container" style={{ marginTop: '80px' }}>
        <div className="flex justify-between align-center" style={{ marginBottom: '30px' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Featured Products</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Top picks from verified Merchora collections</p>
          </div>
          <Link to="/catalog" className="btn btn-outline flex align-center gap-sm btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-4 gap-md">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="skeleton" style={{ height: '180px', width: '100%' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '70%' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-4 gap-md">
            {trendingProducts.map(prod => {
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
                    {/* Thumbnail */}
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
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
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
                    </div>

                    {/* Metadata */}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      {prod.category}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', height: '40px' }}>
                      {prod.title}
                    </h3>
                    
                    {/* Reviews */}
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>(average)</span>
                    </div>
                  </div>

                  <div className="flex align-center justify-between" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <div>
                      {prod.compareAtPrice && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'line-through', marginRight: '6px' }}>
                          {formatPrice(prod.compareAtPrice)}
                        </span>
                      )}
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {formatPrice(prod.price)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--primary)' }}>
                      View Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
};
export default HomePage;
