import axios from 'axios';
import { Shop, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., clear local storage and redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, role: string = 'user') => {
    const response = await api.post('/api/v1/auth/register', { name, email, password, role });
    return response.data;
  },

  googleLogin: () => {
    window.location.href = `${API_URL}/api/v1/auth/google`;
  },

  verify: async () => {
    const response = await api.get('/api/v1/auth/verify');
    return response.data;
  },
};



export const shopService = {
  getShops: async (lat?: number, lng?: number, radius?: number, category?: string) => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    if (radius) params.append('radius', radius.toString());
    if (category) params.append('category', category);
    // Add cache-busting parameter
    params.append('_t', Date.now().toString());
    
    const response = await api.get(`/api/v1/shops?${params}`);
    return response.data.shops;
  },

  searchShops: async (query: string) => {
    const response = await api.get(`/api/v1/shops?search=${query}`);
    return response.data.shops;
  },

  createShop: async (shopData: any) => {
    // Ensure location is in proper GeoJSON format
    if (shopData.coordinates) {
      shopData.location = {
        type: 'Point',
        coordinates: [shopData.coordinates[1], shopData.coordinates[0]] // [lng, lat]
      };
      delete shopData.coordinates;
      delete shopData.latitude;
      delete shopData.longitude;
    }
    const response = await api.post('/api/v1/shops', shopData);
    return response.data.shop;
  },

  getShopById: async (id: string) => {
    const response = await api.get(`/api/v1/shops/${id}`);
    return response.data.shop;
  },

  updateShop: async (id: string, shopData: Partial<Shop>) => {
    const response = await api.put(`/api/v1/shops/${id}`, shopData);
    return response.data.shop;
  },

  deleteShop: async (id: string) => {
    const response = await api.delete(`/api/v1/shops/${id}`);
    return response.data;
  },

  searchShopsByLocation: async (lat: number, lng: number, radius: number = 5000, category?: string) => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
      ...(category && { category })
    });
    const response = await api.get(`/api/v1/shops/search?${params}`);
    return response.data.shops;
  },

  getNearbyShops: async (lat: number, lng: number, radius: number = 2000) => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString()
    });
    const response = await api.get(`/api/v1/shops?${params}`);
    return response.data.shops;
  },
};

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/api/v1/users');
    return response.data.users;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/v1/users/me');
    return response.data.user;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data.user;
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post('/api/v1/users', userData);
    return response.data.user;
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/api/v1/users/${id}`, userData);
    return response.data.user;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  },
};

const adminService = {
  getAnalytics: async () => {
    const response = await api.get('/api/v1/admin/analytics');
    return response.data;
  },

  getShops: async () => {
    const response = await api.get('/api/v1/admin/shops');
    return response.data.shops;
  },

  createShop: async (shopData: any) => {
    const response = await api.post('/api/v1/admin/shops', shopData);
    return response.data.shop;
  },

  updateShop: async (shopId: string, shopData: any) => {
    const response = await api.put(`/api/v1/admin/shops/${shopId}`, shopData);
    return response.data.shop;
  },

  deleteShop: async (shopId: string) => {
    const response = await api.delete(`/api/v1/admin/shops/${shopId}`);
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/api/v1/admin/reports');
    return response.data.reports;
  },

  resolveReport: async (reportId: string, action: string, note?: string) => {
    const response = await api.put(`/api/v1/admin/reports/${reportId}`, { action, note });
    return response.data;
  },

  approveShop: async (shopId: string) => {
    const response = await api.put(`/api/v1/admin/shops/${shopId}/approve`);
    return response.data;
  },

  suspendUser: async (userId: string, suspend: boolean) => {
    const response = await api.put(`/api/v1/admin/users/${userId}/suspend`, { suspend });
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/api/v1/admin/settings');
    return response.data.settings;
  },

  updateSettings: async (settings: any) => {
    const response = await api.put('/api/v1/admin/settings', settings);
    return response.data;
  },
};

export { shopOwnerService } from './shopOwnerService';
export { adminService };
export default api;
