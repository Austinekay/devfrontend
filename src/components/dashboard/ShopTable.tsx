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
} from '@mui/material';
import { Store } from '@mui/icons-material';
import { Shop } from '../../types';

interface ShopTableProps {
  shops: Shop[];
  onEdit: (shop: Shop) => void;
  onDelete: (shopId: string) => void;
}

const ShopTable = ({ shops, onEdit, onDelete }: ShopTableProps) => {
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
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => onEdit(shop)}
                  sx={{ mr: 1 }}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShopTable;
