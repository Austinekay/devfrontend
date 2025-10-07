import { Shop, User, UserRole } from '../types';

const MOCK_SHOPS_KEY = 'mockShops';
const MOCK_USERS_KEY = 'mockUsers';

// Default admin user
const defaultUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@123',
    role: 'admin',
    password: 'admin123' // In a real app, this would be hashed
  }
];

const defaultShops: Shop[] = [
  {
    id: '1',
    name: 'Coffee Shop',
    description: 'A cozy coffee shop in downtown',
    location: { type: 'Point', coordinates: [0, 0] },
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
    location: { type: 'Point', coordinates: [0, 0] },
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

// Helper functions
const getMockUsers = (): User[] => {
  if (typeof window === 'undefined') return defaultUsers;
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (!stored) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};

const getMockShops = (): Shop[] => {
  if (typeof window === 'undefined') return defaultShops;
  const stored = localStorage.getItem(MOCK_SHOPS_KEY);
  if (!stored) {
    localStorage.setItem(MOCK_SHOPS_KEY, JSON.stringify(defaultShops));
    return defaultShops;
  }
  return JSON.parse(stored);
};

const saveMockShops = (shops: Shop[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_SHOPS_KEY, JSON.stringify(shops));
};

// Initialize with default data
if (typeof window !== 'undefined') {
  // Always ensure default admin user exists
  const existingUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
  const adminUser = existingUsers.find((u: User) => u.role === 'admin');
  if (!adminUser) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(MOCK_SHOPS_KEY)) {
    localStorage.setItem(MOCK_SHOPS_KEY, JSON.stringify(defaultShops));
  }
}

export const mockAuthService = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    try {
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Generate a mock token
      const token = `mock-token-${Date.now()}`;
      
      // Save current user without password
      const userWithoutPassword = { ...user, password: undefined };
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Return user data without password and token
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, role: UserRole = 'user') => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    try {
      console.log('Starting registration for:', email, 'with role:', role);
      
      // Make sure we have default data
      if (!localStorage.getItem(MOCK_USERS_KEY)) {
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
      }
      if (!localStorage.getItem(MOCK_SHOPS_KEY)) {
        localStorage.setItem(MOCK_SHOPS_KEY, JSON.stringify(defaultShops));
      }
      
      let users = [];
      try {
        const storedUsers = localStorage.getItem(MOCK_USERS_KEY);
        console.log('Stored users:', storedUsers);
        users = storedUsers ? JSON.parse(storedUsers) : [];
      } catch (e) {
        console.error('Error parsing users:', e);
        users = [];
      }
      
      console.log('Current users:', users);
      
      if (Array.isArray(users) && users.some((u: User) => u.email === email)) {
        console.log('Email exists:', email);
        throw new Error('Email already exists');
      }

      const userId = Date.now().toString();
      const newUser: User = {
        id: userId,
        name,
        email,
        role,
        password,
      };
      
      users.push(newUser);
      console.log('Updated users:', users);
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      console.log('Saved to localStorage');
      
      // If registering as shop owner, create a default shop
      if (role === 'shop_owner') {
        console.log('Creating default shop for new shop owner');
        const shops = JSON.parse(localStorage.getItem(MOCK_SHOPS_KEY) || '[]');
        const newShop: Shop = {
          id: `shop-${userId}`,
          name: 'My First Shop',
          description: 'Welcome to my shop!',
          location: { type: 'Point', coordinates: [0, 0] },
          address: 'Add your address',
          ownerId: userId,
          categories: ['General'],
          openingHours: {
            monday: { open: '09:00', close: '17:00' },
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '10:00', close: '16:00' },
            sunday: { open: '10:00', close: '16:00' }
          }
        };
        console.log('Created new shop:', newShop);
        shops.push(newShop);
        localStorage.setItem(MOCK_SHOPS_KEY, JSON.stringify(shops));
        console.log('Saved shops to localStorage:', shops);
      }

      // Save current user without password
      const userWithoutPassword = { ...newUser, password: undefined };
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Generate a mock token for auto-login after registration
      const token = `mock-token-${Date.now()}`;
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  }
};

export const mockShopService = {
  getShops: async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    console.log('Getting shops...');
    
    // Get current user
    const currentUserStr = localStorage.getItem('user');
    console.log('Current user from localStorage:', currentUserStr);
    
    if (!currentUserStr) {
      console.error('No user found in localStorage');
      throw new Error('User must be logged in to view shops');
    }
    
    const currentUser = JSON.parse(currentUserStr);
    console.log('Parsed current user:', currentUser);
    
    if (!currentUser.id) {
      console.error('User has no ID');
      throw new Error('User must be logged in to view shops');
    }
    
    // Get all shops
    const allShops = getMockShops();
    console.log('All shops:', allShops);
    
    // Filter shops for current user
    const userShops = allShops.filter(shop => {
      console.log(`Comparing shop ownerId: ${shop.ownerId} with user id: ${currentUser.id}`);
      return shop.ownerId === currentUser.id;
    });
    console.log('Filtered user shops:', userShops);
    
    return userShops;
  },

  getAllShops: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let shops = getMockShops();
      
      // If no shops exist, initialize with default shops
      if (!shops || shops.length === 0) {
        shops = [
          {
            id: '1',
            name: 'Coffee Corner',
            description: 'Best coffee in town with a cozy atmosphere.',
            location: { type: 'Point', coordinates: [0, 0] },
            address: '101 Main St',
            ownerId: '1',
            categories: ['Cafe', 'Coffee', 'Food'],
            openingHours: {
              monday: { open: '07:00', close: '20:00' },
              tuesday: { open: '07:00', close: '20:00' },
              wednesday: { open: '07:00', close: '20:00' },
              thursday: { open: '07:00', close: '20:00' },
              friday: { open: '07:00', close: '22:00' },
              saturday: { open: '08:00', close: '22:00' },
              sunday: { open: '08:00', close: '18:00' }
            }
          },
          {
            id: '2',
            name: 'Book Nook',
            description: 'A cozy place for book lovers with a wide selection of genres.',
            location: { type: 'Point', coordinates: [0, 0] },
            address: '202 Elm St',
            ownerId: '2',
            categories: ['Books', 'Stationery', 'Cafe'],
            openingHours: {
              monday: { open: '09:00', close: '18:00' },
              tuesday: { open: '09:00', close: '18:00' },
              wednesday: { open: '09:00', close: '18:00' },
              thursday: { open: '09:00', close: '18:00' },
              friday: { open: '09:00', close: '20:00' },
              saturday: { open: '10:00', close: '20:00' },
              sunday: { open: '10:00', close: '16:00' }
            }
          },
          {
            id: '3',
            name: 'Gadget Galaxy',
            description: 'Latest tech and gadgets with expert advice.',
            location: { type: 'Point', coordinates: [0, 0] },
            address: '303 Oak St',
            ownerId: '3',
            categories: ['Electronics', 'Technology', 'Accessories'],
            openingHours: {
              monday: { open: '10:00', close: '19:00' },
              tuesday: { open: '10:00', close: '19:00' },
              wednesday: { open: '10:00', close: '19:00' },
              thursday: { open: '10:00', close: '19:00' },
              friday: { open: '10:00', close: '21:00' },
              saturday: { open: '10:00', close: '18:00' },
              sunday: { open: '11:00', close: '16:00' }
            }
          }
        ];
        saveMockShops(shops);
      }
      
      return shops;
    } catch (error) {
      console.error('Error loading shops:', error);
      return [];
    }
  },

  createShop: async (shopData: Partial<Shop>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
      throw new Error('User must be logged in to create a shop');
    }
    
    const newShop: Shop = {
      id: Date.now().toString(),
      ownerId: currentUser.id,
      name: shopData.name || 'New Shop',
      description: shopData.description || 'Shop description',
      location: { type: 'Point', coordinates: [0, 0] },
      address: shopData.address || '123 Shop Street',
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
    const shops = getMockShops();
    shops.push(newShop);
    saveMockShops(shops);
    return newShop;
  },

  updateShop: async (id: string, shopData: Partial<Shop>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const shops = getMockShops();
    const updatedShops = shops.map((shop: Shop) => 
      shop.id === id ? { ...shop, ...shopData } : shop
    );
    saveMockShops(updatedShops);
    const updatedShop = updatedShops.find((s: Shop) => s.id === id);
    if (!updatedShop) throw new Error('Shop not found');
    return updatedShop;
  },

  deleteShop: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const shops = getMockShops();
    const filteredShops = shops.filter((shop: Shop) => (shop.id !== id && shop._id !== id));
    saveMockShops(filteredShops);
    console.log(`Deleted shop ${id}. Remaining shops:`, filteredShops.length);
    return { success: true };
  }
};
