import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '@/utils/constants'

const authorizedAxiosInstance = axios.create({
  baseURL: API_ROOT,
  timeout: 60000,
})

// Request interceptor - add Authorization header from localStorage
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization header from localStorage token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - clearing auth and redirecting to login');
      // Clear localStorage token on 401
      localStorage.removeItem('accessToken');
      
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    let errorMessage = error.message || 'Something went wrong!'

    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      errorMessage = (error.response.data as any).message
    }

    // handle error message
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
