import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  TouchApp as ClickIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { shopOwnerService } from '../../services/shopOwnerService';

interface ShopAnalyticsProps {
  shopId: string;
  shopName: string;
}

const ShopAnalytics: React.FC<ShopAnalyticsProps> = ({ shopId, shopName }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [period, setPeriod] = useState('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [shopId, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await shopOwnerService.getShopAnalytics(shopId, period);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">Failed to load analytics</Typography>
      </Box>
    );
  }

  const clickRate = analytics.totalViews > 0 
    ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1) 
    : '0';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Analytics for {shopName}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2563EB' }}>
                  {analytics.totalViews || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Views
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#2563EB', width: 56, height: 56 }}>
                <ViewIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#F97316' }}>
                  {analytics.totalClicks || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Clicks
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#F97316', width: 56, height: 56 }}>
                <ClickIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981' }}>
                  {analytics.totalReviews || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Reviews
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#10B981', width: 56, height: 56 }}>
                <StarIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#8B5CF6' }}>
                  {clickRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click Rate
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#8B5CF6', width: 56, height: 56 }}>
                <TrendingIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Analytics Summary
          </Typography>
          <Typography color="text.secondary">
            Your shop has received {analytics.totalViews || 0} views and {analytics.totalClicks || 0} clicks.
            {analytics.totalReviews > 0 && ` Average rating: ${analytics.avgRating?.toFixed(1) || 0}/5`}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ShopAnalytics;