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
import { Edit, Delete, Add, CheckCircle } from '@mui/icons-material';
import { adminService } from '../../services/api';
import { Shop } from '../../types';

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

  const handleApprove = async (shopId: string) => {
    if (window.confirm('Are you sure you want to approve this shop?')) {
      try {
        console.log('Approving shop:', shopId);
        const result = await adminService.approveShop(shopId);
        console.log('Approve result:', result);
        setShops(prevShops => prevShops.map(shop => 
          (shop._id || shop.id) === shopId ? { ...shop, approved: true } : shop
        ));
        alert('Shop approved successfully!');
      } catch (error) {
        console.error('Error approving shop:', error);
        alert('Failed to approve shop. Please try again.');
      }
    }
  };

  const handleDelete = async (shopId: string) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        await adminService.deleteShop(shopId);
        setShops(prevShops => prevShops.filter(shop => (shop._id || shop.id) !== shopId));
      } catch (error) {
        console.error('Error deleting shop:', error);
      }
    }
  };

  const handleAddNew = () => {
    setSelectedShop(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const shopData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        address: formData.get('address') as string,
        categories: (formData.get('categories') as string).split(',').map(c => c.trim()),
        ownerId: formData.get('ownerId') as string
      };

      if (selectedShop) {
        await adminService.updateShop(selectedShop._id || selectedShop.id!, shopData);
      } else {
        await adminService.createShop(shopData);
      }
      
      setIsDialogOpen(false);
      await loadShops();
    } catch (error) {
      console.error('Error saving shop:', error);
    }
  };



  return (
    <Paper sx={{ p: 2 }}>
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
              <TableCell>Owner</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop._id || shop.id}>
                <TableCell>{shop.name}</TableCell>
                <TableCell>{shop.address}</TableCell>
                <TableCell>{shop.owner?.name || 'Unknown'}</TableCell>
                <TableCell>{shop.categories?.join(', ')}</TableCell>
                <TableCell>{(shop as any).approved ? 'Approved' : 'Pending'}</TableCell>
                <TableCell>
                  {!(shop as any).approved && (
                    <IconButton onClick={() => handleApprove(shop._id || shop.id!)} color="success">
                      <CheckCircle />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleEdit(shop)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(shop._id || shop.id!)} color="error">
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
                name="name"
                label="Shop Name"
                defaultValue={selectedShop?.name}
                required
                fullWidth
              />
              <TextField
                name="address"
                label="Address"
                defaultValue={selectedShop?.address}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                defaultValue={selectedShop?.description}
                multiline
                rows={4}
                required
                fullWidth
              />
              <TextField
                name="categories"
                label="Categories"
                defaultValue={selectedShop?.categories?.join(', ')}
                helperText="Separate categories with commas"
                fullWidth
              />
              <TextField
                name="ownerId"
                label="Owner ID"
                defaultValue={selectedShop?.ownerId || (selectedShop?.owner as any)?._id}
                required
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
    </Paper>
  );
};

export default ShopManagement;
