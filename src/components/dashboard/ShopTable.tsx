import React from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { Store, Analytics as AnalyticsIcon } from '@mui/icons-material';
import { Shop, ShopWithAnalytics } from '../../types';

interface ShopTableProps {
  shops: ShopWithAnalytics[];
  onEdit: (shop: Shop) => void;
  onDelete: (shopId: string) => void;
  onViewAnalytics?: (shop: ShopWithAnalytics) => void;
}

const ShopTable = ({ shops, onEdit, onDelete, onViewAnalytics }: ShopTableProps) => {
  console.log('ShopTable - shops data:', shops);
  shops.forEach((shop, index) => {
    console.log(`Shop ${index}:`, shop.name, 'Images:', shop.images);
  });
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Analytics</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shops.map((shop) => (
            <TableRow key={shop._id || shop.id}>
              <TableCell>
                <Avatar
                  src={shop.images?.[0]}
                  sx={{ width: 50, height: 50 }}
                >
                  <Store />
                </Avatar>
              </TableCell>
              <TableCell>{shop.name}</TableCell>
              <TableCell>{shop.description}</TableCell>
              <TableCell>{shop.address}</TableCell>
              <TableCell>{shop.categories.join(', ')}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Chip size="small" label={`${shop.analytics?.totalViews || 0} views`} color="primary" variant="outlined" />
                  <Chip size="small" label={`${shop.analytics?.totalClicks || 0} clicks`} color="secondary" variant="outlined" />
                  <Chip size="small" label={`${shop.analytics?.totalReviews || 0} reviews`} color="success" variant="outlined" />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => onEdit(shop)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDelete(shop._id || shop.id!)}
                    >
                      Delete
                    </Button>
                  </Box>
                  {onViewAnalytics && (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<AnalyticsIcon />}
                      onClick={() => onViewAnalytics(shop)}
                      fullWidth
                    >
                      Analytics
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShopTable;
