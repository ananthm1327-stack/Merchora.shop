import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockDb } from '../services/mockDb';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { cartItems, getTotal, clearCart, coupon } = useCart();
  
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerAnalytics, setSellerAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBuyerOrders = useCallback(async () => {
    if (!user || user.role !== 'buyer') return;
    setLoading(true);
    try {
      const orders = await mockDb.getBuyerOrders(user.id);
      setBuyerOrders(orders);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSellerOrders = useCallback(async () => {
    if (!user || user.role !== 'seller') return;
    setLoading(true);
    try {
      const orders = await mockDb.getSellerOrders(user.id);
      setSellerOrders(orders);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSellerAnalytics = useCallback(async () => {
    if (!user || user.role !== 'seller') return;
    setLoading(true);
    try {
      const analytics = await mockDb.getSellerAnalytics(user.id);
      setSellerAnalytics(analytics);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const placeOrder = async (shippingAddress) => {
    if (!user || user.role !== 'buyer') {
      throw new Error('You must be logged in as a buyer to check out.');
    }
    if (cartItems.length === 0) {
      throw new Error('Your cart is empty.');
    }

    setLoading(true);
    setError(null);
    try {
      const totalAmount = getTotal();
      const createdOrders = await mockDb.createOrder(
        user.id,
        user.profile.name || 'Alex Johnson',
        cartItems,
        totalAmount,
        shippingAddress,
        coupon?.code
      );
      
      // Clear shopping cart
      clearCart();
      
      // Refresh local order list
      setBuyerOrders(prev => [...createdOrders, ...prev]);
      return createdOrders;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, trackingNumber) => {
    if (!user || user.role !== 'seller') {
      throw new Error('Only authorized sellers can update orders.');
    }
    setLoading(true);
    try {
      const updated = await mockDb.updateOrderStatus(user.id, orderId, status, trackingNumber);
      
      // Update list
      setSellerOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      
      // Refresh analytics
      fetchSellerAnalytics();
      return updated;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      buyerOrders,
      sellerOrders,
      sellerAnalytics,
      loading,
      error,
      fetchBuyerOrders,
      fetchSellerOrders,
      fetchSellerAnalytics,
      placeOrder,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
