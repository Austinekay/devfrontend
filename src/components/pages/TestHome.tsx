import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SimpleAI from '../ai/SimpleAI';

const TestHome = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Test Home Page
      </Typography>
      
      <Box sx={{ mt: 4, mb: 6, bgcolor: 'primary.main', py: 6, borderRadius: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
            🤖 AI Shopping Assistant
          </Typography>
          <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
            <SimpleAI />
          </Box>
        </Container>
      </Box>
    </Container>
  );
};

export default TestHome;