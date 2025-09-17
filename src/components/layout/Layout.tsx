import React from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: theme.palette.mode === 'light' 
        ? 'linear-gradient(135deg, #fff3e6 0%, #ffe4cc 100%)'
        : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      backgroundAttachment: 'fixed',
    }}>
      <Navbar />
      <Box component="main" sx={{
        flexGrow: 1,
        py: 3,
        background: theme.palette.mode === 'light'
          ? 'rgba(255,255,255,0.9)'
          : 'rgba(30,30,30,0.9)',
        borderRadius: 3,
        mx: { xs: 0, md: 4 },
        boxShadow: theme.palette.mode === 'light'
          ? '0 4px 6px rgba(0,0,0,0.05)'
          : '0 4px 6px rgba(0,0,0,0.2)',
      }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
