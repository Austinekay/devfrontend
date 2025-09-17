import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box } from '@mui/material';

// Simulated shop data
const shop = {
  name: 'Sample Shop',
  description: 'This is a sample shop description.',
  address: '123 Main St, Cityville',
  hours: '9am - 6pm',
};

const ShopDetail: React.FC = () => {
  const { id } = useParams();
  // TODO: Fetch shop details from API based on id
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>{shop.name}</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>{shop.description}</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Address:</Typography>
          <Typography variant="body2">{shop.address}</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Hours:</Typography>
          <Typography variant="body2">{shop.hours}</Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" color="text.secondary">Shop ID: {id}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShopDetail;
