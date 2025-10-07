import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, Chip, Alert } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AIAssistant from '../ai/AIAssistant';
import LocationMap from '../geospatial/LocationMap';
import NearbyShops from '../shops/NearbyShops';

const Feature = ({ icon, title, description, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 3, 
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: 8,
        '& svg': {
          transform: 'scale(1.1)',
          color: 'primary.main',
        }
      }
    }}
    onClick={onClick}
  >
    <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
      <Box sx={{ 
        transition: 'transform 0.3s ease-in-out',
        mb: 2
      }}>
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        component="h3" 
        sx={{ 
          my: 2,
          fontWeight: 'bold',
        }}
      >
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Paper>
);

const Home = () => {
  const navigate = useNavigate();
  const { state: { user } } = useAuth();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const categories = ['Coffee', 'Restaurant', 'Grocery', 'Pharmacy', 'Electronics', 'Clothing', 'Books'];

  useEffect(() => {
    console.log('userLocation changed:', userLocation);
  }, [userLocation]);

  const handleUseMyLocation = () => {
    console.log('handleUseMyLocation called');
    setLocationStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          console.log('Location detected:', coords);
          setUserLocation(coords);
          setLocationStatus('success');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('error');
        }
      );
    } else {
      console.error('Geolocation not supported');
      setLocationStatus('error');
    }
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 4, md: 8 },
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 100px)', // Adjust based on your navbar height
    }}>
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            fontWeight: 'bold',
            mb: { xs: 2, md: 3 }
          }}
        >
          Welcome to Shop.Pilot
        </Typography>
        <Typography 
          variant="h5" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{
            fontSize: { xs: '1.1rem', md: '1.5rem' },
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Discover local shops and navigate your way to them with AI-powered assistance
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)' 
        },
        gap: { xs: 2, sm: 3, md: 4 },
        mt: { xs: 3, md: 6 },
        px: { xs: 2, md: 0 }
      }}>
        <Feature
          icon={<StorefrontIcon sx={{ fontSize: { xs: 40, md: 56 } }} color="primary" />}
          title="Discover Shops"
          description="Find local shops and businesses around you with our easy-to-use search features"
        />
        <Feature
          icon={<LocationOnIcon sx={{ fontSize: { xs: 40, md: 56 } }} color="primary" />}
          title="Smart Navigation"
          description="Get precise directions and real-time navigation to your chosen destination"
        />
        <Feature
          icon={<SmartToyIcon sx={{ fontSize: { xs: 40, md: 56 } }} color="primary" />}
          title="AI Assistant"
          description="Get personalized recommendations and assistance powered by AI"
        />
      </Box>

      {/* Location and Category Selection */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Find Shops Near You
        </Typography>
        
        <Button
          variant={userLocation ? 'outlined' : 'contained'}
          startIcon={<MyLocationIcon />}
          onClick={handleUseMyLocation}
          disabled={locationStatus === 'loading'}
          sx={{ mb: 3, mr: 2 }}
        >
          {locationStatus === 'loading' ? 'Getting Location...' : 
           locationStatus === 'success' ? 'Location Found' : 'Use My Location'}
        </Button>
        
        {locationStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Unable to get your location. Please enable location services.
          </Alert>
        )}
        
        {userLocation && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Select a category:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory(null)}
                color={selectedCategory === null ? 'primary' : 'default'}
                variant={selectedCategory === null ? 'filled' : 'outlined'}
              />
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {userLocation ? (
          <NearbyShops userLocation={userLocation} selectedCategory={selectedCategory} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Location not detected yet
          </Typography>
        )}
      </Box>

      {/* AI Assistant Integration */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Try Our AI Assistant
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <AIAssistant />
          <LocationMap />
        </Box>
      </Box>

      <Box sx={{ 
        mt: 6,
        pt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => navigate('/register')}
          sx={{
            maxWidth: '400px',
            height: '56px',
            fontSize: '1.2rem',
            fontWeight: 500,
            borderRadius: '28px',
            boxShadow: 4,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6,
            }
          }}
        >
          Get Started
        </Button>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 1 }}
        >
          Already have an account?{' '}
          <Button
            color="primary"
            onClick={() => navigate('/login')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              }
            }}
          >
            Sign In
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
