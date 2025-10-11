import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import { LocationOn, AutoAwesome } from '@mui/icons-material';
import ShopRecommendations from '../shops/ShopRecommendations';
import NearbyShops from '../shops/NearbyShops';

const AIRecommendationsPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLoadingLocation(false);
      },
      (error) => {
        setLocationError('Unable to get your location. Please enable location services.');
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  useEffect(() => {
    // Auto-get location on component mount
    getUserLocation();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 10 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <AutoAwesome sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              AI Shop Recommendations
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Get personalized shop recommendations powered by AI based on your location and preferences
          </Typography>
        </Box>

        {/* Location Status */}
        <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
          {!userLocation && !locationError && (
            <Box>
              <LocationOn sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Getting your location...
              </Typography>
              <Button
                variant="contained"
                onClick={getUserLocation}
                disabled={loadingLocation}
                startIcon={<LocationOn />}
              >
                {loadingLocation ? 'Getting Location...' : 'Enable Location'}
              </Button>
            </Box>
          )}

          {locationError && (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {locationError}
              </Alert>
              <Button
                variant="contained"
                onClick={getUserLocation}
                disabled={loadingLocation}
                startIcon={<LocationOn />}
              >
                Try Again
              </Button>
            </Box>
          )}

          {userLocation && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1 }} />
                  Location detected: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </Box>
              </Alert>
            </Box>
          )}
        </Paper>

        {/* AI Recommendations and Nearby Shops */}
        {userLocation && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <ShopRecommendations userLocation={userLocation} />
            <NearbyShops userLocation={userLocation} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AIRecommendationsPage;