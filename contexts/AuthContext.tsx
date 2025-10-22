import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DashboardData } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  register: (name: string, email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  updateProfile: (data: DashboardData) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app start, check if a user session exists in our simulated backend (localStorage)
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const user = await authService.login(email, pass);
    setCurrentUser(user);
    return user;
  };

  const register = async (name: string, email: string, pass: string) => {
    const user = await authService.register(name, email, pass);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (data: DashboardData) => {
    if (!currentUser) return null;
    const updatedUser = await authService.updateProfile(currentUser.id, data);
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};