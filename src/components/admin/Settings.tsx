import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Save, Refresh, Security, Storage, CheckCircle } from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    autoApproveShops: false,
    maintenanceMode: false,
    maxShopsPerUser: 5,
    sessionTimeout: 30,
    backupFrequency: 'daily',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSettings();
      setSettings(data.settings || data);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await adminService.updateSettings(settings);
      setSaveStatus('saved');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving settings:', error);
    }
  };

  const handleReset = () => {
    setSettings({
      autoApproveShops: false,
      maintenanceMode: false,
      maxShopsPerUser: 5,
      sessionTimeout: 30,
      backupFrequency: 'daily',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>System Settings</Typography>
        {saveStatus === 'saved' && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <CheckCircle sx={{ mr: 1 }} />
            <Typography variant="body2">Settings saved</Typography>
          </Box>
        )}
      </Box>
      
      {saveStatus === 'saved' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}
      
      {saveStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to save settings. Please try again.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>


        {/* Security Settings */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">Security</Typography>
              </Box>
              <TextField
                label="Session Timeout (minutes)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  />
                }
                label="Maintenance Mode"
              />
            </CardContent>
          </Card>
        </Box>

        {/* Shop Management Settings */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Storage sx={{ mr: 1 }} />
                <Typography variant="h6">Shop Management</Typography>
              </Box>
              <TextField
                label="Max Shops Per User"
                type="number"
                value={settings.maxShopsPerUser}
                onChange={(e) => handleSettingChange('maxShopsPerUser', parseInt(e.target.value))}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoApproveShops}
                    onChange={(e) => handleSettingChange('autoApproveShops', e.target.checked)}
                  />
                }
                label="Auto-approve New Shops"
              />
            </CardContent>
          </Card>
        </Box>

        {/* System Settings */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>System</Typography>
              <TextField
                label="Backup Frequency"
                select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </TextField>
            </CardContent>
          </Card>
        </Box>


      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={saveStatus === 'saving' ? <CircularProgress size={20} color="inherit" /> : <Save />}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          sx={{
            minWidth: '140px',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 2
            }
          }}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
        >
          Reset to Defaults
        </Button>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;