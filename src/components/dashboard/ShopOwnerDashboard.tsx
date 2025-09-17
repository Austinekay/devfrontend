import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ShopTable from './ShopTable';
import ShopFormDialog from './ShopFormDialog';
import { mockShopService as shopService } from '../../services/mockApi';
import { Shop } from '../../types';

const ShopOwnerDashboard = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authState.user || authState.user.role !== 'shop_owner') {
      navigate('/login');
      return;
    }
    loadShops();
  }, [authState.user, navigate]);

  const loadShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shopService.getShops();
      setShops(data);
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
        await shopService.deleteShop(shopId);
        await loadShops();
      } catch (error) {
        console.error('Error deleting shop:', error);
      }
    }
  };

  const handleSubmitShop = async (shopData: Partial<Shop>) => {
    try {
      setError(null);
      if (selectedShop) {
        await shopService.updateShop(selectedShop.id, shopData);
      } else {
        await shopService.createShop(shopData);
      }
      setIsFormOpen(false);
      await loadShops();
    } catch (error) {
      console.error('Error saving shop:', error);
      setError(error instanceof Error ? error.message : 'Failed to save shop. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Shops
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddShop}>
          Add New Shop
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ my: 2 }}>
          <Alert severity="error">{error}</Alert>
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
        />
      )}

      <ShopFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitShop}
        shop={selectedShop}
      />
    </Container>
  );
};

export default ShopOwnerDashboard;
