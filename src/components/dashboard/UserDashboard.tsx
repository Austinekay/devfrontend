import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { shopService } from '../../services/api';
import { Shop } from '../../types';
import useApiCall from '../../hooks/useApiCall';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loading: isLoadingShops, execute: fetchShops } = useApiCall(shopService.getShops);

  useEffect(() => {
    if (!authState.user) {
      navigate('/login');
      return;
    }
    loadShops();
  }, [authState.user, navigate]);

  const loadShops = async (query: string = '') => {
    try {
      setError(null);
      const searchParams = {
        query,
        ...(location && {
          lat: location.lat,
          lng: location.lng
        })
      };
      
      const data = await shopService.getShops();
      setShops(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shops');
      console.error('Error loading shops:', err);
    }
  };

  const handleSearch = () => {
    loadShops(searchQuery);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
        loadShops(searchQuery); // Reload shops with new location
      },
      (error) => {
        setError(`Location error: ${error.message}`);
        setIsLoadingLocation(false);
        console.error('Error getting location:', error);
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Shops
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shops..."
            disabled={isLoadingShops}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleSearch}
                    disabled={isLoadingShops}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button
            variant="outlined"
            startIcon={isLoadingLocation ? <CircularProgress size={20} /> : <LocationIcon />}
            onClick={handleGetLocation}
            disabled={isLoadingLocation || isLoadingShops}
          >
            Use My Location
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {isLoadingShops ? (
            <Box sx={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : shops.length === 0 ? (
            <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">
                No shops found. Try a different search or location.
              </Typography>
            </Box>
          ) : (
            shops.map((shop) => (
              <Card key={shop.id}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {shop.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {shop.categories.join(', ')}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {shop.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2">{shop.address}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;
