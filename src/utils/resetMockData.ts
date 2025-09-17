// Reset mock data to default values
export const resetMockData = () => {
  // Default admin user
  const defaultUsers = [
    {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@123',
      role: 'admin',
      password: 'admin123'
    }
  ];

  // Default shops
  const defaultShops = [
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

  // Reset to default data
  localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
  localStorage.setItem('mockShops', JSON.stringify(defaultShops));
  localStorage.removeItem('user'); // Clear current user session
};
