import React, { useEffect, useState } from 'react';
import { Container, Paper, Button, Typography, Box, Alert, TextField, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Google } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, state: { error: authError, loading, user } } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'shop_owner') {
        navigate('/dashboard/shop-owner');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign In
        </Typography>
        
        {(error || authError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || authError}
          </Alert>
        )}
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleGoogleLogin}
          disabled={loading}
          startIcon={<Google />}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            backgroundColor: '#4285f4',
            '&:hover': {
              backgroundColor: '#3367d6'
            },
            mb: 3
          }}
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </Button>
        
        <Divider sx={{ my: 3 }}>or</Divider>
        
        <Box component="form" onSubmit={handleEmailLogin}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            disabled={loading}
            sx={{ py: 2 }}
          >
            Sign in with Email
          </Button>
        </Box>
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
