import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { storage } from '../utils/storage';
import api from '../services/api';

// 1. Updated Interface to include 'role'
interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null; // Store 'admin' or 'user'
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storage.getToken());
  const [role, setRole] = useState<string | null>(null); // New state for role
  const [loading, setLoading] = useState(true);

  // Helper to decode JWT without an extra library (standard base64 decode)
  const getRoleFromToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).role;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = storage.getToken();
      if (token) {
        try {
          // Verify with backend and get user profile
          const response = await api.get('/profile');
          setIsAuthenticated(true);
          setRole(response.data.user.role); // Set role from backend response
        } catch (error) {
          storage.removeToken();
          setIsAuthenticated(false);
          setRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = (token: string) => {
    storage.setToken(token);
    const userRole = getRoleFromToken(token); // Extract role immediately for UI redirect
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    storage.removeToken();
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};