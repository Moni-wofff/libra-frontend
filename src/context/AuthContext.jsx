import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('libra_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authentication state on app load / refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('libra_token');
      const storedUser = localStorage.getItem('libra_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse cached user', e);
          }
        }

        // Verify token with backend
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('libra_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid, logging out.');
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('libra_token', data.token);
      localStorage.setItem('libra_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('libra_token', data.token);
      localStorage.setItem('libra_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('libra_token');
    localStorage.removeItem('libra_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isUser: user?.role === 'user',
        isLoading,
        login,
        register,
        logout,
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
