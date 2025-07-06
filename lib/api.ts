import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, STORAGE_KEYS } from '../constants';
import { 
  ApiResponse, 
  PaginatedResponse, 
  AuthResponse, 
  User, 
  Expense, 
  ExpenseStats,
  SlackUser,
  UserSettings,
  CreateExpenseFormData,
  UpdateExpenseFormData,
  ExpenseFilter,
  SortOptions,
  LoginCredentials,
  RegisterCredentials
} from '../types';

// API Error class for better error handling
export class ApiError extends Error {
  public statusCode: number;
  public data: any;
  public isNetworkError: boolean;
  
  constructor(
    message: string,
    statusCode: number = 500,
    data: any = null,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    this.isNetworkError = isNetworkError;
  }
}

// Create axios instance with default configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const { response, request } = error;
      
      // Network error
      if (!response) {
        throw new ApiError(
          ERROR_MESSAGES.NETWORK,
          0,
          null,
          true
        );
      }
      
      // HTTP error responses
      const { status, data } = response;
      
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new ApiError(ERROR_MESSAGES.UNAUTHORIZED, status, data);
          
        case HTTP_STATUS.FORBIDDEN:
          throw new ApiError(ERROR_MESSAGES.FORBIDDEN, status, data);
          
        case HTTP_STATUS.NOT_FOUND:
          throw new ApiError(ERROR_MESSAGES.NOT_FOUND, status, data);
          
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          throw new ApiError(ERROR_MESSAGES.SERVER_ERROR, status, data);
          
        default:
          const errorMessage = (data as any)?.message || ERROR_MESSAGES.SERVER_ERROR;
          throw new ApiError(errorMessage, status, data);
      }
    }
  );
  
  return instance;
};

// Create API instance
const api = createApiInstance();

// Generic API request function with retry logic
async function apiRequest<T>(
  request: () => Promise<AxiosResponse<T>>,
  retryCount = 0
): Promise<T> {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && !error.isNetworkError) {
      throw error;
    }
    
    if (retryCount < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiRequest(request, retryCount + 1);
    }
    
    throw error;
  }
}

// Auth API
export const authAPI = {
  /**
   * Login with username and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiRequest(() => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials));
  },

  /**
   * Register new user
   */
  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    return apiRequest(() => api.post(API_ENDPOINTS.AUTH.REGISTER, data));
  },

  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiRequest(() => api.get(API_ENDPOINTS.AUTH.CURRENT_USER));
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest(() => api.post(API_ENDPOINTS.AUTH.LOGOUT));
  },

  /**
   * Validate JWT token
   */
  validateToken: async (token: string): Promise<ApiResponse<{ valid: boolean; user: User }>> => {
    return apiRequest(() => api.post(API_ENDPOINTS.AUTH.VALIDATE_TOKEN, { token }));
  },

  /**
   * Get team members
   */
  getTeamMembers: async (): Promise<ApiResponse<User[]>> => {
    return apiRequest(() => api.get(API_ENDPOINTS.AUTH.TEAM_MEMBERS));
  },
};
