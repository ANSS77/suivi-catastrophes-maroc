import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, logout as logoutService, register as registerService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  );
  
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (stored) {
      const parsed = JSON.parse(stored);
      // Si le rôle est manquant mais qu'on a un token, on le décode
      if (!parsed.role && token) {
        try {
          const decoded = jwtDecode(token);
          return { ...parsed, ...decoded };
        } catch (e) {
          return parsed;
        }
      }
      return parsed;
    }
    return null;
  });

  const login = async (data) => {
    try {
      const userData = await loginService(data);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch (error) {
      console.error("Logout failed", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const register = async (data) => {
    await registerService(data);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);