import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';
import { useNotifications } from '../hooks';
import { User } from '../types';
import { ROUTES } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const { addNotification } = useNotifications();

  // Pages that don't require authentication
  const publicPages = ['/login', '/register'];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user_data');

      if (token && savedUser) {
        try {
          // Validate token with server
          const response = await authAPI.validateToken(token);
          
          if (response.data?.valid && response.data?.user) {
            setUser(response.data.user);
            // Update local storage with fresh user data
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
          } else {
            // Token is invalid
            clearAuthData();
            if (!publicPages.includes(router.pathname)) {
              router.push('/login');
            }
          }
        } catch (error) {
          addNotification({
            type: 'warning',
            title: 'Phiên đăng nhập',
            message: 'Phiên đăng nhập có thể đã hết hạn. Vui lòng đăng nhập lại.'
          });
          
          // If validation fails, try to use saved user data
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
          
          // Optionally redirect to login if token is completely invalid
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as any;
            if (axiosError.response?.status === 401) {
              clearAuthData();
              if (!publicPages.includes(router.pathname)) {
                router.push('/login');
              }
            }
          }
        }
      } else {
        if (!publicPages.includes(router.pathname)) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user_data', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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

// HOC for protecting routes
export const withAuth = (WrappedComponent: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Đang kết nối...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}; 