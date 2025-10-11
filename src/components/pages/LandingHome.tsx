import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  LocalMall as ShoppingIcon,
  LocalHospital as HealthIcon,
  Build as ServicesIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Directions as DirectionsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { shopService } from '../../services/api';

const categories = [
  { name: 'Food', icon: <RestaurantIcon />, color: '#F97316' },
  { name: 'Fashion', icon: <ShoppingIcon />, color: '#8B5CF6' },
  { name: 'Electronics', icon: <ShoppingIcon />, color: '#06B6D4' },
  { name: 'Health', icon: <HealthIcon />, color: '#10B981' },
  { name: 'Services', icon: <ServicesIcon />, color: '#F59E0B' },
  { name: 'Beauty', icon: <ServicesIcon />, color: '#E91E63' },
  { name: 'Automotive', icon: <ServicesIcon />, color: '#FF5722' },
];

const LandingHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredShops, setFeaturedShops] = useState([]);

  useEffect(() => {
    loadFeaturedShops();
  }, []);

  const loadFeaturedShops = async () => {
    try {
      const shops = await shopService.getShops();
      const approvedShops = shops.filter((shop: any) => shop.approved === true);
      setFeaturedShops(approvedShops.slice(0, 6));
    } catch (error) {
      console.error('Error loading shops:', error);
    }
  };

  const handleSearch = () => {
    navigate(`/shops?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/shops?category=${encodeURIComponent(category)}`);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          navigate(`/shops?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
        },
        (error) => {
          console.log('Location access denied or failed:', error);
          navigate('/shops');
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      navigate('/shops');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
            Find shops near you
          </Typography>
          
          {/* Hero Search Bar */}
          <Paper sx={{ p: 1, borderRadius: 4, mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Find shops near you..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button variant="contained" onClick={handleSearch}>
                    Search
                  </Button>
                ),
                sx: { '& .MuiOutlinedInput-notchedOutline': { border: 'none' } },
              }}
            />
          </Paper>

          {/* CTA Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LocationIcon />}
              onClick={handleUseLocation}
              sx={{ bgcolor: 'secondary.main' }}
            >
              Use My Location
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/shops')}
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Browse Categories
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Category Carousel */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
          Explore Categories
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, 
          gap: 3 
        }}>
          {categories.map((category) => (
            <Card
              key={category.name}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                p: 2,
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                transition: 'all 0.3s ease',
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <Avatar
                sx={{
                  bgcolor: category.color,
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 1,
                }}
              >
                {category.icon}
              </Avatar>
              <Typography variant="h6">{category.name}</Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Featured Shops */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
            Featured Shops
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
            gap: 3 
          }}>
            {featuredShops.map((shop: any) => (
              <Card
                key={shop._id || shop.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate(`/shops/${shop._id || shop.id}`)}
              >
                {shop.images && shop.images.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={shop.images[0]}
                    alt={shop.name}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Box
                  sx={{
                    height: 160,
                    background: 'linear-gradient(45deg, #2563EB 30%, #F97316 90%)',
                    display: shop.images && shop.images.length > 0 ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {shop.name?.charAt(0) || 'S'}
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {shop.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {shop.address}
                  </Typography>
                  {shop.contact && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{shop.contact}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: '#F97316', fontSize: 16 }} />
                      <Typography variant="body2">4.5</Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<DirectionsIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shops/${shop._id || shop.id}`);
                      }}
                      sx={{ minWidth: 'auto' }}
                    >
                      Directions
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingHome;