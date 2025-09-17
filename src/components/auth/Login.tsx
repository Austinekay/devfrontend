import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleLogo from '../../assets/google.svg';
import AppleLogo from '../../assets/apple.svg';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, state: { error: authError, loading, user } } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const result = await login(formData.email, formData.password);
      
      // Navigate based on user role
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else if (result.user.role === 'shop_owner') {
        navigate('/dashboard/shop-owner');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      console.error('Login failed:', err);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    // Implement Apple login logic here
    console.log('Apple login clicked');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        {(error || authError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || authError}
          </Alert>
        )}
        
        {/* Social Login Buttons */}
        <Box sx={{ mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            sx={{
              mb: 2,
              color: 'black',
              borderColor: '#ddd',
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: '#f5f5f5'
              },
              display: 'flex',
              gap: 2
            }}
          >
            <img src={GoogleLogo} alt="Google" style={{ width: 20, height: 20 }} />
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleAppleLogin}
            sx={{
              color: 'black',
              borderColor: '#ddd',
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: '#f5f5f5'
              },
              display: 'flex',
              gap: 2
            }}
          >
            <img src={AppleLogo} alt="Apple" style={{ width: 20, height: 20 }} />
            Continue with Apple
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>

        {/* Email/Password Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Login with Email
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
