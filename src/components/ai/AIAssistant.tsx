import React, { useState } from 'react';
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
} from '@mui/material';
import { Send, SmartToy, Store } from '@mui/icons-material';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  shops?: any[];
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI shopping assistant. I can help you find shops based on your preferences, location, and needs. What are you looking for today?',
      suggestions: ['Find restaurants nearby', 'Show me electronics stores', 'Best coffee shops in my area']
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (query: string): AIMessage => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('restaurant') || lowerQuery.includes('food')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: 'I found some great restaurants near you! Based on your location and preferences:',
        shops: [
          { name: 'Bella Vista Italian', category: 'Italian', rating: 4.8, distance: '0.3 miles' },
          { name: 'Sakura Sushi', category: 'Japanese', rating: 4.6, distance: '0.5 miles' }
        ],
        suggestions: ['Show more restaurants', 'Filter by cuisine', 'Find delivery options']
      };
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: 'I understand you\'re looking for shops. Let me help you find exactly what you need.',
      suggestions: ['Restaurants & Food', 'Shopping & Retail', 'Services & Repair', 'Health & Beauty']
    };
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
                
                {message.shops && (
                  <List dense sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
                    {message.shops.map((shop, index) => (
                      <ListItem key={index}>
                        <Store sx={{ mr: 1, color: 'primary.main' }} />
                        <ListItemText
                          primary={shop.name}
                          secondary={`${shop.category} • ${shop.rating}⭐ • ${shop.distance}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {message.suggestions && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        onClick={() => setInput(suggestion)}
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