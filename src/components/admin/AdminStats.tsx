import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Store, People, Category, TrendingUp } from '@mui/icons-material';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ 
  title, 
  value, 
  icon 
}) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.shadows[8],
        '& .stat-icon': {
          transform: 'scale(1.1)',
        },
      },
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: 'primary.main',
        transform: 'scaleX(0)',
        transition: 'transform 0.3s ease-in-out',
        transformOrigin: 'left'
      },
      '&:hover::before': {
        transform: 'scaleX(1)',
      }
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography 
        color="textSecondary" 
        gutterBottom 
        variant="h6"
        sx={{ 
          fontWeight: 500,
          transition: 'color 0.3s ease',
          '&:hover': { color: 'primary.main' }
        }}
      >
        {title}
      </Typography>
      <Typography 
        color="textPrimary" 
        variant="h4"
        sx={{ fontWeight: 600 }}
      >
        {value}
      </Typography>
    </Box>
    <Box 
      className="stat-icon"
      sx={{ 
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {icon}
    </Box>
  </Paper>
);

const AdminStats = () => {
  // In a real app, these would come from your backend
  const stats = {
    totalShops: 3,
    totalUsers: 10,
    totalCategories: 8,
    activeShops: 3
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)'
      }, 
      gap: 3 
    }}>
      <StatCard
        title="Total Shops"
        value={stats.totalShops}
        icon={<Store sx={{ color: 'primary.main', fontSize: 35 }} />}
      />
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<People sx={{ color: 'success.main', fontSize: 35 }} />}
      />
      <StatCard
        title="Categories"
        value={stats.totalCategories}
        icon={<Category sx={{ color: 'warning.main', fontSize: 35 }} />}
      />
      <StatCard
        title="Active Shops"
        value={stats.activeShops}
        icon={<TrendingUp sx={{ color: 'info.main', fontSize: 35 }} />}
      />
    </Box>
  );
};

export default AdminStats;
