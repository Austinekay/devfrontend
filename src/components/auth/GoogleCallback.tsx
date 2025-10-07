import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useAuth() as any;

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const user = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error });
        navigate('/login');
        return;
      }

      if (token && user) {
        try {
          const userData = JSON.parse(decodeURIComponent(user));
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user: userData, token } 
          });

          // Navigate based on user role
          if (userData.role === 'admin') {
            navigate('/admin');
          } else if (userData.role === 'shop_owner') {
            navigate('/dashboard/shop-owner');
          } else {
            navigate('/dashboard');
          }
        } catch (err) {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid user data' });
          navigate('/login');
        }
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Authentication failed' });
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography>Completing sign in...</Typography>
    </Box>
  );
};

export default GoogleCallback;