 import React from 'react';
import { 
  Container, 
  Typography, 
  Box,  
  Paper, 
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Skeleton,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon, title, value, color }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      height: '100%',
      background: `linear-gradient(45deg, ${color}15, ${color}05)`,
      border: `1px solid ${color}30`,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ 
        p: 1, 
        borderRadius: 1, 
        bgcolor: `${color}15`, 
        display: 'flex',
        mr: 2
      }}>
        {icon}
      </Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Paper>
);

interface Activity {
  id: number;
  text: string;
  time: string;
  icon: React.ReactNode;
}

interface DashboardStats {
  totalShops: number;
  placesVisited: number;
  reviews: number;
  recentViews: number;
}

const Dashboard = () => {
  const { state: { user } } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState<DashboardStats>({
    totalShops: 0,
    placesVisited: 0,
    reviews: 0,
    recentViews: 0
  });

  // Simulated data - replace with actual data from your backend
  const recentActivity: Activity[] = [
    { id: 1, text: 'Visited Coffee Shop', time: '2 hours ago', icon: <LocationOnIcon /> },
    { id: 2, text: 'Added review for Restaurant', time: '1 day ago', icon: <StarIcon /> },
    { id: 3, text: 'Discovered new Shop', time: '2 days ago', icon: <StorefrontIcon /> },
  ];

  React.useEffect(() => {
    // Simulate loading data
    const loadDashboardData = async () => {
      try {
        // Replace this with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalShops: 28,
          placesVisited: 15,
          reviews: 12,
          recentViews: 45
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {user.name}!
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/shops')}
        >
          Discover Shops
        </Button>
      </Box>

      <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        }}
        gap={3}
      >
        {/* Statistics Cards */}
        <StatCard
          icon={<StorefrontIcon sx={{ color: '#2196f3' }} />}
          title="Total Shops"
          value={isLoading ? "..." : stats.totalShops.toString()}
          color="#2196f3"
        />
        <StatCard
          icon={<LocationOnIcon sx={{ color: '#4caf50' }} />}
          title="Places Visited"
          value={isLoading ? "..." : stats.placesVisited.toString()}
          color="#4caf50"
        />
        <StatCard
          icon={<StarIcon sx={{ color: '#ff9800' }} />}
          title="Reviews"
          value={isLoading ? "..." : stats.reviews.toString()}
          color="#ff9800"
        />
        <StatCard
          icon={<HistoryIcon sx={{ color: '#e91e63' }} />}
          title="Recent Views"
          value={isLoading ? "..." : stats.recentViews.toString()}
          color="#e91e63"
        />
      </Box>

      {/* Activity and Quick Actions */}
      <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: '1fr',
          md: '2fr 1fr'
        }}
        gap={3}
        mt={3}
      >
        {/* Recent Activity */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Recent Activity
            </Typography>
            {isLoading ? (
              <Box sx={{ mt: 2 }}>
                <Skeleton animation="wave" height={40} />
                <Skeleton animation="wave" height={40} />
                <Skeleton animation="wave" height={40} />
              </Box>
            ) : (
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        {activity.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              View All Activity
            </Button>
          </CardActions>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<StorefrontIcon />}
                onClick={() => navigate('/shops')}
                fullWidth
              >
                Browse Shops
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocationOnIcon />}
                onClick={() => navigate('/map')}
                fullWidth
              >
                View Map
              </Button>
              <Button
                variant="outlined"
                startIcon={<StarIcon />}
                onClick={() => navigate('/reviews')}
                fullWidth
              >
                My Reviews
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Dashboard;
