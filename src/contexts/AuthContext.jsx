import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { mockDb, initializeDb } from '../services/mockDb';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

// Inactivity timeout: 10 minutes (600,000 ms) for automatic session logout
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; 

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inactivityTimerRef = useRef(null);

  // Initialize DB on boot
  useEffect(() => {
    initializeDb();
    
    // Check if token exists in session memory
    const savedUser = sessionStorage.getItem('merchora_auth_user');
    const savedToken = sessionStorage.getItem('merchora_auth_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      simulateRefreshToken();
    }
    setLoading(false);
  }, []);

  const simulateRefreshToken = async () => {
    try {
      console.log('Verifying session / refreshing JWT token securely...');
    } catch (e) {
      logout();
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('merchora_auth_user');
    sessionStorage.removeItem('merchora_auth_token');
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  // Inactivity watchdog reset
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    if (user) {
      inactivityTimerRef.current = setTimeout(() => {
        logout();
        addToast('Your session has expired due to inactivity. Please log in again.', 'error');
      }, INACTIVITY_TIMEOUT);
    }
  }, [user, logout, addToast]);

  // Set up listeners for user activity to reset inactivity watchdog
  useEffect(() => {
    if (user) {
      resetInactivityTimer();
      const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
      const handler = () => resetInactivityTimer();
      
      events.forEach(event => {
        window.addEventListener(event, handler);
      });
      
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, handler);
        });
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [user, resetInactivityTimer]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockDb.login(email, password);
      setUser(res.user);
      setToken(res.token);
      sessionStorage.setItem('merchora_auth_user', JSON.stringify(res.user));
      sessionStorage.setItem('merchora_auth_token', res.token);
      addToast(`Welcome back, ${res.user.profile.name || res.user.email}!`, 'success');
      return res.user;
    } catch (e) {
      setError(e.message);
      addToast(e.message || 'Login failed. Please inspect details.', 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Registration handler for buyers
  const registerBuyer = async (email, password, name, shippingAddress, paymentPreference) => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockDb.registerBuyer(email, password, name, shippingAddress, paymentPreference);
      setUser(res.user);
      setToken(res.token);
      sessionStorage.setItem('merchora_auth_user', JSON.stringify(res.user));
      sessionStorage.setItem('merchora_auth_token', res.token);
      addToast('Buyer account registered successfully!', 'success');
      return res.user;
    } catch (e) {
      setError(e.message);
      addToast(e.message || 'Registration failed.', 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Registration handler for sellers
  const registerSeller = async (email, password, businessName, contact, taxId, bankAccount) => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockDb.registerSeller(email, password, businessName, contact, taxId, bankAccount);
      setUser(res.user);
      setToken(res.token);
      sessionStorage.setItem('merchora_auth_user', JSON.stringify(res.user));
      sessionStorage.setItem('merchora_auth_token', res.token);
      addToast('Seller business account created successfully!', 'success');
      return res.user;
    } catch (e) {
      setError(e.message);
      addToast(e.message || 'Registration failed.', 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Profile updater
  const updateProfile = async (profileData) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await mockDb.updateProfile(user.id, user.role, profileData);
      setUser(updatedUser);
      sessionStorage.setItem('merchora_auth_user', JSON.stringify(updatedUser));
      addToast('Business settings details updated successfully!', 'success');
      return updatedUser;
    } catch (e) {
      setError(e.message);
      addToast(e.message || 'Profile settings update failed.', 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      registerBuyer,
      registerSeller,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
