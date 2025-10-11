import React from 'react';
import { Chip, Box, Typography } from '@mui/material';
import { Shop } from '../../types';
import { getShopStatus } from '../../utils/shopUtils';

interface ShopStatusProps {
  shop: Shop;
  variant?: 'chip' | 'text';
}

const ShopStatus: React.FC<ShopStatusProps> = ({ shop, variant = 'chip' }) => {
  const { isOpen, message } = getShopStatus(shop);

  if (variant === 'text') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isOpen ? 'success.main' : 'error.main',
          }}
        />
        <Typography variant="body2" color={isOpen ? 'success.main' : 'error.main'}>
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <Chip
      label={message}
      color={isOpen ? 'success' : 'error'}
      variant="outlined"
      size="small"
    />
  );
};

export default ShopStatus;