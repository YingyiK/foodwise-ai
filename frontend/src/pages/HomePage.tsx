import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search,
  Restaurant,
  LocalGroceryStore,
  LocalHospital,
  TrendingUp,
  Star,
  LocationOn,
  Timer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/recommendations', { 
        state: { query: searchQuery } 
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const features = [
    {
      icon: <Restaurant sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '智能推荐',
      description: '基于AI的个性化食品推荐',
      color: '#4CAF50',
    },
    {
      icon: <LocalHospital sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: '健康分析',
      description: '专业的营养评估和健康建议',
      color: '#FF9800',
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '餐厅推荐',
      description: '结合Yelp数据的餐厅推荐',
      color: '#2196F3',
    },
    {
      icon: <LocalGroceryStore sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: '食材采购',
      description: '一站式食材采购方案',
      color: '#9C27B0',
    },
  ];

  const popularSearches = [
    '健康午餐',
    '低卡晚餐',
    '高蛋白早餐',
    '素食料理',
    '地中海菜',
    '减脂餐',
  ];

  const stats = [
    { label: '用户数量', value: '10,000+', icon: <TrendingUp /> },
    { label: '推荐准确率', value: '89%', icon: <Star /> },
    { label: '平均响应时间', value: '2.1s', icon: <Timer /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" component="h1" gutterBottom>
              🍎 FoodWise AI
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              智能饮食决策平台 - 从"吃什么"到"去哪吃"再到"去哪买"
            </Typography>
            
            <Paper
              sx={{
                p: 2,
                maxWidth: 600,
                mx: 'auto',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: 'text.primary',
              }}
            >
              <TextField
                fullWidth
                placeholder="我想吃健康的午餐..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        搜索
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
              {popularSearches.map((search) => (
                <Chip
                  key={search}
                  label={search}
                  onClick={() => setSearchQuery(search)}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                />
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          核心功能
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          多智能体AI系统为您提供完整的饮食决策支持
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" gutterBottom>
            平台数据
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" color="primary" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          开始您的智能饮食之旅
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          立即体验AI驱动的个性化饮食推荐
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/recommendations')}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2,
          }}
        >
          开始推荐
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage;
