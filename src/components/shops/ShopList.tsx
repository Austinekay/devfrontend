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
  Button
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ShopCard from './ShopCard';
import { shopService } from '../../services/api';
import { Shop } from '../../types';

const ShopList = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  useEffect(() => {
    // Load initial shops and categories
    loadInitialShops();
    loadCategories();
    getUserLocation();
  }, []);

  useEffect(() => {
    // When category is selected, use location-based search
    if (selectedCategory) {
      loadShopsByLocation();
    } else if (selectedCategory === null) {
      loadInitialShops();
    }
  }, [selectedCategory, userLocation]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by browser');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location detected:', position.coords.latitude, position.coords.longitude);
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
        setLocationError(null);
      },
      (error) => {
        console.log('Geolocation error:', error.code, error.message);
        setLocationLoading(false);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location in browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('Unknown location error.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const loadCategories = async () => {
    try {
      const allShops = await shopService.getShops();
      const allCategories = Array.from(new Set(allShops.flatMap((shop: Shop) => shop.categories || [])));
      setCategories(allCategories as string[]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadInitialShops = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get first 10 shops without location filter
      const data = await shopService.getShops();
      setShops(data.slice(0, 10));
    } catch (error) {
      console.error('Error loading shops:', error);
      setError('Failed to load shops.');
    } finally {
      setLoading(false);
    }
  };

  const loadShopsByLocation = async () => {
    if (!selectedCategory) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (userLocation) {
        console.log('Using location search:', userLocation, selectedCategory);
        console.log('Calling searchShopsByLocation with:', {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 5000,
          category: selectedCategory
        });
        // Use geolocation search with 5km radius for selected category
        const data = await shopService.searchShopsByLocation(
          userLocation.lat,
          userLocation.lng,
          5000,
          selectedCategory
        );
        console.log('Received data:', data);
        setShops(data);
      } else {
        console.log('Using category filter without location:', selectedCategory);
        // Fallback: get shops with category filter
        const data = await shopService.getShops(undefined, undefined, undefined, selectedCategory);
        setShops(data);
      }
    } catch (error) {
      console.error('Error loading shops:', error);
      setError('Failed to load shops.');
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleViewDetails = (shop: Shop) => {
    navigate(`/shops/${shop._id || shop.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Shops
        </Typography>
        {selectedCategory && userLocation && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Showing {selectedCategory} shops within 5km of your location
          </Typography>
        )}
        {selectedCategory && !userLocation && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Showing all {selectedCategory} shops (location not available)
          </Typography>
        )}
        {!selectedCategory && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Browse popular shops or select a category to find shops near you
          </Typography>
        )}
        {locationError && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error" variant="body2" sx={{ mb: 1 }}>
              {locationError}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Button size="small" onClick={getUserLocation} disabled={locationLoading}>
                {locationLoading ? 'Getting Location...' : 'Try Again'}
              </Button>
              <Button size="small" onClick={() => setShowLocationInput(!showLocationInput)}>
                Enter Location Manually
              </Button>
            </Box>
          </Box>
        )}
        {!userLocation && !locationError && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography color="text.secondary" variant="body2">
              Enable location for personalized results
            </Typography>
            <Button size="small" onClick={getUserLocation} disabled={locationLoading}>
              {locationLoading ? 'Getting Location...' : 'Enable Location'}
            </Button>
          </Box>
        )}
        {showLocationInput && (
          <Box sx={{ mb: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Enter Your Coordinates:</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                label="Latitude"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="6.5244"
              />
              <TextField
                size="small"
                label="Longitude"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="3.3792"
              />
              <Button 
                onClick={() => {
                  if (manualLat && manualLng) {
                    setUserLocation({ 
                      lat: parseFloat(manualLat), 
                      lng: parseFloat(manualLng) 
                    });
                    setShowLocationInput(false);
                    setLocationError(null);
                  }
                }}
                disabled={!manualLat || !manualLng}
              >
                Set Location
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              You can find your coordinates on Google Maps
            </Typography>
          </Box>
        )}
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
          sx={{ width: 300, mb: 2 }}
        />
      </Box>

      {categories.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {userLocation ? 'Find shops near you:' : 'Browse by category:'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All Categories"
              onClick={() => setSelectedCategory(null)}
              color={!selectedCategory ? 'primary' : 'default'}
              sx={{ '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
            />
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
        </Box>
      )}

      {(loading || locationLoading) ? (
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
            <Box key={shop._id || shop.id}>
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


    </Container>
  );
};

export default ShopList;
