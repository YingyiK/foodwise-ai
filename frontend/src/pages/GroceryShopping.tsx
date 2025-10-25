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
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  LocalGroceryStore,
  ShoppingCart,
  LocationOn,
  Phone,
  Schedule,
  Directions,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  Timer,
  AttachMoney,
  LocalShipping,
  Store,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import axios from 'axios';

interface GroceryStore {
  id: string;
  name: string;
  rating: number;
  priceLevel: number;
  vicinity: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  phone: string;
  openingHours: string[];
  website: string;
  photos: string[];
  features: string[];
  estimatedCost: string;
  coverage: string;
  bestFor: string;
}

interface OnlineOption {
  platform: string;
  name: string;
  deliveryTime: string;
  deliveryFee: string;
  estimatedTotal: string;
  coverage: string;
  features: string[];
  actionUrl: string;
  partnerStores: string[];
}

interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  estimated: string;
}

interface ShoppingList {
  recipes: any[];
  items: {
    category: string;
    items: ShoppingItem[];
    count: number;
  }[];
  totalItems: number;
  estimatedCost: string;
  shoppingTips: string[];
  mealPrep: string[];
}

const GroceryShopping: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<GroceryStore | null>(null);
  const [selectedOnlineOption, setSelectedOnlineOption] = useState<OnlineOption | null>(null);
  const [activeTab, setActiveTab] = useState<'stores' | 'online'>('stores');

  // Mock user location
  const userLocation = {
    latitude: 37.7749,
    longitude: -122.4194
  };

  // Fetch shopping list
  const { data: shoppingList, isLoading: listLoading } = useQuery(
    'shoppingList',
    async () => {
      const response = await axios.post('/api/grocery/shopping-list', {
        foodRecommendations: [
          {
            id: 'food_001',
            name: 'Grilled Salmon with Quinoa',
            ingredients: ['salmon', 'quinoa', 'broccoli', 'olive oil', 'lemon']
          }
        ],
        userProfile: { location: userLocation }
      });
      return response.data.data;
    }
  );

  // Fetch grocery stores
  const { data: stores, isLoading: storesLoading } = useQuery(
    'groceryStores',
    async () => {
      const response = await axios.get('/api/grocery/stores', {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: 5000
        }
      });
      return response.data.data.stores;
    }
  );

  // Fetch online options
  const { data: onlineOptions, isLoading: onlineLoading } = useQuery(
    'onlineOptions',
    async () => {
      const response = await axios.post('/api/grocery/online-shopping', {
        shoppingList: shoppingList,
        userLocation: userLocation
      });
      return response.data.data.options;
    },
    {
      enabled: !!shoppingList
    }
  );

  const handleStoreSelect = (store: GroceryStore) => {
    setSelectedStore(store);
    setActiveTab('stores');
  };

  const handleOnlineSelect = (option: OnlineOption) => {
    setSelectedOnlineOption(option);
    setActiveTab('online');
  };

  const handleNavigation = (store: GroceryStore) => {
    const mapsUrl = `https://maps.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${store.coordinates.latitude},${store.coordinates.longitude}`;
    window.open(mapsUrl, '_blank');
  };

  const handleOnlineOrder = (option: OnlineOption) => {
    window.open(option.actionUrl, '_blank');
  };

  const getDistanceText = (distance: number) => {
    const miles = (distance * 0.000621371).toFixed(1);
    return `${miles} 英里`;
  };

  const getPriceLevelText = (level: number) => {
    return '$'.repeat(level);
  };

  if (listLoading || storesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6">正在生成购物清单...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        食材采购方案
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        为您生成智能购物清单和采购建议
      </Typography>

      {/* Shopping List */}
      {shoppingList && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 购物清单
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              总计 {shoppingList.totalItems} 项商品，预计花费 {shoppingList.estimatedCost}
            </Typography>

            <Grid container spacing={3}>
              {shoppingList.items.map((category, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {category.category} ({category.count} 项)
                    </Typography>
                    <List dense>
                      {category.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                          <ListItemIcon>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${item.name} - ${item.quantity} ${item.unit}`}
                            secondary={item.estimated}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Shopping Tips */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                💡 购物小贴士
              </Typography>
              <List>
                {shoppingList.shoppingTips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Store Options */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          推荐购买地点
        </Typography>

        {/* Tab Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant={activeTab === 'stores' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('stores')}
            startIcon={<Store />}
          >
            实体店
          </Button>
          <Button
            variant={activeTab === 'online' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('online')}
            startIcon={<LocalShipping />}
          >
            在线下单
          </Button>
        </Box>

        {/* Stores Tab */}
        {activeTab === 'stores' && stores && (
          <Grid container spacing={3}>
            {stores.map((store: GroceryStore, index: number) => (
              <Grid item xs={12} md={6} key={store.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      border: selectedStore?.id === store.id ? 2 : 1,
                      borderColor: selectedStore?.id === store.id ? 'primary.main' : 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleStoreSelect(store)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6" component="h3">
                          {store.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="收藏">
                            <IconButton size="small">
                              <Info fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {store.vicinity}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          距离: {getDistanceText(store.distance)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • 评分: {store.rating}/5
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • 价格: {getPriceLevelText(store.priceLevel)}
                        </Typography>
                      </Box>

                      <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">预计花费</Typography>
                          <Typography variant="h6" color="primary">
                            {store.estimatedCost}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          覆盖率: {store.coverage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          适合: {store.bestFor}
                        </Typography>
                      </Paper>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {store.features.map((feature) => (
                          <Chip
                            key={feature}
                            label={feature}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Phone />}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${store.phone}`);
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
                            handleNavigation(store);
                          }}
                        >
                          导航
                        </Button>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStoreSelect(store);
                          }}
                          size="small"
                          disabled={selectedStore?.id === store.id}
                        >
                          {selectedStore?.id === store.id ? '已选择' : '选择'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Online Options Tab */}
        {activeTab === 'online' && onlineOptions && (
          <Grid container spacing={3}>
            {onlineOptions.map((option: OnlineOption, index: number) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      border: selectedOnlineOption === option ? 2 : 1,
                      borderColor: selectedOnlineOption === option ? 'primary.main' : 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handleOnlineSelect(option)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6" component="h3">
                          {option.name}
                        </Typography>
                        <Chip
                          label={option.platform}
                          size="small"
                          color="secondary"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Timer fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {option.deliveryTime}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AttachMoney fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          配送费: {option.deliveryFee}
                        </Typography>
                      </Box>

                      <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">预计总价</Typography>
                          <Typography variant="h6" color="primary">
                            {option.estimatedTotal}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          覆盖率: {option.coverage}
                        </Typography>
                      </Paper>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {option.features.map((feature) => (
                          <Chip
                            key={feature}
                            label={feature}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOnlineOrder(option);
                          }}
                          size="small"
                          fullWidth
                        >
                          一键下单
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Selected Option Actions */}
      {(selectedStore || selectedOnlineOption) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 4, mt: 4, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              您选择了: {selectedStore?.name || selectedOnlineOption?.name}
            </Typography>
            <Typography sx={{ mb: 3 }}>
              准备开始采购吗？
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {selectedStore && (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Directions />}
                    onClick={() => handleNavigation(selectedStore)}
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                  >
                    导航前往
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Phone />}
                    onClick={() => window.open(`tel:${selectedStore.phone}`)}
                    sx={{ bgcolor: 'white', color: 'primary.main' }}
                  >
                    电话咨询
                  </Button>
                </>
              )}
              {selectedOnlineOption && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleOnlineOrder(selectedOnlineOption)}
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                >
                  立即下单
                </Button>
              )}
            </Box>
          </Paper>
        </motion.div>
      )}
    </Container>
  );
};

export default GroceryShopping;
