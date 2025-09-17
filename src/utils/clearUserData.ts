import { resetMockData } from './resetMockData';

export const clearUserData = () => {
  // Clear local storage data
  localStorage.removeItem('mockUsers');
  localStorage.removeItem('mockShops');
  localStorage.removeItem('user');
  
  // Reset to default data
  resetMockData();
};
