import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Add, Block, CheckCircle, Store } from '@mui/icons-material';
import { userService, adminService } from '../../services/api';
import { User, UserRole } from '../../types';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        await loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    try {
      await adminService.suspendUser(userId, suspend);
      await loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleApproveShop = async (userId: string) => {
    try {
      await userService.updateUser(userId, { shopApproved: true });
      await loadUsers();
    } catch (error) {
      console.error('Error approving shop:', error);
    }
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      if (selectedUser) {
        const updateData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as UserRole,
        };
        await userService.updateUser(selectedUser._id || selectedUser.id, updateData);
      } else {
        const createData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          role: formData.get('role') as string | undefined,
        };
        await userService.createUser(createData);
      }
      
      setIsDialogOpen(false);
      await loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">User Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddNew}
        >
          Add New User
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id || user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'admin' ? 'error' : user.role === 'shop_owner' ? 'warning' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(user as any).suspended && <Chip label="Suspended" color="error" size="small" />}
                    {user.role === 'shop_owner' && !(user as any).shopApproved && (
                      <Chip label="Pending Approval" color="warning" size="small" />
                    )}
                    {user.role === 'shop_owner' && (user as any).shopApproved && (
                      <Chip label="Approved" color="success" size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit User">
                      <IconButton onClick={() => handleEdit(user)} color="primary" size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    
                    {user.role === 'shop_owner' && !(user as any).shopApproved && (
                      <Tooltip title="Approve Shop">
                        <IconButton 
                          onClick={() => handleApproveShop(user._id || user.id)} 
                          color="success" 
                          size="small"
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    <Tooltip title={(user as any).suspended ? "Unsuspend User" : "Suspend User"}>
                      <IconButton 
                        onClick={() => handleSuspendUser(user._id || user.id, !(user as any).suspended)} 
                        color="warning" 
                        size="small"
                      >
                        <Block />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete User">
                      <IconButton onClick={() => handleDelete(user._id || user.id)} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                name="name"
                label="Name"
                defaultValue={selectedUser?.name}
                required
                fullWidth
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                defaultValue={selectedUser?.email}
                required
                fullWidth
              />
              {!selectedUser && (
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  required
                  fullWidth
                />
              )}
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  defaultValue={selectedUser?.role || 'user'}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="shop_owner">Shop Owner</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;