import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { adminService } from '../../../services/api';
import { Shop } from '../../../types';

const ShopManagement = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getShops();
      setShops(data);
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    setIsDialogOpen(true);
  };

  const handleDelete = async (shopId: string) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        await adminService.deleteShop(shopId);
        // Update local state immediately and reload to ensure consistency
        setShops(prevShops => prevShops.filter(shop => (shop._id || shop.id) !== shopId));
        await loadShops();
      } catch (error) {
        console.error('Error deleting shop:', error);
        // Reload shops even if there was an error to ensure consistency
        await loadShops();
      }
    }
  };

  const handleAddNew = () => {
    setSelectedShop(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would call an API to save the shop
    setIsDialogOpen(false);
    await loadShops();
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Shop Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddNew}
        >
          Add New Shop
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop._id || shop.id}>
                <TableCell>{shop.name}</TableCell>
                <TableCell>{shop.address}</TableCell>
                <TableCell>{shop.categories?.join(', ')}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(shop)} size="small" color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(shop._id || shop.id!)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle>
            {selectedShop ? 'Edit Shop' : 'Add New Shop'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Shop Name"
                defaultValue={selectedShop?.name}
                required
                fullWidth
              />
              <TextField
                label="Address"
                defaultValue={selectedShop?.address}
                required
                fullWidth
              />
              <TextField
                label="Description"
                defaultValue={selectedShop?.description}
                multiline
                rows={4}
                required
                fullWidth
              />
              <TextField
                label="Categories"
                defaultValue={selectedShop?.categories?.join(', ')}
                helperText="Separate categories with commas"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ShopManagement;
