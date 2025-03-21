import React, { createContext, useState, useContext, useEffect } from 'react';

export interface User {
  id: number;
  userId: string;
  email: string;  // これを追加
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState<User | null>(null);

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/check-session', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (!response.ok) {
        throw new Error('セッションが無効です');
      }

      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const login = async (userId: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '認証に失敗しました');
      }

      const data = await response.json();
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        throw new Error('不正なレスポンス形式です');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, checkAuthStatus }}>
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
