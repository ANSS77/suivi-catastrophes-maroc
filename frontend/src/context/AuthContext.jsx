import { createContext, useState, useContext } from 'react';
import { login as loginService, logout as logoutService, register as registerService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  );

  const login = async (data) => {
    await loginService(data);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await logoutService();
    setIsAuthenticated(false);
  };

  const register = async (data) => {
    await registerService(data);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);