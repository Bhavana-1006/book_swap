import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bookswap_token') || '');
  const [loading, setLoading] = useState(true);

  // Verify and fetch user profile when token is present
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('bookswap_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        localStorage.removeItem('bookswap_token');
        setUser(null);
        setToken('');
      }
    } catch (err) {
      console.warn('Auth verification failed:', err.response?.data?.message || err.message);
      localStorage.removeItem('bookswap_token');
      setUser(null);
      setToken('');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('bookswap_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  // Register handler (supports multipart/form-data for optional avatar)
  const register = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    const res = await api.post('/api/auth/register', formData, config);
    if (res.data.success) {
      localStorage.setItem('bookswap_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('bookswap_token');
    setToken('');
    setUser(null);
  };

  // Update profile
  const updateProfile = async (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    const res = await api.put('/api/users/profile', formData, config);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
      return res.data;
    }
    throw new Error(res.data.message || 'Profile update failed');
  };

  const refreshUser = () => {
    return checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateProfile,
        refreshUser
      }}
    >
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
