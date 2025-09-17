import axios from 'axios';
import { Shop } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, role: string = 'shop_owner') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },
};

// Mock data store
let mockShops: Shop[] = [
  {
    id: '1',
    name: 'Coffee Shop',
    description: 'A cozy coffee shop in downtown',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    address: '123 Main St',
    ownerId: '1',
    categories: ['Cafe', 'Coffee'],
    openingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '09:00', close: '18:00' }
    }
  },
  {
    id: '2',
    name: 'Book Store',
    description: 'Your local bookstore with a wide selection',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    address: '456 Oak Ave',
    ownerId: '1',
    categories: ['Books', 'Stationery'],
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '17:00' },
      sunday: { open: '10:00', close: '16:00' }
    }
  }
];

export const shopService = {
  getShops: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockShops;
  },

  getAllShops: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockShops;
  },

  createShop: async (shopData: Partial<Shop>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newShop: Shop = {
      id: Date.now().toString(),
      ownerId: '1',
      name: shopData.name || '',
      description: shopData.description || '',
      location: {
        type: 'Point',
        coordinates: [0, 0]
      },
      address: shopData.address || '',
      categories: shopData.categories || ['General'],
      openingHours: shopData.openingHours || {
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        wednesday: { open: '09:00', close: '17:00' },
        thursday: { open: '09:00', close: '17:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { open: '10:00', close: '16:00' }
      }
    };
    mockShops.push(newShop);
    return newShop;
  },

  getShopById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const shop = mockShops.find(s => s.id === id);
    if (!shop) throw new Error('Shop not found');
    return shop;
  },

  updateShop: async (id: string, shopData: Partial<Shop>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockShops = mockShops.map((shop: Shop) => 
      shop.id === id ? { ...shop, ...shopData } : shop
    );
    const updatedShop = mockShops.find((s: Shop) => s.id === id);
    if (!updatedShop) throw new Error('Shop not found');
    return updatedShop;
  },

  deleteShop: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockShops = mockShops.filter((shop: Shop) => shop.id !== id);
    return { success: true };
  },

  searchShops: async (query: string, location?: { lat: number; lng: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockShops.filter((shop: Shop) => 
      shop.name.toLowerCase().includes(query.toLowerCase()) ||
      shop.description.toLowerCase().includes(query.toLowerCase())
    );
  },
};

export default api;
