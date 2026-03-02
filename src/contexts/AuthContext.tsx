import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../utils/database';
import { db } from '../utils/database';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: 'user' | 'shop_owner') => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem('instashop_auth_user');
    if (savedUserId) {
      const foundUser = db.getUser(savedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = db.getUserByEmail(email);
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      localStorage.setItem('instashop_auth_user', foundUser.id);
      return true;
    }
    return false;
  };

  const signup = (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'shop_owner'
  ): boolean => {
    // Check if email already exists
    if (db.getUserByEmail(email)) {
      return false;
    }

    // Create new user
    const userId = db.addUser({
      name,
      email,
      password,
      role,
    });

    const newUser = db.getUser(userId);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('instashop_auth_user', userId);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('instashop_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
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
