import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { ColorModeContext } from '../../App';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = () => {
  const { state: { user } } = useContext(AuthContext) as AuthContextType;
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  
  // Helper function to determine if the user is a shop owner
  const isShopOwner = user?.role === 'shop_owner';
  const isAdmin = user?.role === 'admin';
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ 
          flexGrow: 1, 
          color: 'inherit', 
          textDecoration: 'none',
          '&:hover': { color: 'inherit' },
          fontFamily: "'Roboto Mono', monospace",
          fontWeight: 600
        }}>
          Shop.pilot
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{ textTransform: 'none' }}
          >
            Home
          </Button>
          {/* Show Shops button for logged in users */}
          {user && (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/shops"
              sx={{ textTransform: 'none' }}
            >
              Shops
            </Button>
          )}
          {!user ? (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/register"
                sx={{ textTransform: 'none' }}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              {/* Show Shop Dashboard only for shop owners */}
              {isShopOwner && (
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/dashboard/shop-owner"
                  sx={{ textTransform: 'none' }}
                >
                  Shop Dashboard
                </Button>
              )}
              {/* Show Admin Dashboard only when admin is logged in and not on home page */}
              {isAdmin && location.pathname !== '/' && (
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/admin"
                  sx={{ textTransform: 'none' }}
                >
                  Admin Dashboard
                </Button>
              )}
            </>
          )}
          <IconButton
            sx={{ ml: 2 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
            aria-label="toggle theme"
          >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
