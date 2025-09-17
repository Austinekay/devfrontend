import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ShopOwnerDashboard from './components/dashboard/ShopOwnerDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import ShopList from './components/shops/ShopList';
import AdminDashboard from './components/admin/AdminDashboard';

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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#6a11cb',
            light: '#2575fc',
            dark: '#3a3a3a',
            contrastText: '#fff',
          },
          secondary: {
            main: '#ff6a00',
            light: '#ffd700',
            dark: '#c43a30',
            contrastText: '#fff',
          },
          background: {
            default: mode === 'light' ? '#f3f3f3' : '#121212',
            paper: mode === 'light' ? '#fff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#222' : '#fff',
            secondary: mode === 'light' ? '#555' : '#aaa',
          },
          info: {
            main: '#43cea2',
          },
          success: {
            main: '#185a9d',
          },
          warning: {
            main: '#f7971e',
          },
          error: {
            main: '#e53935',
          },
        },
        typography: {
          fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.7rem',
            fontWeight: 700,
          },
          h2: {
            fontSize: '2.2rem',
            fontWeight: 600,
          },
          h3: {
            fontWeight: 500,
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shops" element={<ShopList />} />
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
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
