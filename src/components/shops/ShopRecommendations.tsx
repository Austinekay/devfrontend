import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Search, LocationOn, AutoAwesome } from '@mui/icons-material';
import { recommendationService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Recommendation {
  id?: string;
  name: string;
  category: string;
  reason: string;
}

interface ShopRecommendationsProps {
  userLocation?: [number, number] | null;
}

const ShopRecommendations = ({ userLocation }: ShopRecommendationsProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    if (!userLocation) {
      setError('Unable to get your location. Please enable location services.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [lat, lng] = userLocation;
      const recommendations = await recommendationService.getAIRecommendations(
        query.trim(),
        lat,
        lng
      );

      setRecommendations(recommendations || []);
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AutoAwesome color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          AI Shop Recommendations
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search for shop category (e.g., restaurant, barber, electronics)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <Search />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!userLocation && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1 }} />
            Please enable location services to get personalized recommendations.
          </Box>
        </Alert>
      )}

      {recommendations.length > 0 && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Top AI Recommendations:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recommendations.map((rec, index) => (
              <Card 
                key={index} 
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'primary.light',
                  cursor: rec.id ? 'pointer' : 'default',
                  '&:hover': rec.id ? { boxShadow: 2 } : {}
                }}
                onClick={() => rec.id && navigate(`/shops/${rec.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" color="primary">
                      {rec.name}
                    </Typography>
                    <Chip 
                      label={rec.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {rec.reason}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {recommendations.length === 0 && !loading && !error && query && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No recommendations found for "{query}". Try a different search term.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ShopRecommendations;