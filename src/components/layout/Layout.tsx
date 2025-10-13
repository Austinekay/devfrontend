import React from 'react';
import { Box, useTheme } from '@mui/material';
import ModernNavbar from './ModernNavbar';
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
      backgroundAttachment: { xs: 'scroll', md: 'fixed' },
    }}>
      <ModernNavbar />
      <Box component="main" sx={{
        flexGrow: 1,
        pt: { xs: 8, sm: 9, md: 10 },
        pb: { xs: 2, md: 3 },
        px: { xs: 0, sm: 1, md: 2 },
        background: theme.palette.mode === 'light'
          ? 'rgba(255,255,255,0.9)'
          : 'rgba(30,30,30,0.9)',
        borderRadius: { xs: 0, sm: 2, md: 3 },
        mx: { xs: 0, sm: 1, md: 4 },
        boxShadow: theme.palette.mode === 'light'
          ? '0 4px 6px rgba(0,0,0,0.05)'
          : '0 4px 6px rgba(0,0,0,0.2)',
        minHeight: { xs: 'calc(100vh - 64px)', sm: 'calc(100vh - 72px)', md: 'calc(100vh - 80px)' },
      }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
