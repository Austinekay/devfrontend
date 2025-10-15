import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import api from '../services/api';

interface ConnectionStatus {
  status: 'testing' | 'success' | 'error';
  message: string;
  details?: any;
}

const ConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'testing',
    message: 'Testing connection...'
  });

  const testConnection = async () => {
    setConnectionStatus({ status: 'testing', message: 'Testing connection...' });
    
    try {
      // Test basic connectivity
      const response = await api.get('/health');
      
      setConnectionStatus({
        status: 'success',
        message: 'Backend connection successful!',
        details: response.data
      });
    } catch (error: any) {
      setConnectionStatus({
        status: 'error',
        message: `Connection failed: ${error.message}`,
        details: {
          code: error.code,
          status: error.response?.status,
          data: error.response?.data
        }
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getAlertSeverity = () => {
    switch (connectionStatus.status) {
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Backend Connection Test
      </Typography>
      
      <Alert severity={getAlertSeverity()} sx={{ mb: 2 }}>
        {connectionStatus.status === 'testing' && <CircularProgress size={20} sx={{ mr: 1 }} />}
        {connectionStatus.message}
      </Alert>

      {connectionStatus.details && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Details:
          </Typography>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {JSON.stringify(connectionStatus.details, null, 2)}
          </pre>
        </Box>
      )}

      <Button 
        variant="contained" 
        onClick={testConnection}
        disabled={connectionStatus.status === 'testing'}
        sx={{ mt: 2 }}
      >
        Test Again
      </Button>
    </Box>
  );
};

export default ConnectionTest;