import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  useScrollTrigger,
  Slide,

} from '@mui/material';
import {
  AccountCircle,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';



interface Props {
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const ModernNavbar = () => {
  const navigate = useNavigate();
  const { state: authState, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'shop_owner': return 'warning';
      default: return 'primary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminIcon fontSize="small" />;
      case 'shop_owner': return <StoreIcon fontSize="small" />;
      default: return <DashboardIcon fontSize="small" />;
    }
  };

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <StoreIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shop Pilot
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/shops')}
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              Discover
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/ai-recommendations')}
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              AI Recommendations
            </Button>


            {authState.user ? (
              <>

                <Chip
                  icon={getRoleIcon(authState.user.role)}
                  label={authState.user.role.replace('_', ' ')}
                  color={getRoleColor(authState.user.role) as any}
                  size="small"
                  variant="outlined"
                />
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ color: 'text.primary' }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                    }}
                  >
                    {authState.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <MenuItem onClick={() => { 
                    handleClose(); 
                    navigate(
                      authState.user?.role === 'admin' ? '/admin' :
                      authState.user?.role === 'shop_owner' ? '/dashboard/shop-owner' :
                      '/dashboard'
                    ); 
                  }}>
                    <DashboardIcon sx={{ mr: 2 }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 2 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
        

      </AppBar>
    </HideOnScroll>
  );
};

export default ModernNavbar;