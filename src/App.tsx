import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

import theme from './theme/theme';
import Layout from './components/layout/Layout';
import LandingHome from './components/pages/LandingHome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ShopOwnerDashboard from './components/dashboard/ShopOwnerDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import ModernShopList from './components/shops/ModernShopList';
import ShopDetail from './components/shops/ShopDetail';
import AdminDashboard from './components/admin/AdminDashboard';
import GoogleCallback from './components/auth/GoogleCallback';
import AIRecommendationsPage from './components/pages/AIRecommendationsPage';


// Create theme context
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <AuthProvider>
            <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<LandingHome />} />
                <Route path="/home" element={<LandingHome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/shops" element={<ModernShopList />} />
                <Route path="/shops/:id" element={<ShopDetail />} />
                <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/shop-owner"
                  element={
                    <ProtectedRoute requiredRole="shop_owner">
                      <ShopOwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
          </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
