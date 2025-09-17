import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Chip,
  Typography,
  Stack,
} from '@mui/material';
import { Shop } from '../../types';

interface ShopFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (shopData: Partial<Shop>) => void;
  shop?: Shop;
}

const ShopFormDialog = ({ open, onClose, onSubmit, shop }: ShopFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: '',
    categories: [] as string[],
    openingHours: {
      'monday': { open: '09:00', close: '17:00' },
      'tuesday': { open: '09:00', close: '17:00' },
      'wednesday': { open: '09:00', close: '17:00' },
      'thursday': { open: '09:00', close: '17:00' },
      'friday': { open: '09:00', close: '17:00' },
      'saturday': { open: '10:00', close: '16:00' },
      'sunday': { open: '10:00', close: '16:00' },
    } as Shop['openingHours'],
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name,
        description: shop.description,
        address: shop.address,
        category: '',
        categories: shop.categories,
        openingHours: shop.openingHours,
      });
    }
  }, [shop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = () => {
    if (formData.category.trim() && !formData.categories.includes(formData.category.trim())) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, prev.category.trim()],
        category: '',
      }));
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((category) => category !== categoryToDelete),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.address) {
      return; // Add proper validation feedback later
    }
    const shopData = {
      ...formData,
      categories: formData.categories.length > 0 ? formData.categories : ['General'],
    };
    delete (shopData as any).category;
    onSubmit(shopData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{shop ? 'Edit Shop' : 'Add New Shop'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Shop Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onDelete={() => handleDeleteCategory(category)}
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Add Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
                <Button variant="contained" onClick={handleAddCategory}>
                  Add
                </Button>
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {shop ? 'Save Changes' : 'Add Shop'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShopFormDialog;
