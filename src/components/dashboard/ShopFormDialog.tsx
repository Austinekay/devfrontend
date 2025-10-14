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
  Switch,
  FormControlLabel,
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
    coordinates: [0, 0] as [number, number],
    latitude: 0,
    longitude: 0,
    openingHours: {
      'monday': { open: '09:00', close: '17:00', isClosed: false },
      'tuesday': { open: '09:00', close: '17:00', isClosed: false },
      'wednesday': { open: '09:00', close: '17:00', isClosed: false },
      'thursday': { open: '09:00', close: '17:00', isClosed: false },
      'friday': { open: '09:00', close: '17:00', isClosed: false },
      'saturday': { open: '10:00', close: '16:00', isClosed: false },
      'sunday': { open: '10:00', close: '16:00', isClosed: false },
    } as Shop['openingHours'],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (shop) {
      console.log('Shop data:', shop);
      console.log('Shop openingHours:', shop.openingHours);
      
      const processedHours = shop.openingHours ? Object.fromEntries(
        Object.entries(shop.openingHours).map(([day, hours]) => {
          console.log(`Processing ${day}:`, hours);
          return [
            day, 
            { 
              open: hours.open || '09:00',
              close: hours.close || '17:00',
              isClosed: hours.isClosed ?? false 
            }
          ];
        })
      ) : {
        'monday': { open: '09:00', close: '17:00', isClosed: false },
        'tuesday': { open: '09:00', close: '17:00', isClosed: false },
        'wednesday': { open: '09:00', close: '17:00', isClosed: false },
        'thursday': { open: '09:00', close: '17:00', isClosed: false },
        'friday': { open: '09:00', close: '17:00', isClosed: false },
        'saturday': { open: '10:00', close: '16:00', isClosed: false },
        'sunday': { open: '10:00', close: '16:00', isClosed: false },
      };
      
      console.log('Processed hours:', processedHours);
      
      setFormData({
        name: shop.name,
        description: shop.description,
        address: shop.address,
        contact: (shop as any).contact || '',
        category: '',
        categories: shop.categories || [],
        coordinates: shop.location?.coordinates || [0, 0],
        latitude: shop.location?.coordinates?.[1] || 0,
        longitude: shop.location?.coordinates?.[0] || 0,
        openingHours: processedHours,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        address: '',
        contact: '',
        category: '',
        categories: [],
        coordinates: [0, 0],
        latitude: 0,
        longitude: 0,
        openingHours: {
          'monday': { open: '09:00', close: '17:00', isClosed: false },
          'tuesday': { open: '09:00', close: '17:00', isClosed: false },
          'wednesday': { open: '09:00', close: '17:00', isClosed: false },
          'thursday': { open: '09:00', close: '17:00', isClosed: false },
          'friday': { open: '09:00', close: '17:00', isClosed: false },
          'saturday': { open: '10:00', close: '16:00', isClosed: false },
          'sunday': { open: '10:00', close: '16:00', isClosed: false },
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
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only .jpg, .jpeg, and .png files are allowed.');
        return;
      }
      
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.address || formData.latitude === 0) {
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('contact', formData.contact);
    formDataToSend.append('categories', JSON.stringify(formData.categories.length > 0 ? formData.categories : ['General']));
    formDataToSend.append('location', JSON.stringify({
      type: 'Point',
      coordinates: [formData.longitude, formData.latitude]
    }));
    formDataToSend.append('openingHours', JSON.stringify(formData.openingHours));
    
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }
    
    // Debug: Log FormData contents
    console.log('FormData being sent:');
    Array.from(formDataToSend.entries()).forEach(([key, value]) => {
      console.log(key, value);
    });
    
    onSubmit(formDataToSend as any);
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
                Shop Image
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Maximum file size: 5MB. Allowed formats: .jpg, .jpeg, .png
              </Typography>
              {imagePreview && (
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Shop preview"
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleDeleteImage}
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
              )}
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Working Hours
              </Typography>
              {Object.entries(formData.openingHours).map(([day, hours]) => (
                <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography sx={{ minWidth: 100, textTransform: 'capitalize', fontWeight: 500 }}>
                    {day}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!(hours.isClosed ?? false)}
                        onChange={(e) => {
                          const isOpen = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            openingHours: {
                              ...prev.openingHours,
                              [day]: { ...prev.openingHours[day], isClosed: !isOpen }
                            }
                          }));
                        }}
                        size="small"
                      />
                    }
                    label={(hours.isClosed ?? false) ? 'Closed' : 'Open'}
                    sx={{ minWidth: 80 }}
                  />
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
                    disabled={hours.isClosed ?? false}
                    sx={{ opacity: (hours.isClosed ?? false) ? 0.5 : 1 }}
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
                    disabled={hours.isClosed ?? false}
                    sx={{ opacity: (hours.isClosed ?? false) ? 0.5 : 1 }}
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
