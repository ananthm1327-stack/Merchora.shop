import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockDb } from '../services/mockDb';
import { useAuth } from './AuthContext';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    'All', 
    'Apparel', 
    'Electronics', 
    'Footwear', 
    'Accessories', 
    'Home & Living',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Automotive'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockDb.getProducts();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductById = async (id) => {
    return await mockDb.getProductById(id);
  };

  const createProduct = async (productData) => {
    if (!user || user.role !== 'seller') throw new Error('Only registered sellers can create products.');
    setLoading(true);
    try {
      const newProd = await mockDb.createProduct(user.id, productData);
      setProducts(prev => [newProd, ...prev]);
      return newProd;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!user || user.role !== 'seller') throw new Error('Only sellers can update products.');
    setLoading(true);
    try {
      const updatedProd = await mockDb.updateProduct(user.id, productId, productData);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProd : p));
      return updatedProd;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!user || user.role !== 'seller') throw new Error('Only sellers can delete products.');
    setLoading(true);
    try {
      await mockDb.deleteProduct(user.id, productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      return true;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getProductReviews = async (productId) => {
    return await mockDb.getProductReviews(productId);
  };

  const addProductReview = async (productId, rating, comment) => {
    if (!user || user.role !== 'buyer') throw new Error('Only buyers can leave product reviews.');
    try {
      const newReview = await mockDb.addProductReview(user.id, user.profile.name || 'Anonymous', productId, rating, comment);
      return newReview;
    } catch (e) {
      throw e;
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      loading,
      error,
      fetchProducts,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      getProductReviews,
      addProductReview
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
