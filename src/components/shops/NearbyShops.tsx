import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Card, CardContent, CardMedia, Chip, IconButton, CircularProgress } from '@mui/material';
import { LocationOn, Star, Navigation, Store } from '@mui/icons-material';
import { shopService } from '../../services/api';

interface Shop {
  _id: string;
  name: string;
  description: string;
  address: string;
  categories: string[];
  images?: string[];
  imageUrl?: string;
  location: {
    coordinates: [number, number];
  };
  distance?: number;
}

interface NearbyShopsProps {
  userLocation?: [number, number];
  selectedCategory?: string | null;
}

const NearbyShops = ({ userLocation, selectedCategory }: NearbyShopsProps) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops(userLocation, selectedCategory);
    }
  }, [userLocation, selectedCategory]);



  const fetchNearbyShops = async (location: [number, number], category?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      const [lat, lng] = location;
      const radius = 5000; // 5km radius
      
      console.log('Searching for shops near:', { lat, lng, radius, category });
      const nearbyShops = await shopService.getNearbyShops(lat, lng, radius);
      console.log('=== HOME PAGE API RESPONSE ===');
      console.log('API Response - nearbyShops:', nearbyShops);
      console.log('Number of shops returned:', nearbyShops?.length || 0);
      nearbyShops.forEach((shop: Shop, index: number) => {
        console.log(`Shop ${index + 1}: ${shop.name}`);
        console.log('  imageUrl:', shop.imageUrl);
        console.log('  images:', shop.images);
        console.log('  All keys:', Object.keys(shop));
      });
      console.log('=== END HOME PAGE API RESPONSE ===');
      
      // Filter by category if selected
      let filteredShops = nearbyShops;
      if (category) {
        filteredShops = nearbyShops.filter((shop: Shop) => 
          shop.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
        );
      }
      
      // Calculate distances and sort by proximity
      const shopsWithDistance = filteredShops.map((shop: Shop) => ({
        ...shop,
        distance: calculateDistance(
          lat, lng,
          shop.location.coordinates[1], shop.location.coordinates[0]
        )
      })).sort((a: Shop, b: Shop) => (a.distance || 0) - (b.distance || 0));

      console.log('Final shops with distance:', shopsWithDistance);
      setShops(shopsWithDistance);
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      setError('Failed to load nearby shops.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleNavigate = (shop: Shop) => {
    const [lng, lat] = shop.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  if (!userLocation) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Click "Use My Location" to find nearby shops
        </Typography>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Finding shops near you...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocationOn color="primary" sx={{ mr: 1 }} />
        <Box>
          <Typography variant="h6">
            Nearby Shops ({shops.length} found)
          </Typography>
          {userLocation && (
            <Typography variant="caption" color="text.secondary">
              Your location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
            </Typography>
          )}
        </Box>
      </Box>

      {shops.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Store sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No shops found nearby
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try expanding your search radius or check back later
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {shops.map((shop) => (
            <Card key={shop._id} sx={{ display: 'flex', alignItems: 'center' }}>
              <CardMedia
                component="div"
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {shop.imageUrl ? (
                  <img
                    src={shop.imageUrl}
                    alt={shop.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully:', shop.imageUrl);
                    }}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', shop.imageUrl);
                      console.error('Error event:', e);
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg class="MuiSvgIcon-root MuiSvgIcon-colorAction" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM20 18H4V8h16v10z"></path></svg>';
                      }
                    }}
                  />
                ) : (
                  <Store color="action" />
                )}
              </CardMedia>
              
              <CardContent sx={{ flex: 1, py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      {shop.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {shop.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {shop.distance?.toFixed(1)}km away
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {shop.categories.slice(0, 2).map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <IconButton
                    onClick={() => handleNavigate(shop)}
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    <Navigation />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default NearbyShops;