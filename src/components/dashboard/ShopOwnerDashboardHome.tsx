import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  TouchApp as ClickIcon,
  Star as StarIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { shopOwnerService } from '../../services/shopOwnerService';
import { DashboardStats } from '../../types';

const ShopOwnerDashboardHome = () => {
  const [stats, setStats] = useState<DashboardStats>({
    dailyVisits: 0,
    dailyClicks: 0,
    totalReviews: 0,
    totalShops: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await shopOwnerService.getDashboardStats();
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Container>
    );
  }

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

      {/* Recent Activity */}
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
    </Container>
  );
};

export default ShopOwnerDashboardHome;