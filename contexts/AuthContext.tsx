import React, { createContext, useContext, useState, ReactNode } from 'react';
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { API_ROOT } from "@/utils/constants";
import { toast } from "react-toastify";
import { User } from '@/types';
import { userAPI } from '@/lib/api';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  getCurrentUser: () => Promise<void>;
  logout: (showSuccessMessage?: boolean) => Promise<void>;
  updateUser: (data: any) => Promise<User | null>;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const user = await userAPI.getMe();
      setCurrentUser(user.data);
    } catch (error: any) {
      // If it's a 401, token is invalid - clear it
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setCurrentUser(null);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (showSuccessMessage?: boolean) => {
    try {
      // Call logout API endpoint
      await authorizedAxiosInstance.delete(`${API_ROOT}/auth/logout`);
      
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Always clear localStorage and user state regardless of API response
      localStorage.removeItem('accessToken');
      setCurrentUser(null);
      
      if (showSuccessMessage) {
        toast.success('Đăng xuất thành công!');
      }
    }
  };

  const updateUser = async (data: any): Promise<User | null> => {
    try {
      setLoading(true);
      
      const request = await authorizedAxiosInstance.put(`${API_ROOT}/users/update`, data);
      const updatedUser = request.data.user;
      
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error: any) {
      // Re-throw to let the calling component handle the error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setUserDirectly = (user: User | null) => {
    setCurrentUser(user);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    getCurrentUser,
    logout,
    updateUser,
    setCurrentUser: setUserDirectly,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 