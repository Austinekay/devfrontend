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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AccountCircle,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Psychology as AIIcon,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
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
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              flexGrow: isMobile ? 1 : 0,
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: { xs: 1, sm: 2 },
              }}
            >
              <StoreIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shop Pilot
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
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
          )}

          {/* Mobile User Avatar */}
          {isMobile && authState.user && (
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
          )}

          {/* Mobile User Menu */}
          {isMobile && authState.user && (
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
          )}
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              bgcolor: 'background.paper',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Shop Pilot
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation('/')}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation('/shops')}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Discover" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleMobileNavigation('/ai-recommendations')}>
                <ListItemIcon>
                  <AIIcon />
                </ListItemIcon>
                <ListItemText primary="AI Recommendations" />
              </ListItemButton>
            </ListItem>
          </List>
          
          {!authState.user && (
            <>
              <Divider />
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleMobileNavigation('/login')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleMobileNavigation('/register')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </>
          )}

          {authState.user && (
            <>
              <Divider />
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'primary.main',
                      mr: 2,
                    }}
                  >
                    {authState.user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {authState.user.name}
                    </Typography>
                    <Chip
                      icon={getRoleIcon(authState.user.role)}
                      label={authState.user.role.replace('_', ' ')}
                      color={getRoleColor(authState.user.role) as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DashboardIcon />}
                  onClick={() => handleMobileNavigation(
                    authState.user?.role === 'admin' ? '/admin' :
                    authState.user?.role === 'shop_owner' ? '/dashboard/shop-owner' :
                    '/dashboard'
                  )}
                  sx={{ mb: 1, textTransform: 'none' }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate('/');
                  }}
                  sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.main' }}
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default ModernNavbar;