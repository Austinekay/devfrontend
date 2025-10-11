import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ShopOwnerDashboardHome from './ShopOwnerDashboardHome';
import ShopTable from './ShopTable';
import ShopFormDialog from './ShopFormDialog';
import ShopAnalytics from './ShopAnalytics';
import { shopService, shopOwnerService } from '../../services/api';
import { Shop, ShopWithAnalytics } from '../../types';

const ShopOwnerDashboard = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [shops, setShops] = useState<ShopWithAnalytics[]>([]);
  const [selectedShopForAnalytics, setSelectedShopForAnalytics] = useState<ShopWithAnalytics | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authState.user) {
      navigate('/login');
      return;
    }
    if (authState.user.role !== 'shop_owner') {
      navigate('/');
      return;
    }
    loadShops();
  }, [authState.user, navigate]);

  const loadShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shopOwnerService.getMyShops();
      setShops(data.shops || data);
    } catch (error) {
      console.error('Error loading shops:', error);
      setError('Failed to load your shops. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddShop = () => {
    setSelectedShop(undefined);
    setIsFormOpen(true);
  };

  const handleEditShop = (shop: Shop) => {
    setSelectedShop(shop);
    setIsFormOpen(true);
  };

  const handleDeleteShop = async (shopId: string) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        setError(null);
        await shopService.deleteShop(shopId);
        await loadShops();
      } catch (error) {
        console.error('Error deleting shop:', error);
        setError('Failed to delete shop. Please try again.');
      }
    }
  };

  const handleSubmitShop = async (shopData: Partial<Shop>) => {
    try {
      setError(null);
      console.log('ShopOwnerDashboard - submitting shop data:', shopData);
      
      if (selectedShop) {
        await shopService.updateShop(selectedShop._id || selectedShop.id!, shopData);
      } else {
        const shopWithOwner = {
          ...shopData,
          ownerId: authState.user?.id
        };
        await shopService.createShop(shopWithOwner);
      }
      setIsFormOpen(false);
      setSelectedShop(undefined);
      await loadShops();
    } catch (error) {
      console.error('Error saving shop:', error);
      setError(error instanceof Error ? error.message : 'Failed to save shop. Please try again.');
    }
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Dashboard" />
          <Tab label="My Shops" />
          <Tab label="Analytics" />
          <Tab label="Reviews" />
        </Tabs>
      </Container>

      {tabValue === 0 && <ShopOwnerDashboardHome />}
      
      {tabValue === 1 && (
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4" component="h1">
              My Shops
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAddShop}>
              Add New Shop
            </Button>
          </Box>

          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {loading ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography>Loading your shops...</Typography>
            </Box>
          ) : shops.length === 0 ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6" color="textSecondary">
                You haven't created any shops yet.
              </Typography>
              <Typography color="textSecondary">
                Click the "Add New Shop" button to get started.
              </Typography>
            </Box>
          ) : (
            <ShopTable
              shops={shops}
              onEdit={handleEditShop}
              onDelete={handleDeleteShop}
              onViewAnalytics={(shop) => {
                setSelectedShopForAnalytics(shop);
                setTabValue(2);
              }}
            />
          )}
        </Container>
      )}

      {tabValue === 2 && (
        <Container maxWidth="lg">
          {selectedShopForAnalytics ? (
            <Box>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedShopForAnalytics(null)}
                sx={{ mb: 2 }}
              >
                ← Back to Shop Selection
              </Button>
              <ShopAnalytics 
                shopId={selectedShopForAnalytics._id || selectedShopForAnalytics.id!}
                shopName={selectedShopForAnalytics.name}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" sx={{ mb: 4 }}>
                Shop Analytics
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Select a shop from the table below to view detailed analytics:
              </Typography>
              <ShopTable
                shops={shops}
                onEdit={handleEditShop}
                onDelete={handleDeleteShop}
                onViewAnalytics={(shop) => setSelectedShopForAnalytics(shop)}
              />
            </Box>
          )}
        </Container>
      )}

      {tabValue === 3 && (
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Customer Reviews
          </Typography>
          <Typography color="text.secondary">
            Review management coming soon...
          </Typography>
        </Container>
      )}

      <ShopFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitShop}
        shop={selectedShop}
      />
    </Box>
  );
};

export default ShopOwnerDashboard;
