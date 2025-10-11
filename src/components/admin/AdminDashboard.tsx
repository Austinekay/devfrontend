import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Dashboard, 
  Store, 
  People, 
  Analytics as AnalyticsIcon, 
  Report, 
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  AdminPanelSettings
} from '@mui/icons-material';
import ShopManagement from './ShopManagement';
import UserManagement from './UserManagement';
import AdminStats from './AdminStats';
import ContentModeration from './ContentModeration';
import Analytics from './Analytics';
import PredictiveAnalytics from '../analytics/PredictiveAnalytics';

import Settings from './Settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const drawerWidth = 280;

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <Dashboard /> },
    { id: 'shops', label: 'Shops', icon: <Store /> },
    { id: 'users', label: 'Users', icon: <People /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'reports', label: 'Reports', icon: <Report /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  useEffect(() => {
    if (!authState.user) {
      navigate('/login');
      return;
    }
    if (authState.user.role !== 'admin') {
      if (authState.user.role === 'shop_owner') {
        navigate('/dashboard/shop-owner');
      } else {
        navigate('/dashboard');
      }
      return;
    }
  }, [authState.user, navigate]);

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  if (!authState.user || authState.user.role !== 'admin') {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminStats />;
      case 'shops':
        return <ShopManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <ContentModeration />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminStats />;
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };



  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Avatar sx={{ 
          bgcolor: 'rgba(255,255,255,0.2)', 
          color: 'white',
          width: 48,
          height: 48
        }}>
          <AdminPanelSettings />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            Admin Panel
          </Typography>
          <Chip 
            label="Administrator" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontSize: '0.75rem'
            }} 
          />
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 2, py: 3 }}>
        {sidebarItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              cursor: 'pointer',
              borderRadius: 2,
              mb: 1,
              backgroundColor: activeSection === item.id 
                ? 'rgba(255,255,255,0.2)' 
                : 'transparent',
              backdropFilter: activeSection === item.id ? 'blur(10px)' : 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateX(8px)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: 'white',
              minWidth: 40,
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem'
              }
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                '& .MuiTypography-root': {
                  color: 'white',
                  fontWeight: activeSection === item.id ? 600 : 400
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: { md: `calc(100% - ${drawerWidth}px)` }
      }}>
        {/* Top Bar */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            bgcolor: 'white',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                color: 'text.primary'
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {sidebarItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back, {authState.user?.name || 'Admin'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {authState.user?.name?.charAt(0) || 'A'}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: '#f8fafc',
          minHeight: 'calc(100vh - 80px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '0 0 50px 50px',
            zIndex: 0
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
