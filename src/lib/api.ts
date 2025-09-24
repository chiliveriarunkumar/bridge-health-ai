import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Unauthorized - clear auth and redirect
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
      return Promise.reject(error);
    }
    
    if (response?.status === 403) {
      const errorCode = response.data?.code;
      
      switch (errorCode) {
        case 'CONSENT_EXPIRED':
          toast({
            title: 'Consent Expired',
            description: 'Your access has expired. Please ask the patient to re-approve consent.',
            variant: 'destructive',
          });
          break;
        case 'SCOPE_VIOLATION':
          toast({
            title: 'Access Denied',
            description: 'The requested data is not within your granted scope.',
            variant: 'destructive',
          });
          break;
        default:
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this resource.',
            variant: 'destructive',
          });
      }
      return Promise.reject(error);
    }
    
    if (response?.status >= 500) {
      toast({
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);

// Mock data flag - for development
export const USE_MOCKS = !import.meta.env.VITE_API_URL;

// Mock response helper
export const mockResponse = <T>(data: T, delay = 500): Promise<{ data: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), delay);
  });
};