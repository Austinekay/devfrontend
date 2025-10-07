import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Store,
  Visibility,
  LocationOn,
  Category,
  Star,
  TouchApp,
} from '@mui/icons-material';

interface AnalyticsData {
  platformStats: {
    totalUsers: number;
    activeUsers: number;
    totalShops: number;
    totalViews: number;
    totalClicks: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  popularLocations: Array<{
    city: string;
    shopCount: number;
    viewCount: number;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
    shops: number;
  }>;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Mock data - replace with actual API call
    const mockData: AnalyticsData = {
      platformStats: {
        totalUsers: 1250,
        activeUsers: 890,
        totalShops: 156,
        totalViews: 45230,
        totalClicks: 12450,
      },
      topCategories: [
        { name: 'Restaurants', count: 45, percentage: 28.8 },
        { name: 'Retail', count: 38, percentage: 24.4 },
        { name: 'Services', count: 32, percentage: 20.5 },
        { name: 'Entertainment', count: 25, percentage: 16.0 },
        { name: 'Health & Beauty', count: 16, percentage: 10.3 },
      ],
      popularLocations: [
        { city: 'New York', shopCount: 45, viewCount: 12500 },
        { city: 'Los Angeles', shopCount: 38, viewCount: 10200 },
        { city: 'Chicago', shopCount: 28, viewCount: 8900 },
        { city: 'Houston', shopCount: 22, viewCount: 6700 },
        { city: 'Phoenix', shopCount: 18, viewCount: 5400 },
      ],
      userGrowth: [
        { month: 'Jan', users: 850, shops: 120 },
        { month: 'Feb', users: 920, shops: 128 },
        { month: 'Mar', users: 1050, shops: 142 },
        { month: 'Apr', users: 1180, shops: 156 },
        { month: 'May', users: 1250, shops: 156 },
      ],
    };
    setAnalyticsData(mockData);
  };

  if (!analyticsData) {
    return <Typography>Loading analytics...</Typography>;
  }

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Platform Analytics
      </Typography>

      {/* Platform Stats */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)'
        }, 
        gap: 3,
        mb: 4
      }}>
        <StatCard
          title="Total Users"
          value={analyticsData.platformStats.totalUsers}
          icon={<People />}
          color="#2563EB"
        />
        <StatCard
          title="Active Users"
          value={analyticsData.platformStats.activeUsers}
          icon={<TrendingUp />}
          color="#10B981"
        />
        <StatCard
          title="Total Shops"
          value={analyticsData.platformStats.totalShops}
          icon={<Store />}
          color="#F97316"
        />
        <StatCard
          title="Total Views"
          value={analyticsData.platformStats.totalViews}
          icon={<Visibility />}
          color="#8B5CF6"
        />
        <StatCard
          title="Total Clicks"
          value={analyticsData.platformStats.totalClicks}
          icon={<TouchApp />}
          color="#EF4444"
        />
      </Box>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Categories" icon={<Category />} iconPosition="start" />
        <Tab label="Locations" icon={<LocationOn />} iconPosition="start" />
        <Tab label="Growth Trends" icon={<TrendingUp />} iconPosition="start" />
      </Tabs>

      {/* Top Categories */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top Categories by Shop Count
            </Typography>
            <List>
              {analyticsData.topCategories.map((category, index) => (
                <ListItem key={category.name} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <Chip 
                      label={index + 1} 
                      size="small" 
                      color={index < 3 ? 'primary' : 'default'}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">{category.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.count} shops ({category.percentage}%)
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <LinearProgress
                        variant="determinate"
                        value={category.percentage}
                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Popular Locations */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Popular Locations
            </Typography>
            <List>
              {analyticsData.popularLocations.map((location, index) => (
                <ListItem key={location.city} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <LocationOn color={index < 3 ? 'primary' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={location.city}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Chip 
                          label={`${location.shopCount} shops`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={`${location.viewCount.toLocaleString()} views`} 
                          size="small" 
                          color="secondary" 
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Growth Trends */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Growth Trends (Last 5 Months)
            </Typography>
            <List>
              {analyticsData.userGrowth.map((data) => (
                <ListItem key={data.month} sx={{ py: 1 }}>
                  <ListItemText
                    primary={data.month}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People fontSize="small" color="primary" />
                          <Typography variant="body2">
                            {data.users.toLocaleString()} users
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Store fontSize="small" color="secondary" />
                          <Typography variant="body2">
                            {data.shops} shops
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Analytics;