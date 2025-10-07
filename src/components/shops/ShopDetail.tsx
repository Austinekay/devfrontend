import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, Chip, Card, CardMedia, Button, IconButton } from '@mui/material';
import { Phone, LocationOn, Schedule, Directions, Navigation } from '@mui/icons-material';
import { shopService } from '../../services/api';
import { Shop } from '../../types';

const ShopDetail: React.FC = () => {
  const { id } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadShop(id);
    }
  }, [id]);

  const loadShop = async (shopId: string) => {
    try {
      console.log('ShopDetail - fetching shop with ID:', shopId);
      const data = await shopService.getShopById(shopId);
      console.log('ShopDetail - received shop data:', data);
      console.log('ShopDetail - shop images:', data?.images);
      setShop(data);
    } catch (error) {
      console.error('Error loading shop:', error);
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Loading shop details...</Typography>
      </Container>
    );
  }
  
  if (!shop) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Shop not found</Typography>
        <Typography>The shop you're looking for doesn't exist or has been removed.</Typography>
      </Container>
    );
  }

  const handleGetDirections = () => {
    if (shop?.location?.coordinates) {
      const [lng, lat] = shop.location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const handleStartNavigation = () => {
    if (navigator.geolocation && shop?.location?.coordinates) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const [lng, lat] = shop.location.coordinates;
          const url = `https://www.google.com/maps/dir/${position.coords.latitude},${position.coords.longitude}/${lat},${lng}`;
          window.open(url, '_blank');
        },
        (error) => {
          console.log('Location access denied or failed:', error);
          handleGetDirections();
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      handleGetDirections();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', paddingTop: '100px' }}>
      {/* Shop Image Section */}
      <Box sx={{ height: '50vh', position: 'relative', bgcolor: 'grey.200' }}>
        {shop.images && shop.images.length > 0 ? (
          <CardMedia
            component="img"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            image={shop.images[0]}
            alt={shop.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <Box
          sx={{
            height: '100%',
            background: 'linear-gradient(45deg, #2563EB 30%, #F97316 90%)',
            display: shop.images && shop.images.length > 0 ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h1" sx={{ color: 'white', fontWeight: 700 }}>
            {shop.name?.charAt(0) || 'S'}
          </Typography>
        </Box>
        
        {/* Floating Action Buttons */}
        <Box sx={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Directions />}
            onClick={handleGetDirections}
            sx={{ bgcolor: 'primary.main' }}
          >
            Directions
          </Button>
          <Button
            variant="contained"
            startIcon={<Navigation />}
            onClick={handleStartNavigation}
            sx={{ bgcolor: 'secondary.main' }}
          >
            Navigate
          </Button>
        </Box>
      </Box>

      {/* Shop Details Section */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {shop.images && shop.images.length > 0 ? (
              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={shop.images[0]}
                    alt={shop.name}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      console.log('ShopDetail - image failed to load:', shop.images?.[0]);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Card>
              </Box>
            ) : (
              <Box sx={{ flex: 1, p: 4, border: '1px dashed #ccc', textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>
                  {shop.name?.charAt(0) || 'S'}
                </Typography>
                <Typography color="text.secondary">No image available</Typography>
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>{shop.name}</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>{shop.description}</Typography>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                <Typography variant="body2">{shop.address}</Typography>
              </Box>
              
              {shop.contact && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone color="primary" />
                  <Typography variant="body2">{shop.contact}</Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => window.open(`tel:${shop.contact}`)}
                    sx={{ ml: 1 }}
                  >
                    <Phone fontSize="small" />
                  </IconButton>
                </Box>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Categories:</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {shop.categories?.map((category, index) => (
                    <Chip key={index} label={category} size="small" color="primary" />
                  ))}
                </Box>
              </Box>
              
              {shop.openingHours && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Schedule color="primary" />
                    <Typography variant="subtitle2">Opening Hours:</Typography>
                  </Box>
                  {Object.entries(shop.openingHours).map(([day, hours]) => (
                    <Typography key={day} variant="body2" sx={{ ml: 3 }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}: {hours.open} - {hours.close}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ShopDetail;
