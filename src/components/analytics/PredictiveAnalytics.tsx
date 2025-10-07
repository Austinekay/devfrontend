import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, Visibility, TouchApp, People } from '@mui/icons-material';

interface PredictionData {
  shopId: string;
  shopName: string;
  predictedViews: number;
  predictedClicks: number;
  trendScore: number;
  category: string;
  confidence: number;
}

const PredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);

  useEffect(() => {
    loadPredictiveData();
  }, []);

  const loadPredictiveData = () => {
    const mockPredictions: PredictionData[] = [
      {
        shopId: '1',
        shopName: 'Bella Vista Italian',
        predictedViews: 1250,
        predictedClicks: 89,
        trendScore: 8.5,
        category: 'Restaurant',
        confidence: 92
      },
      {
        shopId: '2',
        shopName: 'Tech Hub Electronics',
        predictedViews: 890,
        predictedClicks: 156,
        trendScore: 7.2,
        category: 'Electronics',
        confidence: 87
      }
    ];

    const mockTrends = [
      { category: 'Coffee Shops', growth: 15.3, period: 'Next 30 days' },
      { category: 'Electronics', growth: 8.7, period: 'Next 30 days' },
      { category: 'Fitness', growth: 22.1, period: 'Next 30 days' }
    ];

    setPredictions(mockPredictions);
    setMarketTrends(mockTrends);
  };

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
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
      <Typography variant="h5" sx={{ mb: 3 }}>
        Predictive Analytics Dashboard
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        }, 
        gap: 3,
        mb: 4
      }}>
        <StatCard
          title="Predicted Traffic"
          value="2.1K"
          subtitle="Next 7 days"
          icon={<People />}
          color="#2563EB"
        />
        <StatCard
          title="Expected Views"
          value="15.3K"
          subtitle="Next 30 days"
          icon={<Visibility />}
          color="#10B981"
        />
        <StatCard
          title="Predicted Clicks"
          value="892"
          subtitle="Next 7 days"
          icon={<TouchApp />}
          color="#F97316"
        />
        <StatCard
          title="Trend Score"
          value="8.2"
          subtitle="Market average"
          icon={<TrendingUp />}
          color="#8B5CF6"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Shop Performance Predictions
            </Typography>
            {predictions.map((prediction) => (
              <Box key={prediction.shopId} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {prediction.shopName}
                  </Typography>
                  <Chip 
                    label={`${prediction.confidence}% confidence`} 
                    size="small" 
                    color="primary"
                  />
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Predicted Views
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {prediction.predictedViews.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Expected Clicks
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {prediction.predictedClicks}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Trend Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">
                        {prediction.trendScore}/10
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={prediction.trendScore * 10} 
                        sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>

        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Market Trends
            </Typography>
            {marketTrends.map((trend, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'grey.200', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">
                    {trend.category}
                  </Typography>
                  <Chip 
                    label={`+${trend.growth}%`} 
                    size="small" 
                    color="success"
                    icon={<TrendingUp />}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {trend.period}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PredictiveAnalytics;