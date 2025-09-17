import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  CircularProgress,
  Alert,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Search } from '@mui/icons-material';
import ShopCard from './ShopCard';
import { mockShopService } from '../../services/mockApi';
import { Shop } from '../../types';

const ShopList = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockShopService.getAllShops();
      setShops(data);
      
      // Extract unique categories
      const allCategories = Array.from(new Set(data.flatMap(shop => shop.categories || [])));
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading shops:', error);
      setError('Failed to load shops. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || shop.categories?.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (shop: Shop) => {
    setSelectedShop(shop);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Discover Shops
        </Typography>
        <TextField
          placeholder="Search shops..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {categories.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
            />
          ))}
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : filteredShops.length > 0 ? (
        <Box sx={{ 
          display: 'grid', 
          gap: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        }}>
          {filteredShops.map((shop) => (
            <Box key={shop.id}>
              <ShopCard 
                shop={shop} 
                onViewDetails={handleViewDetails}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No shops found matching your criteria.
          </Typography>
        </Box>
      )}

      <Dialog 
        open={!!selectedShop} 
        onClose={() => setSelectedShop(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedShop && (
          <>
            <DialogTitle>{selectedShop.name}</DialogTitle>
            <DialogContent>
              <Typography paragraph>{selectedShop.description}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Address:</Typography>
              <Typography paragraph>{selectedShop.address}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Categories:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {selectedShop.categories?.map(category => (
                  <Chip key={category} label={category} size="small" />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedShop(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ShopList;
