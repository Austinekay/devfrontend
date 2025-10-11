export type UserRole = 'user' | 'shop_owner' | 'admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  suspended?: boolean;
  shopApproved?: boolean;
}

export interface Shop {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  owner?: {
    _id: string;
    name: string;
    email: string;
  };
  ownerId?: string;
  categories: string[];
  images?: string[];
  contact?: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed?: boolean;
    };
  };
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ShopState {
  shops: Shop[];
  loading: boolean;
  error: string | null;
}

export interface AnalyticsData {
  _id: string;
  views: number;
  clicks: number;
}

export interface ShopAnalytics {
  analytics: AnalyticsData[];
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
  totalViews: number;
  totalClicks: number;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  shop: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  dailyVisits: number;
  dailyClicks: number;
  totalReviews: number;
  totalShops: number;
}

export interface ShopWithAnalytics extends Shop {
  analytics: {
    totalViews: number;
    totalClicks: number;
    totalReviews: number;
  };
}
