import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Chip, IconButton, Slider } from '@mui/material';
import { LocationOn, MyLocation } from '@mui/icons-material';

interface Shop {
  id: string;
  name: string;
  category: string;
  coordinates: [number, number];
  distance: number;
  rating: number;
}

const LocationMap = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(5);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
          findNearbyShops(coords, radius);
        },
        () => {
          const defaultCoords: [number, number] = [40.7128, -74.0060];
          setUserLocation(defaultCoords);
          findNearbyShops(defaultCoords, radius);
        }
      );
    }
  };

  const findNearbyShops = (location: [number, number], searchRadius: number) => {
    const mockShops: Shop[] = [
      {
        id: '1',
        name: 'Central Coffee',
        category: 'Coffee Shop',
        coordinates: [location[0] + 0.001, location[1] + 0.001],
        distance: 0.2,
        rating: 4.5
      },
      {
        id: '2',
        name: 'Tech Store Plus',
        category: 'Electronics',
        coordinates: [location[0] - 0.002, location[1] + 0.003],
        distance: 0.4,
        rating: 4.2
      }
    ];

    setNearbyShops(mockShops.filter(shop => shop.distance <= searchRadius));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Nearby Shops</Typography>
        <IconButton onClick={getCurrentLocation} color="primary">
          <MyLocation />
        </IconButton>
      </Box>

      {userLocation && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Search Radius: {radius} km
          </Typography>
          <Slider
            value={radius}
            onChange={(_, newValue) => setRadius(newValue as number)}
            min={1}
            max={20}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      )}

      <Box sx={{ 
        height: 300, 
        bgcolor: 'grey.100', 
        borderRadius: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 3,
        position: 'relative'
      }}>
        <Typography color="text.secondary">Interactive Map View</Typography>
        {userLocation && (
          <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
            <Chip
              icon={<LocationOn />}
              label={`${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}`}
              size="small"
              color="primary"
            />
          </Box>
        )}
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Found {nearbyShops.length} shops within {radius}km
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {nearbyShops.map((shop) => (
          <Paper key={shop.id} sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2">{shop.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {shop.category} • {shop.distance}km away • {shop.rating}⭐
                </Typography>
              </Box>
              <Chip label="Navigate" size="small" color="primary" />
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
};

export default LocationMap;