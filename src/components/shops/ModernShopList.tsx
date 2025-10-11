import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Paper,
  IconButton,
  Rating,
  Skeleton,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Switch,
  Slider,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Directions as DirectionsIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { shopService } from '../../services/api';
import { shopOwnerService } from '../../services/shopOwnerService';
import { Shop } from '../../types';
import ShopRecommendations from './ShopRecommendations';
import NearbyShops from './NearbyShops';

const categories = ['Food', 'Fashion', 'Electronics', 'Health', 'Services', 'Beauty', 'Automotive'];

const ModernShopList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    openNow: false,
    rating: [0, 5],
    distance: [0, 10],
  });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  useEffect(() => {
    loadShops();
    // Check if user came with location parameters
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    if (lat && lng) {
      setUserLocation([parseFloat(lat), parseFloat(lng)]);
    }
  }, []);

  useEffect(() => {
    loadShops();
  }, [selectedCategory]);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, selectedCategory, filters]);

  const loadShops = async () => {
    try {
      setLoading(true);
      const lat = searchParams.get('lat');
      const lng = searchParams.get('lng');
      
      let data;
      if (lat && lng) {
        data = await shopService.searchShopsByLocation(
          parseFloat(lat),
          parseFloat(lng),
          5000,
          selectedCategory || undefined
        );
      } else {
        data = await shopService.getShops();
      }
      
      let approvedShops = data.filter((shop: any) => shop.approved === true);
      
      console.log('All approved shops:', approvedShops.length);
      console.log('Selected category:', selectedCategory);
      
      // Apply category filter if selected
      if (selectedCategory) {
        const filteredShops = approvedShops.filter((shop: any) => {
          console.log('Shop categories:', shop.categories, 'Looking for:', selectedCategory);
          return shop.categories?.some((category: string) => 
            category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            selectedCategory.toLowerCase().includes(category.toLowerCase())
          );
        });
        console.log('Filtered shops count:', filteredShops.length);
        approvedShops = filteredShops;
      }
      
      setShops(approvedShops);
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setLoading(false);
    }
  };



  const filterShops = () => {
    let filtered = shops;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredShops(filtered);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };

  const ShopCard = ({ shop }: { shop: Shop }) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
      }}
      onClick={async () => {
        try {
          await shopOwnerService.trackShopClick(shop._id || shop.id!);
        } catch (error) {
          console.error('Error tracking click:', error);
        }
        navigate(`/shops/${shop._id || shop.id}`);
      }}
    >
      {shop.images && shop.images.length > 0 ? (
        <CardMedia
          component="img"
          height="200"
          image={shop.images[0]}
          alt={shop.name}
          sx={{ objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      ) : null}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          background: `linear-gradient(45deg, #2563EB 30%, #F97316 90%)`,
          display: shop.images && shop.images.length > 0 ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
          {shop.name?.charAt(0) || 'S'}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.9)',
            borderRadius: 2,
            px: 1,
            py: 0.5,
          }}
        >
          <StarIcon sx={{ color: '#F97316', fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            4.5
          </Typography>
        </Box>
      </CardMedia>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {shop.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
          {shop.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {shop.address}
          </Typography>
        </Box>
        {(shop as any).contact && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {(shop as any).contact}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {shop.categories?.slice(0, 2).map((category) => (
            <Chip
              key={category}
              label={category}
              size="small"
              sx={{ bgcolor: 'primary.light', color: 'white' }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(shop as any).contact && (
              <IconButton 
                size="small" 
                sx={{ bgcolor: 'primary.light', color: 'white' }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${(shop as any).contact}`);
                }}
              >
                <PhoneIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Button
            size="small"
            startIcon={<DirectionsIcon />}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await shopOwnerService.trackShopClick(shop._id || shop.id!);
              } catch (error) {
                console.error('Error tracking click:', error);
              }
              navigate(`/shops/${shop._id || shop.id}`);
            }}
            sx={{ minWidth: 'auto' }}
          >
            Directions
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 10 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            Discover Shops
          </Typography>
          
          {/* Search Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              borderRadius: 4,
              mb: 3,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <TextField
              fullWidth
              placeholder="Search shops, services, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { '& .MuiOutlinedInput-notchedOutline': { border: 'none' } },
              }}
            />
          </Paper>

          {/* Categories */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryClick(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                sx={{
                  '&:hover': { bgcolor: 'primary.light', color: 'white' },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {filteredShops.length} shops found
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant={showAIRecommendations ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                sx={{ mr: 2 }}
              >
                AI Recommendations
              </Button>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ListIcon />
              </IconButton>
            </Box>
          </Box>

          {/* AI Recommendations Section */}
          {showAIRecommendations && (
            <Box sx={{ mb: 4 }}>
              <ShopRecommendations userLocation={userLocation} />
            </Box>
          )}
        </Box>

        {/* Nearby Shops Section */}
        {userLocation && (
          <Box sx={{ mb: 4 }}>
            <NearbyShops userLocation={userLocation} selectedCategory={selectedCategory} />
          </Box>
        )}

        {/* Shop Grid */}
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {filteredShops.map((shop) => (
              <ShopCard key={shop._id || shop.id} shop={shop} />
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredShops.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
              No shops found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Container>

      {/* Filter FAB */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setFilterOpen(true)}
      >
        <FilterIcon />
      </Fab>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{ sx: { width: 320, p: 3 } }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Filters
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={filters.openNow}
              onChange={(e) => setFilters({ ...filters, openNow: e.target.checked })}
            />
          }
          label="Open Now"
          sx={{ mb: 3 }}
        />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Rating
        </Typography>
        <Slider
          value={filters.rating}
          onChange={(_, value) => setFilters({ ...filters, rating: value as number[] })}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.5}
          sx={{ mb: 3 }}
        />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Distance (km)
        </Typography>
        <Slider
          value={filters.distance}
          onChange={(_, value) => setFilters({ ...filters, distance: value as number[] })}
          valueLabelDisplay="auto"
          min={0}
          max={50}
          sx={{ mb: 3 }}
        />
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setFilters({ openNow: false, rating: [0, 5], distance: [0, 10] })}
        >
          Clear Filters
        </Button>
      </Drawer>
    </Box>
  );
};

export default ModernShopList;