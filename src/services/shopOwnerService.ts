import api from './api';

export const shopOwnerService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/v1/shop-owner/dashboard/stats');
    return response.data;
  },



  getShopAnalytics: async (shopId: string, period: string = '7') => {
    const response = await api.get(`/api/v1/shop-owner/shops/${shopId}/analytics?period=${period}`);
    return response.data;
  },

  getMyShops: async () => {
    const response = await api.get('/api/v1/shop-owner/my-shops');
    return response.data;
  },

  updateMyShop: async (shopId: string, shopData: any) => {
    const response = await api.put(`/api/v1/shop-owner/shops/${shopId}`, shopData);
    return response.data;
  },

  deleteMyShop: async (shopId: string) => {
    const response = await api.delete(`/api/v1/shop-owner/shops/${shopId}`);
    return response.data;
  },
};