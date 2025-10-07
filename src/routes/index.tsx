import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Home from '../components/pages/Home';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../components/dashboard/Dashboard';
import ShopList from '../components/shops/ShopList';
import ShopDetail from '../components/shops/ShopDetail';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import ShopOwnerDashboard from '../components/dashboard/ShopOwnerDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requiredRole?: 'user' | 'shop_owner' | 'admin';
  allowedRoles?: ('user' | 'shop_owner' | 'admin')[];
}> = ({ children, requiredRole, allowedRoles }) => {
  const { state: { user, loading } } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/shop-owner" element={
          <ProtectedRoute requiredRole="shop_owner">
            <ShopOwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/shops" element={
          <ProtectedRoute>
            <ShopList />
          </ProtectedRoute>
        } />
        <Route path="/shops/:id" element={
          <ProtectedRoute>
            <ShopDetail />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
