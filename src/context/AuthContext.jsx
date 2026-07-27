import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/auth';
import { kycApi } from '../api/kyc';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const pathname = window.location.pathname;
      if (pathname === '/login' || pathname === '/signup') {
        setIsLoading(false);
        return;
      }
      try {
        const response = await authApi.getMe();
        setUser(response.user);
        setKycVerified(response.user.kycVerified || false);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        setKycVerified(false);
        setIsAuthenticated(false);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const signup = async (userData) => {
    const data = await authApi.signup(userData);
    setUser(data.user);
    setKycVerified(data.user.kycVerified || false);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('token');
    setUser(null);
    setKycVerified(false);
    setIsAuthenticated(false);
  };

  const verifyKyc = async (code) => {
    const data = await kycApi.verifyKyc(code);
    setKycVerified(true);
    // Optionally update user object
    if (user) {
      setUser({ ...user, kycVerified: true });
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, isLoading, isAuthenticated, kycVerified, 
      login, signup, logout, verifyKyc 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};