import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Rating,
} from '@mui/material';
import { Send, SmartToy, Store, LocationOn, Navigation } from '@mui/icons-material';
import { shopService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  shops?: any[];
  loading?: boolean;
}

interface Shop {
  _id: string;
  name: string;
  description: string;
  address: string;
  categories: string[];
  images?: string[];
  location: {
    coordinates: [number, number];
  };
  distance?: number;
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI shopping assistant. I can help you find shops based on your preferences, location, and needs. What are you looking for today?',
      suggestions: ['Featured shops', 'Find restaurants nearby', 'Show me electronics stores', 'Best beauty shops']
    }
  ]);
  const [input, setInput] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [allShops, setAllShops] = useState<Shop[]>([]);

  useEffect(() => {
    loadShops();
    getUserLocation();
  }, []);

  const loadShops = async () => {
    try {
      const shops = await shopService.getShops();
      setAllShops(shops);
    } catch (error) {
      console.error('Error loading shops:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location error:', error)
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');

    // Add loading message
    const loadingMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: 'Let me search for the best options for you...',
      loading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    // Generate AI response
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(query);
      setMessages(prev => prev.slice(0, -1).concat(aiResponse));
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  const generateAIResponse = async (query: string): Promise<AIMessage> => {
    const lowerQuery = query.toLowerCase();
    let filteredShops: Shop[] = [];
    let responseContent = '';
    let suggestions: string[] = [];

    // AI logic to understand user intent and find relevant shops
    if (lowerQuery.includes('restaurant') || lowerQuery.includes('food') || lowerQuery.includes('eat')) {
      filteredShops = allShops.filter(shop => 
        shop.categories.some(cat => cat.toLowerCase().includes('food') || cat.toLowerCase().includes('restaurant'))
      );
      responseContent = `I found ${filteredShops.length} restaurants and food places for you! Here are the best options:`;
      suggestions = ['Show more restaurants', 'Find fast food', 'Healthy food options', 'Coffee shops'];
    } 
    else if (lowerQuery.includes('electronic') || lowerQuery.includes('tech') || lowerQuery.includes('phone') || lowerQuery.includes('computer')) {
      filteredShops = allShops.filter(shop => 
        shop.categories.some(cat => cat.toLowerCase().includes('electronic') || cat.toLowerCase().includes('tech'))
      );
      responseContent = `Found ${filteredShops.length} electronics stores with the latest tech gadgets:`;
      suggestions = ['Mobile phones', 'Laptops & computers', 'Gaming accessories', 'Smart devices'];
    }
    else if (lowerQuery.includes('beauty') || lowerQuery.includes('salon') || lowerQuery.includes('cosmetic')) {
      filteredShops = allShops.filter(shop => 
        shop.categories.some(cat => cat.toLowerCase().includes('beauty'))
      );
      responseContent = `Here are ${filteredShops.length} beauty shops and salons in your area:`;
      suggestions = ['Hair salons', 'Nail services', 'Skincare products', 'Makeup stores'];
    }
    else if (lowerQuery.includes('fashion') || lowerQuery.includes('cloth') || lowerQuery.includes('dress')) {
      filteredShops = allShops.filter(shop => 
        shop.categories.some(cat => cat.toLowerCase().includes('fashion') || cat.toLowerCase().includes('cloth'))
      );
      responseContent = `I found ${filteredShops.length} fashion stores with trendy clothing:`;
      suggestions = ['Men\'s fashion', 'Women\'s clothing', 'Shoes & accessories', 'Designer brands'];
    }
    else if (lowerQuery.includes('auto') || lowerQuery.includes('car') || lowerQuery.includes('repair')) {
      filteredShops = allShops.filter(shop => 
        shop.categories.some(cat => cat.toLowerCase().includes('auto'))
      );
      responseContent = `Found ${filteredShops.length} automotive services for your car needs:`;
      suggestions = ['Car repair', 'Oil change', 'Tire services', 'Car wash'];
    }
    else if (lowerQuery.includes('featured') || lowerQuery.includes('popular') || lowerQuery.includes('recommended')) {
      if (userLocation) {
        // Show featured shops based on location - closest shops first
        const shopsWithDistance = allShops.map(shop => ({
          ...shop,
          distance: calculateDistance(
            userLocation.lat, userLocation.lng,
            shop.location.coordinates[1], shop.location.coordinates[0]
          )
        })).sort((a, b) => a.distance - b.distance).slice(0, 5);
        
        filteredShops = shopsWithDistance;
        responseContent = `Here are featured shops near your location:`;
        suggestions = ['Nearby restaurants', 'Local services', 'Shopping centers', 'All categories'];
      } else {
        // Fallback to general featured shops when no location
        filteredShops = allShops.slice(0, 5);
        responseContent = `Here are our featured shops (enable location for personalized results):`;
        suggestions = ['Enable location', 'Top rated shops', 'New arrivals', 'All categories'];
      }
    }
    else if (lowerQuery.includes('nearby') || lowerQuery.includes('near me') || lowerQuery.includes('close')) {
      if (userLocation) {
        const shopsWithDistance = allShops.map(shop => ({
          ...shop,
          distance: calculateDistance(
            userLocation.lat, userLocation.lng,
            shop.location.coordinates[1], shop.location.coordinates[0]
          )
        })).sort((a, b) => a.distance - b.distance).slice(0, 5);
        
        filteredShops = shopsWithDistance;
        responseContent = 'Here are the closest shops to your current location:';
        suggestions = ['Restaurants nearby', 'Shopping centers', 'Services nearby', 'All categories'];
      } else {
        filteredShops = allShops.slice(0, 5);
        responseContent = 'Here are some popular shops (enable location for personalized results):';
        suggestions = ['Enable location', 'Browse all shops', 'Search by category'];
      }
    }
    else {
      // General search across all shop data
      filteredShops = allShops.filter(shop => 
        shop.name.toLowerCase().includes(lowerQuery) ||
        shop.description.toLowerCase().includes(lowerQuery) ||
        shop.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
      );
      
      if (filteredShops.length > 0) {
        responseContent = `I found ${filteredShops.length} shops matching "${query}":`;
      } else {
        responseContent = `I couldn't find shops matching "${query}". Here are some popular options:`;
        filteredShops = allShops.slice(0, 3);
      }
      suggestions = ['Try different keywords', 'Browse categories', 'Find nearby shops', 'Popular shops'];
    }

    // Add distance if user location is available
    if (userLocation && filteredShops.length > 0) {
      filteredShops = filteredShops.map(shop => ({
        ...shop,
        distance: calculateDistance(
          userLocation.lat, userLocation.lng,
          shop.location.coordinates[1], shop.location.coordinates[0]
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: responseContent,
      shops: filteredShops.slice(0, 5), // Limit to 5 results
      suggestions
    };
  };

  const handleShopClick = (shop: Shop) => {
    navigate(`/shops/${shop._id}`);
  };

  const handleNavigateToShop = (shop: Shop) => {
    const [lng, lat] = shop.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <Paper sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <SmartToy color="primary" />
        <Typography variant="h6">AI Shopping Assistant</Typography>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: message.type === 'ai' ? 'primary.main' : 'grey.500' }}>
                {message.type === 'ai' ? <SmartToy fontSize="small" /> : 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {message.content}
                </Typography>
                
                {message.loading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">Searching...</Typography>
                  </Box>
                )}
                
                {message.shops && message.shops.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {message.shops.map((shop, index) => (
                      <Card key={index} sx={{ mb: 1, cursor: 'pointer' }} onClick={() => handleShopClick(shop)}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {shop.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {shop.description}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                  {shop.distance ? `${shop.distance.toFixed(1)}km away` : shop.address}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {shop.categories.slice(0, 2).map((category: string, catIndex: number) => (
                                  <Chip
                                    key={catIndex}
                                    label={category}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToShop(shop);
                              }}
                              sx={{ ml: 1 }}
                            >
                              <Navigation fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
                
                {message.suggestions && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask me anything about shops..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton onClick={handleSend} color="primary">
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AIAssistant;