import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { mockDb } from '../services/mockDb';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [cartAlerts, setCartAlerts] = useState([]);

  // Load cart on user login
  useEffect(() => {
    if (user && user.role === 'buyer') {
      const stored = localStorage.getItem(`merchora_cart_${user.id}`);
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
    setCoupon(null);
    setCouponError(null);
    setCartAlerts([]);
  }, [user]);

  // Save cart changes
  const saveCart = (items) => {
    setCartItems(items);
    if (user && user.role === 'buyer') {
      localStorage.setItem(`merchora_cart_${user.id}`, JSON.stringify(items));
    }
  };

  // RECONCILE CART ITEMS AGAINST LATEST PRODUCTS STATE
  // Runs whenever the products list changes or when user accesses cart
  const reconcileCart = useCallback(() => {
    if (!user || user.role !== 'buyer' || products.length === 0 || cartItems.length === 0) return;

    let changed = false;
    const reconciled = [];
    const alerts = [];

    for (const item of cartItems) {
      const dbProd = products.find(p => p.id === item.productId);

      // 1. If product was deleted or made draft by seller
      if (!dbProd || dbProd.publicationStatus === 'draft') {
        alerts.push(`"${item.title}" is no longer available and has been removed from your cart.`);
        changed = true;
        continue;
      }

      // Find active variant
      const dbVariant = dbProd.variants.find(v => v.id === item.variantId);
      if (!dbVariant) {
        alerts.push(`Selected option for "${item.title}" is no longer available and has been removed.`);
        changed = true;
        continue;
      }

      const freshItem = { ...item };

      // 2. Check for price changes
      if (dbVariant.price !== item.price) {
        alerts.push(`The price of "${item.title} (${item.variantValue})" changed from $${item.price} to $${dbVariant.price}.`);
        freshItem.price = dbVariant.price;
        changed = true;
      }

      // 3. Check for inventory updates / stock caps
      if (dbVariant.inventory <= 0) {
        alerts.push(`"${item.title} (${item.variantValue})" has sold out and was removed from your cart.`);
        changed = true;
        continue;
      } else if (dbVariant.inventory < item.quantity) {
        alerts.push(`Only ${dbVariant.inventory} units are available for "${item.title} (${item.variantValue})". Your cart quantity has been updated.`);
        freshItem.quantity = dbVariant.inventory;
        changed = true;
      }

      reconciled.push(freshItem);
    }

    if (changed) {
      saveCart(reconciled);
      setCartAlerts(prev => [...new Set([...prev, ...alerts])]);
    }
  }, [products, cartItems, user]);

  // Run reconciliation periodically when products load
  useEffect(() => {
    reconcileCart();
  }, [products]);

  const addToCart = (product, variant, qty = 1) => {
    if (!user) {
      addToast('Please log in as a Buyer to add items to your cart.', 'error');
      return;
    }
    if (user.role !== 'buyer') {
      addToast('Sellers cannot purchase products. Please log in as a Buyer.', 'error');
      return;
    }

    if (variant.inventory <= 0) {
      addToast('Sorry, this option is currently out of stock.', 'error');
      return;
    }

    const items = [...cartItems];
    const existingIdx = items.findIndex(
      item => item.productId === product.id && item.variantId === variant.id
    );

    if (existingIdx > -1) {
      const newQty = items[existingIdx].quantity + qty;
      if (newQty > variant.inventory) {
        addToast(`Only ${variant.inventory} units available. We set your cart quantity to the limit.`, 'info');
        items[existingIdx].quantity = variant.inventory;
      } else {
        items[existingIdx].quantity = newQty;
        addToast(`Updated quantity of ${product.title} (${variant.value}) in your cart.`, 'success');
      }
    } else {
      items.push({
        productId: product.id,
        sellerId: product.sellerId,
        title: product.title,
        image: product.images[0],
        price: variant.price,
        quantity: Math.min(qty, variant.inventory),
        variantId: variant.id,
        variantName: variant.name,
        variantValue: variant.value
      });
      addToast(`Added ${product.title} (${variant.value}) to your cart.`, 'success');
    }

    saveCart(items);
  };

  const removeFromCart = (productId, variantId) => {
    const filtered = cartItems.filter(
      item => !(item.productId === productId && item.variantId === variantId)
    );
    saveCart(filtered);
  };

  const updateQuantity = (productId, variantId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const dbProd = products.find(p => p.id === productId);
    const dbVariant = dbProd?.variants.find(v => v.id === variantId);

    if (dbVariant && newQty > dbVariant.inventory) {
      addToast(`Only ${dbVariant.inventory} units of this item are currently available.`, 'info');
      newQty = dbVariant.inventory;
    }

    const updated = cartItems.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });

    saveCart(updated);
  };

  const applyCoupon = async (code) => {
    setCouponError(null);
    try {
      const data = await mockDb.validateCoupon(code);
      setCoupon(data);
      return data;
    } catch (e) {
      setCouponError(e.message);
      setCoupon(null);
      throw e;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
    setCouponError(null);
  };

  const clearAlerts = () => {
    setCartAlerts([]);
  };

  // CALCULATIONS
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const getDiscount = () => {
    if (!coupon) return 0;
    const subtotal = getSubtotal();
    if (coupon.discountType === 'percentage') {
      return parseFloat(((subtotal * coupon.value) / 100).toFixed(2));
    } else {
      return Math.min(coupon.value, subtotal);
    }
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  };

  const getTax = () => {
    // 8.875% estimated sales tax
    const subtotal = getSubtotal() - getDiscount();
    return parseFloat((subtotal * 0.08875).toFixed(2));
  };

  const getTotal = () => {
    const total = getSubtotal() - getDiscount() + getShipping() + getTax();
    return parseFloat(Math.max(0, total).toFixed(2));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      coupon,
      couponError,
      cartAlerts,
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      clearAlerts,
      reconcileCart,
      getSubtotal,
      getDiscount,
      getShipping,
      getTax,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
