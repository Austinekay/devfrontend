import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  IconButton,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Visibility as VisibilityIcon,
  TouchApp as ClickIcon,
  Star as StarIcon,
  Notifications as NotificationIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { shopOwnerService } from '../../services/api';

interface DashboardStats {
  dailyVisits: number;
  dailyClicks: number;
  totalReviews: number;
  totalShops: number;
}

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const ShopOwnerDashboardHome = () => {
  const [stats, setStats] = useState<DashboardStats>({
    dailyVisits: 0,
    dailyClicks: 0,
    totalReviews: 0,
    totalShops: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, notificationsData] = await Promise.all([
        shopOwnerService.getDashboardStats(),
        shopOwnerService.getNotifications(),
      ]);
      setStats(statsData.stats);
      setNotifications(notificationsData.notifications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await shopOwnerService.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Daily Visits"
          value={stats.dailyVisits}
          icon={<VisibilityIcon />}
          color="#2563EB"
        />
        <StatCard
          title="Daily Clicks"
          value={stats.dailyClicks}
          icon={<ClickIcon />}
          color="#F97316"
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={<StarIcon />}
          color="#10B981"
        />
        <StatCard
          title="My Shops"
          value={stats.totalShops}
          icon={<StoreIcon />}
          color="#8B5CF6"
        />
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Notifications" />
          <Tab label="Recent Activity" />
        </Tabs>
      </Paper>

      {/* Notifications */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Notifications</Typography>
              <Badge 
                badgeContent={notifications.filter(n => !n.read).length} 
                color="error" 
                sx={{ ml: 2 }}
              />
            </Box>
            
            <List>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No notifications" />
                </ListItem>
              ) : (
                notifications.map((notification) => (
                  <ListItem
                    key={notification._id}
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.message}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </Typography>
                      {!notification.read && (
                        <Chip
                          label="New"
                          size="small"
                          color="primary"
                          onClick={() => handleMarkAsRead(notification._id)}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              Activity tracking coming soon...
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'review': return '#10B981';
    case 'admin_message': return '#F97316';
    default: return '#2563EB';
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'review': return <StarIcon />;
    case 'admin_message': return <NotificationIcon />;
    default: return <StoreIcon />;
  }
};

export default ShopOwnerDashboardHome;