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
  IconButton,
  Paper,
  Avatar,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
  Restaurant as RestaurantIcon,
  LocalMall as ShoppingIcon,
  LocalHospital as HealthIcon,
  Build as ServicesIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { shopService } from '../../services/api';

const categories = [
  { name: 'Food', icon: <RestaurantIcon />, color: '#F97316' },
  { name: 'Fashion', icon: <ShoppingIcon />, color: '#8B5CF6' },
  { name: 'Electronics', icon: <ShoppingIcon />, color: '#06B6D4' },
  { name: 'Health', icon: <HealthIcon />, color: '#10B981' },
  { name: 'Services', icon: <ServicesIcon />, color: '#F59E0B' },
];

const ModernHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredShops, setFeaturedShops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeaturedShops();
  }, []);

  const loadFeaturedShops = async () => {
    try {
      setLoading(true);
      const shops = await shopService.getShops();
      setFeaturedShops(shops.slice(0, 6));
    } catch (error) {
      console.error('Error loading featured shops:', error);
    } finally {
      setLoading(false);
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
        () => {
          navigate('/shops');
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
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #1D4ED8 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #FFFFFF 30%, #E0E7FF 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Discover Amazing Shops Near You
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Find the best local businesses, restaurants, and services in your area
            </Typography>

            {/* Search Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 1,
                borderRadius: 6,
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <TextField
                fullWidth
                placeholder="Find shops near you..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ borderRadius: 4, minWidth: 100 }}
                      >
                        Search
                      </Button>
                    </InputAdornment>
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
                sx={{
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' },
                  borderRadius: 4,
                  px: 4,
                }}
              >
                Use My Location
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/shops')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  borderRadius: 4,
                  px: 4,
                }}
              >
                Browse Categories
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 2, color: 'text.primary' }}>
            Explore Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Discover local businesses across different categories
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 3, justifyItems: 'center' }}>
          {categories.map((category) => (
            <Card
              key={category.name}
              sx={{
                cursor: 'pointer',
                textAlign: 'center',
                p: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                },
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <Avatar
                sx={{
                  bgcolor: category.color,
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {category.icon}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {category.name}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Featured Shops Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <TrendingIcon sx={{ color: 'secondary.main', mr: 2 }} />
            <Typography variant="h2" sx={{ color: 'text.primary' }}>
              Featured Shops
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {featuredShops.map((shop: any) => (
              <Card
                key={shop._id || shop.id}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
                onClick={() => navigate(`/shops/${shop._id || shop.id}`)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    background: `linear-gradient(45deg, ${categories[0]?.color || '#2563EB'} 30%, ${categories[1]?.color || '#F97316'} 90%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {shop.name?.charAt(0) || 'S'}
                  </Typography>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {shop.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {shop.description?.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {shop.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {shop.categories?.slice(0, 2).map((category: string) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        sx={{ bgcolor: 'primary.light', color: 'white' }}
                      />
                    ))}
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

export default ModernHome;