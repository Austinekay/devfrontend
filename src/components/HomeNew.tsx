import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Storefront, LocationOn, SmartToy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, onClick }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        cursor: 'pointer',
      },
    }}
    onClick={onClick}
  >
    <Box
      sx={{
        mb: 2,
        color: 'primary.main',
        '& > svg': {
          fontSize: '3rem',
        },
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" component="h3" gutterBottom align="center">
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" align="center">
      {description}
    </Typography>
  </Paper>
);

const HomeNew: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 6, fontWeight: 'bold' }}
      >
        Welcome to Our Platform
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          gap: 4,
        }}
      >
        <Feature
          icon={<Storefront />}
          title="Discover Shops"
          description="Browse through our curated collection of local and online shops."
          onClick={() => navigate('/shops')}
        />
        <Feature
          icon={<LocationOn />}
          title="Local Deals"
          description="Find the best deals and discounts in your area."
          onClick={() => navigate('/deals')}
        />
        <Feature
          icon={<SmartToy />}
          title="Smart Recommendations"
          description="Get personalized recommendations based on your preferences."
          onClick={() => navigate('/recommendations')}
        />
      </Box>
    </Container>
  );
};

export default HomeNew;
