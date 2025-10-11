import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

const SimpleAI = () => {
  return (
    <Paper sx={{ height: 200, display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SmartToy color="primary" />
        <Typography variant="h6">Simple AI Test</Typography>
      </Box>
      <Typography variant="body1">
        This is a simple AI component test. If you can see this, the component is rendering correctly.
      </Typography>
    </Paper>
  );
};

export default SimpleAI;