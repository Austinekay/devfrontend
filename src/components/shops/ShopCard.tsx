import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, Chip, CardMedia } from '@mui/material';
import { LocationOn, AccessTime } from '@mui/icons-material';
import { Shop } from '../../types';

interface ShopCardProps {
  shop: Shop;
  onViewDetails?: (shop: Shop) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onViewDetails }) => (
  <Card sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100%',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 4,
    }
  }}>
    <CardMedia
      component="div"
      sx={{
        height: 140,
        bgcolor: 'primary.light',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h4" sx={{ color: 'white' }}>
        {shop.name.charAt(0)}
      </Typography>
    </CardMedia>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom>{shop.name}</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {shop.description}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {shop.address}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {shop.categories?.map((category) => (
          <Chip
            key={category}
            label={category}
            size="small"
            sx={{ bgcolor: 'primary.light', color: 'white' }}
          />
        ))}
      </Box>
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        color="primary"
        onClick={() => onViewDetails?.(shop)}
      >
        View Details
      </Button>
    </CardActions>
  </Card>
);

export default ShopCard;
