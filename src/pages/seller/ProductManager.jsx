import React, { useState } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { 
  Plus, Edit, Trash2, Tag, Upload, Save, X, 
  Bold, Italic, Link2, Eye, PlusCircle, AlertCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export const ProductManager = () => {
  const { products, categories, createProduct, updateProduct, deleteProduct } = useProducts();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmTitle, setDeleteConfirmTitle] = useState('');
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [publicationStatus, setPublicationStatus] = useState('published'); // 'published' | 'draft'
  const [images, setImages] = useState(['']); // array of URLs
  
  // Variants State: [{ id, name, value, sku, inventory, price }]
  const [variants, setVariants] = useState([
    { id: 'v_init_1', name: 'Size', value: 'M', sku: 'SKU-M', inventory: 10, price: 29.99 }
  ]);
  const [variantName, setVariantName] = useState('Size'); // default attribute name

  const [formErrors, setFormErrors] = useState({});

  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setCompareAtPrice('');
    setCategory('Apparel');
    setPublicationStatus('published');
    setImages(['']);
    setVariants([{ id: 'v_' + Math.random().toString(36).substr(2, 5), name: 'Size', value: 'M', sku: 'SKU-M', inventory: 10, price: 29.99 }]);
    setVariantName('Size');
    setEditingId(null);
    setFormErrors({});
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingId(prod.id);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setCompareAtPrice(prod.compareAtPrice ? prod.compareAtPrice.toString() : '');
    setCategory(prod.category);
    setPublicationStatus(prod.publicationStatus);
    setImages(prod.images.length ? prod.images : ['']);
    setVariants(prod.variants.length ? prod.variants : []);
    setVariantName(prod.variants[0]?.name || 'Size');
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Image inputs handling
  const handleImageUrlChange = (idx, value) => {
    const updated = [...images];
    updated[idx] = value;
    setImages(updated);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (idx) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== idx));
  };

  // Variants handling
  const handleVariantRowChange = (vId, field, val) => {
    setVariants(prev => prev.map(v => {
      if (v.id === vId) {
        let parsedVal = val;
        if (field === 'inventory') parsedVal = Math.max(0, parseInt(val) || 0);
        if (field === 'price') parsedVal = Math.max(0, parseFloat(val) || 0);
        return { ...v, [field]: parsedVal };
      }
      return v;
    }));
  };

  const addVariantRow = () => {
    const newVariant = {
      id: 'v_' + Math.random().toString(36).substr(2, 5),
      name: variantName || 'Option',
      value: '',
      sku: `SKU-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      inventory: 10,
      price: parseFloat(price) || 29.99
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariantRow = (vId) => {
    if (variants.length === 1) {
      addToast('Products require at least one variant option/SKU.', 'error');
      return;
    }
    setVariants(variants.filter(v => v.id !== vId));
  };

  const handleVariantNameChange = (e) => {
    const newName = e.target.value;
    setVariantName(newName);
    setVariants(prev => prev.map(v => ({ ...v, name: newName })));
  };

  // Validation
  const validateForm = () => {
    const err = {};
    if (!title.trim()) err.title = 'Product title is required.';
    if (!description.trim()) err.description = 'Product description is required.';
    if (!price || parseFloat(price) <= 0) err.price = 'Valid product base price is required.';
    if (compareAtPrice && parseFloat(compareAtPrice) <= parseFloat(price)) {
      err.compareAtPrice = 'Compare-at price must exceed actual listing price.';
    }
    
    // Check variant fields
    const emptyVariants = variants.some(v => !v.value.trim());
    if (emptyVariants) {
      err.variants = 'All variant option value strings must be filled.';
    }

    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Filter blank images
    const cleanImages = images.filter(img => img.trim() !== '');
    const productPayload = {
      title,
      description,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      category,
      publicationStatus,
      images: cleanImages,
      variants,
      tags: [category.toLowerCase(), 'merchora']
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productPayload);
        addToast(`Successfully updated product "${title}"`, 'success');
      } else {
        await createProduct(productPayload);
        addToast(`Successfully created product "${title}"`, 'success');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      addToast('Error saving product: ' + err.message, 'error');
    }
  };

  const handleDeleteClick = (prodId, prodTitle) => {
    setDeleteConfirmId(prodId);
    setDeleteConfirmTitle(prodTitle);
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* 1. Header Actions */}
      <div className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Product Catalogue Inventory</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage your listings, pricing options, variants and publish status</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary btn-sm flex align-center gap-sm">
          <Plus size={16} /> Add Product Listing
        </button>
      </div>

      {/* 2. Listings Grid/Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Base Price</th>
              <th>Total Stock</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Awaiting your first store product listing. Click 'Add Product Listing' to begin.
                </td>
              </tr>
            ) : (
              products.map(prod => {
                const totalStock = prod.variants.reduce((acc, v) => acc + v.inventory, 0);
                const statusBadge = prod.publicationStatus === 'published' ? 'badge-success' : 'badge-warning';

                return (
                  <tr key={prod.id}>
                    <td>
                      <img 
                        src={prod.images[0]} 
                        alt={prod.title} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{prod.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>ID: {prod.id}</div>
                    </td>
                    <td>{prod.category}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(prod.price)}</td>
                    <td>
                      {totalStock <= 0 ? (
                        <span className="badge badge-danger">Out of stock (0)</span>
                      ) : totalStock <= 5 ? (
                        <span className="badge badge-warning low-stock-alert" style={{ animation: 'none' }}>
                          Low ({totalStock})
                        </span>
                      ) : (
                        <span className="badge badge-primary">{totalStock} units</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${statusBadge}`} style={{ textTransform: 'uppercase' }}>
                        {prod.publicationStatus}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        <button 
                          onClick={() => handleOpenEditModal(prod)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px' }}
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(prod.id, prod.title)}
                          className="btn btn-outline btn-sm text-danger"
                          style={{ padding: '6px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Add/Edit Product Modal Dialog */}
      {isModalOpen && (
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
          <div className="modal-content card" style={{ maxWidth: '650px', width: '90vw', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
            
            <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
                {editingId ? 'Edit Product Listing' : 'Create New Listing'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              
              {/* Product Title */}
              <div className="form-group">
                <label className="form-label">Product Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Minimalist Cotton Oversized Tee"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="form-input"
                />
                {formErrors.title && <span className="form-error">{formErrors.title}</span>}
              </div>

              {/* Rich-Text Editor Description Mockup */}
              <div className="form-group">
                <label className="form-label">Detailed Product Description</label>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  
                  {/* Rich Text Toolbar Mock */}
                  <div className="flex gap-sm" style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                    <button type="button" style={{ padding: '4px', borderRadius: '4px' }} title="Bold" onClick={() => addToast('Rich text styling: Bold applied (visual mock only).', 'info')}>
                      <Bold size={14} />
                    </button>
                    <button type="button" style={{ padding: '4px', borderRadius: '4px' }} title="Italic" onClick={() => addToast('Rich text styling: Italic applied (visual mock only).', 'info')}>
                      <Italic size={14} />
                    </button>
                    <button type="button" style={{ padding: '4px', borderRadius: '4px' }} title="Insert Link" onClick={() => addToast('Rich text styling: Link prompt opened (visual mock only).', 'info')}>
                      <Link2 size={14} />
                    </button>
                    <div style={{ width: '1px', backgroundColor: 'var(--border-color)', margin: '0 4px' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>HTML Visualizer Active</span>
                  </div>

                  <textarea
                    placeholder="Describe materials, sizing fit, color options, shipping timelines and wash instructions..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="form-input"
                    rows="4"
                    style={{ border: 'none', borderRadius: 0 }}
                  />

                </div>
                {formErrors.description && <span className="form-error">{formErrors.description}</span>}
              </div>

              {/* Category and Status */}
              <div className="grid grid-2 gap-md" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Marketplace Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="form-input"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Visibility Status</label>
                  <div className="flex align-center gap-sm" style={{ marginTop: '8px', cursor: 'pointer' }} onClick={() => setPublicationStatus(prev => prev === 'published' ? 'draft' : 'published')}>
                    {publicationStatus === 'published' ? (
                      <span className="flex align-center gap-xs text-gradient" style={{ fontWeight: 600 }}>
                        <ToggleRight size={30} style={{ color: 'var(--primary)' }} /> Published
                      </span>
                    ) : (
                      <span className="flex align-center gap-xs" style={{ color: 'var(--text-secondary)' }}>
                        <ToggleLeft size={30} /> Saved to Drafts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Module */}
              <div className="grid grid-2 gap-md">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="29.99"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="form-input"
                  />
                  {formErrors.price && <span className="form-error">{formErrors.price}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Compare-at Price (Strike-through)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 39.99"
                    value={compareAtPrice}
                    onChange={e => setCompareAtPrice(e.target.value)}
                    className="form-input"
                  />
                  {formErrors.compareAtPrice && <span className="form-error">{formErrors.compareAtPrice}</span>}
                </div>
              </div>

              {/* Image URLs input collection */}
              <div className="form-group">
                <div className="flex justify-between align-center" style={{ marginBottom: '6px' }}>
                  <label className="form-label">Product Visual Images (Unsplash URLs preferred)</label>
                  <button type="button" onClick={addImageField} style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }} className="flex align-center gap-xs">
                    <PlusCircle size={12} /> Add Image Slot
                  </button>
                </div>
                
                <div className="flex flex-col gap-sm">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex gap-sm align-center">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={img}
                        onChange={e => handleImageUrlChange(idx, e.target.value)}
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                      {images.length > 1 && (
                        <button type="button" onClick={() => removeImageField(idx)} className="btn btn-outline text-danger" style={{ padding: '8px' }}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Variant and inventory management */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '16px', backgroundColor: 'var(--bg-primary)', marginTop: '10px' }}>
                <div className="flex justify-between align-center" style={{ marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <div className="flex align-center gap-sm">
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Configure Variant Options</span>
                    <input 
                      type="text" 
                      value={variantName}
                      onChange={handleVariantNameChange}
                      placeholder="Size / Color / Style"
                      className="form-input"
                      style={{ width: '100px', padding: '4px 8px', fontSize: '0.78rem' }}
                    />
                  </div>
                  <button type="button" onClick={addVariantRow} style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }} className="flex align-center gap-xs">
                    <PlusCircle size={12} /> Add Variant Option
                  </button>
                </div>

                {formErrors.variants && (
                  <div className="badge badge-danger" style={{ display: 'block', padding: '6px', fontSize: '0.75rem', marginBottom: '10px', textAlign: 'center', width: '100%' }}>
                    {formErrors.variants}
                  </div>
                )}

                <div className="flex flex-col gap-sm" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {variants.map((v, idx) => (
                    <div key={v.id} className="flex gap-sm align-center" style={{ flexWrap: 'wrap' }}>
                      
                      {/* Option Value */}
                      <input 
                        type="text" 
                        placeholder={variantName === 'Size' ? 'e.g. S, M, L' : 'e.g. Black'}
                        value={v.value}
                        onChange={e => handleVariantRowChange(v.id, 'value', e.target.value)}
                        className="form-input"
                        style={{ width: '110px', padding: '8px 10px', fontSize: '0.8rem' }}
                      />

                      {/* SKU code */}
                      <input 
                        type="text" 
                        placeholder="SKU"
                        value={v.sku}
                        onChange={e => handleVariantRowChange(v.id, 'sku', e.target.value)}
                        className="form-input"
                        style={{ width: '140px', padding: '8px 10px', fontSize: '0.8rem' }}
                      />

                      {/* Stock Quantity */}
                      <div className="flex align-center gap-xs" style={{ fontSize: '0.8rem' }}>
                        <span>Inv:</span>
                        <input 
                          type="number" 
                          value={v.inventory}
                          onChange={e => handleVariantRowChange(v.id, 'inventory', e.target.value)}
                          className="form-input"
                          style={{ width: '70px', padding: '8px 10px' }}
                        />
                      </div>

                      {/* Option Price Override */}
                      <div className="flex align-center gap-xs" style={{ fontSize: '0.8rem' }}>
                        <span>Price:</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={v.price}
                          onChange={e => handleVariantRowChange(v.id, 'price', e.target.value)}
                          className="form-input"
                          style={{ width: '85px', padding: '8px 10px' }}
                        />
                      </div>

                      {variants.length > 1 && (
                        <button type="button" onClick={() => removeVariantRow(v.id)} className="btn btn-outline text-danger" style={{ padding: '6px' }}>
                          <Trash2 size={14} />
                        </button>
                      )}

                    </div>
                  ))}
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between" style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex align-center gap-sm">
                  <Save size={16} /> Save Product Listing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
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
          zIndex: 1200
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90vw', padding: '24px', textAlign: 'center' }}>
            <AlertCircle size={40} style={{ color: 'var(--danger)', margin: '0 auto 12px' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '8px' }}>Delete Product Listing?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.4 }}>
              Are you sure you want to delete <strong>"{deleteConfirmTitle}"</strong>? This will immediately remove it from the catalog and any active cart sessions.
            </p>
            <div className="flex gap-sm justify-center">
              <button onClick={() => { setDeleteConfirmId(null); setDeleteConfirmTitle(''); }} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await deleteProduct(deleteConfirmId);
                    addToast(`Successfully deleted "${deleteConfirmTitle}"`, 'success');
                  } catch (err) {
                    addToast(err.message, 'error');
                  } finally {
                    setDeleteConfirmId(null);
                    setDeleteConfirmTitle('');
                  }
                }} 
                className="btn btn-primary btn-sm" 
                style={{ backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
