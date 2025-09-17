import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ShopManagement from './shop-management';
import AdminStats from './AdminStats';
import NotificationIcon from './NotificationIcon';

const AdminDashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            sx={{
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '60%',
                height: '3px',
                backgroundColor: 'primary.main',
                transition: 'width 0.3s ease-in-out',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            Admin Dashboard
          </Typography>
          <NotificationIcon />
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            mt: 4
          }}
        >
          <Box 
            sx={{
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              }
            }}
          >
            <AdminStats />
          </Box>
          <Box 
            sx={{
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              }
            }}
          >
            <ShopManagement />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
