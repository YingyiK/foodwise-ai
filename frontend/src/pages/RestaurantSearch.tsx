import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Rating,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Star,
  Directions,
  Share,
  Favorite,
  Schedule,
  LocalParking,
  DeliveryDining,
  TakeoutDining,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import axios from 'axios';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  categories: string[];
  address: string;
  phone: string;
  distance: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  imageUrl: string;
  url: string;
  isClosed: boolean;
  foodMatchScore: number;
  recommendation: string;
  estimatedCost: string;
  bestTimeToVisit: string;
  parkingInfo: string;
  deliveryAvailable: boolean;
  takeoutAvailable: boolean;
}

const RestaurantSearch: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Mock user location
  const userLocation = {
    latitude: 37.7749,
    longitude: -122.4194
  };

  // Fetch restaurant recommendations
  const { data: restaurants, isLoading, error } = useQuery(
    'restaurantRecommendations',
    async () => {
      const response = await axios.get('/api/restaurant/search', {
        params: {
          location: `${userLocation.latitude},${userLocation.longitude}`,
          radius: 5000,
          categories: 'restaurants',
        }
      });
      return response.data.data.restaurants;
    },
    {
      retry: 1,
    }
  );

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleNavigation = (restaurant: Restaurant) => {
    const mapsUrl = `https://maps.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`;
    window.open(mapsUrl, '_blank');
  };

  const getPriceColor = (price: string) => {
    switch (price) {
      case '$': return '#4CAF50';
      case '$$': return '#FF9800';
      case '$$$': return '#FF5722';
      case '$$$$': return '#E91E63';
      default: return '#757575';
    }
  };

  const getDistanceText = (distance: number) => {
    const miles = (distance * 0.000621371).toFixed(1);
    return `${miles} 英里`;
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6">正在搜索附近餐厅...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          餐厅搜索失败，请稍后重试
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        餐厅推荐
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        基于您的选择，为您推荐附近的最佳餐厅
      </Typography>

      {restaurants && (
        <Grid container spacing={3}>
          {restaurants.map((restaurant: Restaurant, index: number) => (
            <Grid item xs={12} md={6} key={restaurant.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    border: selectedRestaurant?.id === restaurant.id ? 2 : 1,
                    borderColor: selectedRestaurant?.id === restaurant.id ? 'primary.main' : 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleRestaurantSelect(restaurant)}
                >
                  <CardContent>
                    {/* Restaurant Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {restaurant.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={restaurant.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.rating} ({restaurant.reviewCount} 评价)
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="收藏">
                          <IconButton size="small">
                            <Favorite fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="分享">
                          <IconButton size="small">
                            <Share fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Categories and Price */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {restaurant.categories.map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                      <Chip
                        label={restaurant.price}
                        size="small"
                        sx={{
                          bgcolor: getPriceColor(restaurant.price),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>

                    {/* Address and Distance */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.address}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        距离: {getDistanceText(restaurant.distance)}
                      </Typography>
                    </Box>

                    {/* Food Match Score */}
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">菜品匹配度</Typography>
                        <Typography variant="h6" color="primary">
                          {restaurant.foodMatchScore}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {restaurant.recommendation}
                      </Typography>
                    </Paper>

                    {/* Restaurant Info */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      {restaurant.deliveryAvailable && (
                        <Chip
                          icon={<DeliveryDining />}
                          label="配送"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                      {restaurant.takeoutAvailable && (
                        <Chip
                          icon={<TakeoutDining />}
                          label="外带"
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                      <Chip
                        icon={<LocalParking />}
                        label={restaurant.parkingInfo}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {/* Estimated Cost */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        预计花费: {restaurant.estimatedCost}
                      </Typography>
                    </Box>

                    {/* Best Time to Visit */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <Schedule fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                        {restaurant.bestTimeToVisit}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Phone />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${restaurant.phone}`);
                        }}
                      >
                        电话
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Directions />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigation(restaurant);
                        }}
                      >
                        导航
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestaurantSelect(restaurant);
                        }}
                        size="small"
                        disabled={selectedRestaurant?.id === restaurant.id}
                      >
                        {selectedRestaurant?.id === restaurant.id ? '已选择' : '选择'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Selected Restaurant Actions */}
      {selectedRestaurant && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 4, mt: 4, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              您选择了: {selectedRestaurant.name}
            </Typography>
            <Typography sx={{ mb: 3 }}>
              准备前往这家餐厅吗？
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Directions />}
                onClick={() => handleNavigation(selectedRestaurant)}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                开始导航
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<Phone />}
                onClick={() => window.open(`tel:${selectedRestaurant.phone}`)}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                电话预订
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Container>
  );
};

export default RestaurantSearch;
