import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, onClick }) => (
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

const HomeNew = () => {
  const navigate = useNavigate();
  const { state: { user } } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          mt: { xs: 4, md: 8 }, 
          mb: { xs: 3, md: 6 },
          px: { xs: 2, md: 4 }
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
          Welcome to GeoShops
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

      {/* Features Grid */}
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
          onClick={() => navigate(user ? '/shops' : '/login')}
        />
        <Feature
          icon={<LocationOnIcon sx={{ fontSize: { xs: 40, md: 56 } }} color="primary" />}
          title="Smart Navigation"
          description="Get precise directions and real-time navigation to your chosen destination"
          onClick={() => navigate(user ? '/dashboard' : '/login')}
        />
        <Feature
          icon={<SmartToyIcon sx={{ fontSize: { xs: 40, md: 56 } }} color="primary" />}
          title="AI Assistant"
          description="Get personalized recommendations and assistance powered by AI"
          onClick={() => navigate(user ? '/dashboard' : '/login')}
        />
      </Box>

      {/* Call to Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 6,
        gap: 2,
        flexWrap: 'wrap'
      }}>
        {!user ? (
          <>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Sign In
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Go to Dashboard
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default HomeNew;
