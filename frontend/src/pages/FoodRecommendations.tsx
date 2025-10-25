import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Restaurant,
  LocalGroceryStore,
  LocalHospital,
  Star,
  Timer,
  Info,
  Favorite,
  Share,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

interface FoodRecommendation {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  cuisine: string;
  cookingMethod: string;
  mealType: string;
  healthTags: string[];
  overallScore: number;
  healthScore: number;
  preferenceScore: number;
  personalizedReasoning: string;
  cookingTips: string[];
  nutritionalInsights: {
    highlights: string[];
    considerations: string[];
    benefits: string[];
  };
  mealTiming: {
    recommended: string;
    reasoning: string;
  };
}

const FoodRecommendations: React.FC = () => {
  const location = useLocation();
  const [selectedFood, setSelectedFood] = useState<FoodRecommendation | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Get initial query from navigation state
  const initialQuery = location.state?.query || '我想吃健康的午餐';

  // Mock user profile - in real app, this would come from user context
  const userProfile = {
    health_profile: {
      age: 28,
      dietary_restrictions: ['无麸质'],
      health_goals: ['减重', '增肌'],
      allergies: ['坚果']
    },
    preference_profile: {
      cuisine_preferences: ['中餐', '日料'],
      taste_preferences: ['偏辣', '少油'],
      disliked_foods: ['香菜', '动物内脏']
    },
    location: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  };

  // Fetch food recommendations
  const { data: recommendations, isLoading, error } = useQuery(
    ['foodRecommendations', initialQuery],
    async () => {
      const response = await axios.post('/api/food/recommend', {
        userQuery: initialQuery,
        userProfile
      });
      return response.data.data.recommendations;
    },
    {
      enabled: !!initialQuery,
      retry: 1,
    }
  );

  const handleFoodSelect = (food: FoodRecommendation) => {
    setSelectedFood(food);
  };

  const handlePathChoice = (path: 'restaurant' | 'grocery') => {
    if (selectedFood) {
      if (path === 'restaurant') {
        // Navigate to restaurant recommendations
        console.log('Navigate to restaurants for:', selectedFood.name);
      } else {
        // Navigate to grocery shopping
        console.log('Navigate to grocery for:', selectedFood.name);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#f44336';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    return '一般';
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="h6">AI正在分析您的需求...</Typography>
          <Typography color="text.secondary">
            多智能体系统正在为您生成个性化推荐
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          推荐生成失败，请稍后重试
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        智能食品推荐
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        基于您的偏好和健康需求，为您推荐以下食品
      </Typography>

      {recommendations && (
        <Grid container spacing={3}>
          {recommendations.map((food: FoodRecommendation, index: number) => (
            <Grid item xs={12} md={6} key={food.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    border: selectedFood?.id === food.id ? 2 : 1,
                    borderColor: selectedFood?.id === food.id ? 'primary.main' : 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleFoodSelect(food)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {food.name}
                      </Typography>
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

                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {food.description}
                    </Typography>

                    {/* Score Display */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: getScoreColor(food.overallScore) }}>
                          {food.overallScore}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          综合评分
                        </Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">健康评分</Typography>
                          <Typography variant="body2">{food.healthScore}/100</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={food.healthScore}
                          sx={{ mb: 1, bgcolor: 'grey.200' }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">偏好匹配</Typography>
                          <Typography variant="body2">{food.preferenceScore}/100</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={food.preferenceScore}
                          sx={{ bgcolor: 'grey.200' }}
                        />
                      </Box>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {food.healthTags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    {/* Nutrition Info */}
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        营养成分 (每份)
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Typography variant="body2" color="text.secondary">
                            卡路里
                          </Typography>
                          <Typography variant="h6">{food.nutrition.calories}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2" color="text.secondary">
                            蛋白质
                          </Typography>
                          <Typography variant="h6">{food.nutrition.protein}g</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2" color="text.secondary">
                            碳水
                          </Typography>
                          <Typography variant="h6">{food.nutrition.carbs}g</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2" color="text.secondary">
                            脂肪
                          </Typography>
                          <Typography variant="h6">{food.nutrition.fat}g</Typography>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Personalized Reasoning */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {food.personalizedReasoning}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Info />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetails(showDetails === food.id ? null : food.id);
                        }}
                        size="small"
                      >
                        详情
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFoodSelect(food);
                        }}
                        size="small"
                        disabled={selectedFood?.id === food.id}
                      >
                        {selectedFood?.id === food.id ? '已选择' : '选择'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Selected Food Actions */}
      {selectedFood && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 4, mt: 4, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h5" gutterBottom>
              您选择了: {selectedFood.name}
            </Typography>
            <Typography sx={{ mb: 3 }}>
              接下来您想要做什么？
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Restaurant />}
                onClick={() => handlePathChoice('restaurant')}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                外出就餐
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<LocalGroceryStore />}
                onClick={() => handlePathChoice('grocery')}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                在家烹饪
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Container>
  );
};

export default FoodRecommendations;
