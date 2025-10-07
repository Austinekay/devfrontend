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
  IconButton,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { Shop } from '../../types';
import LocationPicker from '../map/LocationPicker';

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
    contact: '',
    category: '',
    categories: [] as string[],
    images: [] as string[],
    coordinates: [0, 0] as [number, number],
    latitude: 0,
    longitude: 0,
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
        contact: (shop as any).contact || '',
        category: '',
        categories: shop.categories || [],
        images: shop.images || [],
        coordinates: shop.location?.coordinates || [0, 0],
        latitude: shop.location?.coordinates?.[1] || 0,
        longitude: shop.location?.coordinates?.[0] || 0,
        openingHours: shop.openingHours || {
          'monday': { open: '09:00', close: '17:00' },
          'tuesday': { open: '09:00', close: '17:00' },
          'wednesday': { open: '09:00', close: '17:00' },
          'thursday': { open: '09:00', close: '17:00' },
          'friday': { open: '09:00', close: '17:00' },
          'saturday': { open: '10:00', close: '16:00' },
          'sunday': { open: '10:00', close: '16:00' },
        },
      });
    } else {
      setFormData({
        name: '',
        description: '',
        address: '',
        contact: '',
        category: '',
        categories: [],
        images: [],
        coordinates: [0, 0],
        latitude: 0,
        longitude: 0,
        openingHours: {
          'monday': { open: '09:00', close: '17:00' },
          'tuesday': { open: '09:00', close: '17:00' },
          'wednesday': { open: '09:00', close: '17:00' },
          'thursday': { open: '09:00', close: '17:00' },
          'friday': { open: '09:00', close: '17:00' },
          'saturday': { open: '10:00', close: '16:00' },
          'sunday': { open: '10:00', close: '16:00' },
        },
      });
    }
  }, [shop, open]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.size > 2 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 2MB.`);
          return;
        }
        
        // Create canvas to compress image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Set max dimensions
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          console.log('Image compressed from', file.size, 'to', compressedDataUrl.length * 0.75, 'bytes');
          
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, compressedDataUrl],
          }));
        };
        
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToDelete),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.address || formData.latitude === 0) {
      return; // Add proper validation feedback later
    }
    const shopData = {
      name: formData.name,
      description: formData.description,
      address: formData.address,
      contact: formData.contact,
      categories: formData.categories.length > 0 ? formData.categories : ['General'],
      images: formData.images,
      location: {
        type: 'Point' as const,
        coordinates: [formData.longitude, formData.latitude] as [number, number]
      },
      openingHours: formData.openingHours
    };
    console.log('ShopFormDialog - submitting shop data:', shopData);
    console.log('ShopFormDialog - images being submitted:', formData.images);
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
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="e.g., +1 234 567 8900"
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Shop Location
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click on the map or drag the pin to set your shop's exact location
              </Typography>
              <LocationPicker
                initialPosition={formData.coordinates}
                onLocationChange={(lat, lng, address) => {
                  setFormData(prev => ({
                    ...prev,
                    coordinates: [lat, lng],
                    latitude: lat,
                    longitude: lng,
                    address: address || prev.address
                  }));
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label="Latitude"
                  value={formData.latitude.toFixed(6)}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
                <TextField
                  label="Longitude"
                  value={formData.longitude.toFixed(6)}
                  InputProps={{ readOnly: true }}
                  size="small"
                />
              </Box>
            </Box>

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
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Shop Images
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Maximum file size: 5MB per image
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {formData.images.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={image}
                      alt={`Shop ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteImage(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Working Hours
              </Typography>
              {Object.entries(formData.openingHours).map(([day, hours]) => (
                <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography sx={{ minWidth: 100, textTransform: 'capitalize' }}>
                    {day}
                  </Typography>
                  <TextField
                    type="time"
                    label="Open"
                    value={hours.open}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        openingHours: {
                          ...prev.openingHours,
                          [day]: { ...prev.openingHours[day], open: e.target.value }
                        }
                      }));
                    }}
                    size="small"
                  />
                  <TextField
                    type="time"
                    label="Close"
                    value={hours.close}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        openingHours: {
                          ...prev.openingHours,
                          [day]: { ...prev.openingHours[day], close: e.target.value }
                        }
                      }));
                    }}
                    size="small"
                  />
                </Box>
              ))}
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
