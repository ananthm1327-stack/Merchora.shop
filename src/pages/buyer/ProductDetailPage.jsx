import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { 
  Star, ShoppingCart, Truck, AlertTriangle, 
  ArrowLeft, ShieldCheck, Mail, MessageSquarePlus 
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getProductReviews, addProductReview, products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery
  const [activeImage, setActiveImage] = useState('');
  
  // Selected Variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Fetch product and reviews
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const prod = await getProductById(id);
        setProduct(prod);
        setActiveImage(prod.images[0]);
        
        // Select first in-stock variant by default, otherwise first variant
        const firstInStock = prod.variants.find(v => v.inventory > 0);
        setSelectedVariant(firstInStock || prod.variants[0]);
        
        const revs = await getProductReviews(id);
        setReviews(revs);
      } catch (err) {
        setError(err.message || 'Product failed to load.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="container" style={{ padding: '60px 20px' }}>
        <div className="flex gap-lg flex-mobile-col">
          <div className="skeleton flex-1" style={{ height: '400px' }}></div>
          <div className="flex-1 flex flex-col gap-md">
            <div className="skeleton" style={{ height: '32px', width: '80%' }}></div>
            <div className="skeleton" style={{ height: '24px', width: '40%' }}></div>
            <div className="skeleton" style={{ height: '120px', width: '100%' }}></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Error Loading Product</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '10px 0 30px' }}>{error || 'The requested product could not be located.'}</p>
        <Link to="/shop" className="btn btn-primary">Back to Catalog</Link>
      </main>
    );
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, 1);
  };

  // Handle Review Submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!reviewComment.trim()) {
      setReviewError('Please write a review comment.');
      return;
    }

    try {
      const newRev = await addProductReview(product.id, reviewRating, reviewComment);
      setReviews(prev => [newRev, ...prev]);
      setReviewComment('');
      setReviewSuccess('Thank you! Your product review has been submitted successfully.');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review.');
    }
  };

  // Related products (same category, exclude current)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id && p.publicationStatus === 'published')
    .slice(0, 3);

  // Compute average rating
  const avgRating = reviews.length > 0 
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)) 
    : 4.8; // default mock rating

  return (
    <main className="container" style={{ padding: '40px 20px 80px' }}>
      
      {/* Back link */}
      <Link to="/shop" className="flex align-center gap-sm" style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Catalog Shop
      </Link>

      {/* CORE PRODUCT VIEW */}
      <section className="grid grid-2 gap-lg flex-mobile-col" style={{ alignItems: 'flex-start' }}>
        
        {/* Left Side: Images */}
        <div className="flex flex-col gap-md">
          {/* Main Visual */}
          <div className="card" style={{ padding: '10px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <img 
              src={activeImage} 
              alt={product.title} 
              style={{ width: '100%', height: '420px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} 
            />
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-sm">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className="card"
                  style={{ 
                    padding: '4px', 
                    width: '80px', 
                    height: '80px', 
                    cursor: 'pointer',
                    borderColor: activeImage === img ? 'var(--primary)' : 'var(--border-color)',
                    borderWidth: '2px'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Buying Details */}
        <div style={{ textAlign: 'left' }}>
          
          <span className="badge badge-primary" style={{ textTransform: 'uppercase', marginBottom: '8px' }}>
            {product.category}
          </span>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '4px 0 10px', lineHeight: 1.1 }}>
            {product.title}
          </h1>

          {/* Ratings Summaries */}
          <div className="flex align-center gap-sm" style={{ marginBottom: '20px' }}>
            <div className="stars">
              {[1,2,3,4,5].map(idx => (
                <Star 
                  key={idx} 
                  size={16} 
                  fill={idx <= Math.round(avgRating) ? 'currentColor' : 'none'} 
                />
              ))}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{avgRating}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{reviews.length} Customer Reviews</span>
          </div>

          {/* Prices */}
          <div className="flex align-center gap-md" style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatPrice(selectedVariant ? selectedVariant.price : product.price)}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '20px 0' }}></div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Select Option ({product.variants[0].name})</label>
              <div className="flex gap-sm flex-wrap">
                {product.variants.map(variant => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isOutOfStock = variant.inventory <= 0;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedVariant(variant)}
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                      style={{
                        position: 'relative',
                        opacity: isOutOfStock ? 0.4 : 1,
                        textDecoration: isOutOfStock ? 'line-through' : 'none'
                      }}
                    >
                      {variant.value}
                      {isSelected && <span style={{ fontSize: '0.6rem', position: 'absolute', top: '-6px', right: '-4px', backgroundColor: 'var(--success)', color: '#fff', padding: '1px 3px', borderRadius: '3px' }}>✓</span>}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <div className="flex justify-between" style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span><strong>SKU:</strong> {selectedVariant.sku}</span>
                  <span>
                    <strong>Stock:</strong> {selectedVariant.inventory > 0 ? (
                      selectedVariant.inventory <= 5 ? (
                        <span className="badge badge-warning low-stock-alert" style={{ fontSize: '0.7rem' }}>
                          Only {selectedVariant.inventory} left!
                        </span>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          In Stock ({selectedVariant.inventory})
                        </span>
                      )
                    ) : (
                      <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                        Sold Out
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions panel */}
          <div className="flex gap-md" style={{ marginTop: '24px' }}>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.inventory <= 0}
              className="btn btn-primary btn-lg flex-1 flex align-center justify-center gap-sm"
              style={{ height: '52px' }}
            >
              <ShoppingCart size={20} />
              {!selectedVariant || selectedVariant.inventory <= 0 ? 'Out of Stock' : 'Add to Cart Bag'}
            </button>
          </div>

          {/* Core Info Badges */}
          <div className="card" style={{ marginTop: '30px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="flex align-center gap-sm" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Truck size={16} /> Free shipping applies to purchases over $100.
            </div>
            <div className="flex align-center gap-sm" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} /> Escrow Protection: funds released to seller upon delivery verification.
            </div>
          </div>

          {/* Seller Metadata Info */}
          <div className="card" style={{ marginTop: '30px', padding: '20px', borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>SELLER CREDENTIALS</h4>
            <div className="flex justify-between align-center flex-mobile-col" style={{ gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>Aura Wear Ltd (Verified Seller)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fulfills orders within 24-48 hours.</div>
              </div>
              <div className="flex align-center gap-sm">
                <span className="badge badge-success">★ 4.8 Rating</span>
                <Link to="/shop?search=Aura" className="btn btn-secondary btn-sm flex align-center gap-xs">
                  <Mail size={12} /> Message
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section style={{ marginTop: '80px', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>Related Products</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Customers who viewed this also liked</p>
          </div>
          <div className="grid grid-3 gap-md">
            {related.map(prod => (
              <div 
                key={prod.id} 
                className="card card-hover flex flex-col justify-between"
                style={{ padding: '16px', textAlign: 'left', cursor: 'pointer' }}
                onClick={() => navigate(`/product/${prod.id}`)}
              >
                <div>
                  <img src={prod.images[0]} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{prod.category}</span>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '2px 0 8px' }}>{prod.title}</h4>
                </div>
                <div className="flex justify-between align-center" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(prod.price)}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>View Details</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* REVIEWS PORTAL */}
      <section style={{ marginTop: '60px', borderTop: '1px solid var(--border-color)', paddingTop: '40px', textAlign: 'left' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '24px' }}>
          Customer Reviews ({reviews.length})
        </h3>

        <div className="grid grid-2 gap-lg flex-mobile-col">
          
          {/* Review items */}
          <div className="flex flex-col gap-md">
            {reviews.length === 0 ? (
              <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No reviews yet. Be the first to purchase and review this item!
              </div>
            ) : (
              reviews.map(rev => (
                <div key={rev.id} className="card" style={{ padding: '20px' }}>
                  <div className="flex justify-between align-center" style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600 }}>{rev.buyerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="stars" style={{ marginBottom: '10px' }}>
                    {[1,2,3,4,5].map(idx => (
                      <Star key={idx} size={12} fill={idx <= rev.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add review form */}
          <div>
            {user && user.role === 'buyer' ? (
              <div className="card" style={{ padding: '24px' }}>
                <h4 className="flex align-center gap-sm" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '16px' }}>
                  <MessageSquarePlus size={18} style={{ color: 'var(--primary)' }} /> Share Your Feedback
                </h4>

                {reviewSuccess && (
                  <div className="badge badge-success" style={{ display: 'block', padding: '10px', borderRadius: '4px', marginBottom: '14px', textAlign: 'center' }}>
                    {reviewSuccess}
                  </div>
                )}
                {reviewError && (
                  <div className="badge badge-danger" style={{ display: 'block', padding: '10px', borderRadius: '4px', marginBottom: '14px', textAlign: 'center' }}>
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-md">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Overall Rating (Stars)</label>
                    <select 
                      value={reviewRating} 
                      onChange={e => setReviewRating(parseInt(e.target.value))}
                      className="form-input"
                      style={{ width: '100px' }}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Review Comment</label>
                    <textarea 
                      rows="4" 
                      className="form-input" 
                      placeholder="What did you think of the design, sizing, and quality of the item?"
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                    Submit Review
                  </button>
                </form>
              </div>
            ) : (
              <div className="card text-center" style={{ padding: '30px', backgroundColor: 'var(--bg-tertiary)', borderStyle: 'dashed' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  You must be logged in as a <strong>Buyer</strong> to write product reviews.
                </p>
                <div className="flex gap-sm justify-center" style={{ marginTop: '14px' }}>
                  <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </main>
  );
};
