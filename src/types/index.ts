export type UserRole = 'user' | 'shop_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Optional to keep existing user data valid
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  ownerId: string;
  categories: string[];
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
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
