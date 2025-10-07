import React, { useEffect, useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dashboard, Store, People, Analytics as AnalyticsIcon, Report, Settings as SettingsIcon } from '@mui/icons-material';
import ShopManagement from './ShopManagement';
import UserManagement from './UserManagement';
import AdminStats from './AdminStats';
import ContentModeration from './ContentModeration';
import Analytics from './Analytics';
import PredictiveAnalytics from '../analytics/PredictiveAnalytics';
import NotificationIcon from './NotificationIcon';
import Settings from './Settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

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
        return <PredictiveAnalytics />;
      case 'reports':
        return <ContentModeration />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            position: 'relative',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
        </Box>
        <List>
          {sidebarItems.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              sx={{
                cursor: 'pointer',
                backgroundColor: activeSection === item.id ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: activeSection === item.id ? 'primary.light' : 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: activeSection === item.id ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {sidebarItems.find(item => item.id === activeSection)?.label || 'Admin Dashboard'}
            </Typography>
            <NotificationIcon />
          </Toolbar>
        </AppBar>
        
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'grey.50' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
