import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box, Chip, CardMedia } from '@mui/material';
import { LocationOn, AccessTime } from '@mui/icons-material';
import { Shop } from '../../types';
import { shopOwnerService } from '../../services/shopOwnerService';

interface ShopCardProps {
  shop: Shop;
  onViewDetails?: (shop: Shop) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onViewDetails }) => {
  console.log('ShopCard - shop data:', shop);
  console.log('ShopCard - imageUrl:', shop.imageUrl);
  console.log('ShopCard - images:', shop.images);
  console.log('ShopCard - has imageUrl:', !!shop.imageUrl);
  console.log('ShopCard - has images:', !!(shop.images && shop.images.length > 0));
  
  return (
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
    {(shop.imageUrl || (shop.images && shop.images.length > 0)) ? (
      <CardMedia
        component="img"
        height="140"
        image={shop.imageUrl || shop.images?.[0]}
        alt={shop.name}
        sx={{ objectFit: 'cover' }}
        onError={(e) => {
          console.error('Image failed to load:', shop.imageUrl || shop.images?.[0]);
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
    ) : null}
    <CardMedia
      component="div"
      sx={{
        height: 140,
        bgcolor: 'primary.light',
        display: (shop.imageUrl || (shop.images && shop.images.length > 0)) ? 'none' : 'flex',
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
        onClick={async () => {
          try {
            await shopOwnerService.trackShopClick(shop._id || shop.id!);
          } catch (error) {
            console.error('Error tracking click:', error);
          }
          onViewDetails?.(shop);
        }}
      >
        View Details
      </Button>
    </CardActions>
  </Card>
  );
};

export default ShopCard;
