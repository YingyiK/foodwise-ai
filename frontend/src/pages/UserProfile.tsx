import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  Divider,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Add,
  Delete,
  LocalHospital,
  Favorite,
  Restaurant,
  LocalGroceryStore,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserProfile {
  userId: string;
  profile: {
    health_profile: {
      age: number;
      dietary_restrictions: string[];
      health_goals: string[];
      allergies: string[];
    };
    preference_profile: {
      cuisine_preferences: string[];
      taste_preferences: string[];
      disliked_foods: string[];
    };
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    preferences: {
      budget: string;
      delivery_preference: string;
      cooking_skill: string;
    };
  };
}

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newRestriction, setNewRestriction] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newDislikedFood, setNewDislikedFood] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: userProfile, isLoading } = useQuery(
    'userProfile',
    async () => {
      const response = await axios.get('/api/user/profile/12345');
      return response.data.data;
    }
  );

  // Update profile mutation
  const updateProfileMutation = useMutation(
    async (updatedProfile: UserProfile) => {
      const response = await axios.put(`/api/user/profile/${updatedProfile.userId}`, {
        profile: updatedProfile.profile
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
        toast.success('个人资料更新成功');
        setIsEditing(false);
      },
      onError: () => {
        toast.error('更新失败，请重试');
      }
    }
  );

  const handleSave = () => {
    if (userProfile) {
      updateProfileMutation.mutate(userProfile);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    queryClient.invalidateQueries('userProfile');
  };

  const addItem = (type: string, value: string) => {
    if (!value.trim()) return;
    
    if (userProfile) {
      const updatedProfile = { ...userProfile };
      
      switch (type) {
        case 'restriction':
          updatedProfile.profile.health_profile.dietary_restrictions.push(value);
          break;
        case 'allergy':
          updatedProfile.profile.health_profile.allergies.push(value);
          break;
        case 'cuisine':
          updatedProfile.profile.preference_profile.cuisine_preferences.push(value);
          break;
        case 'disliked':
          updatedProfile.profile.preference_profile.disliked_foods.push(value);
          break;
      }
      
      // Update local state immediately for better UX
      queryClient.setQueryData('userProfile', updatedProfile);
    }
  };

  const removeItem = (type: string, value: string) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile };
      
      switch (type) {
        case 'restriction':
          updatedProfile.profile.health_profile.dietary_restrictions = 
            updatedProfile.profile.health_profile.dietary_restrictions.filter(item => item !== value);
          break;
        case 'allergy':
          updatedProfile.profile.health_profile.allergies = 
            updatedProfile.profile.health_profile.allergies.filter(item => item !== value);
          break;
        case 'cuisine':
          updatedProfile.profile.preference_profile.cuisine_preferences = 
            updatedProfile.profile.preference_profile.cuisine_preferences.filter(item => item !== value);
          break;
        case 'disliked':
          updatedProfile.profile.preference_profile.disliked_foods = 
            updatedProfile.profile.preference_profile.disliked_foods.filter(item => item !== value);
          break;
      }
      
      queryClient.setQueryData('userProfile', updatedProfile);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6">加载个人资料中...</Typography>
        </Box>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">无法加载个人资料</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">个人资料</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                取消
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={updateProfileMutation.isLoading}
              >
                保存
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              编辑
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Health Profile */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocalHospital color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">健康档案</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="年龄"
                      type="number"
                      value={userProfile.profile.health_profile.age}
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          const updatedProfile = { ...userProfile };
                          updatedProfile.profile.health_profile.age = parseInt(e.target.value);
                          queryClient.setQueryData('userProfile', updatedProfile);
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      饮食限制
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {userProfile.profile.health_profile.dietary_restrictions.map((restriction, index) => (
                        <Chip
                          key={index}
                          label={restriction}
                          onDelete={isEditing ? () => removeItem('restriction', restriction) : undefined}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {isEditing && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="添加饮食限制"
                          value={newRestriction}
                          onChange={(e) => setNewRestriction(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addItem('restriction', newRestriction);
                              setNewRestriction('');
                            }
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => {
                            addItem('restriction', newRestriction);
                            setNewRestriction('');
                          }}
                        >
                          添加
                        </Button>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      过敏原
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {userProfile.profile.health_profile.allergies.map((allergy, index) => (
                        <Chip
                          key={index}
                          label={allergy}
                          onDelete={isEditing ? () => removeItem('allergy', allergy) : undefined}
                          color="error"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {isEditing && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="添加过敏原"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addItem('allergy', newAllergy);
                              setNewAllergy('');
                            }
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => {
                            addItem('allergy', newAllergy);
                            setNewAllergy('');
                          }}
                        >
                          添加
                        </Button>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      健康目标
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userProfile.profile.health_profile.health_goals.map((goal, index) => (
                        <Chip
                          key={index}
                          label={goal}
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Preference Profile */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Favorite color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">偏好设置</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      菜系偏好
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {userProfile.profile.preference_profile.cuisine_preferences.map((cuisine, index) => (
                        <Chip
                          key={index}
                          label={cuisine}
                          onDelete={isEditing ? () => removeItem('cuisine', cuisine) : undefined}
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {isEditing && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="添加菜系偏好"
                          value={newCuisine}
                          onChange={(e) => setNewCuisine(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addItem('cuisine', newCuisine);
                              setNewCuisine('');
                            }
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => {
                            addItem('cuisine', newCuisine);
                            setNewCuisine('');
                          }}
                        >
                          添加
                        </Button>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      口味偏好
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userProfile.profile.preference_profile.taste_preferences.map((taste, index) => (
                        <Chip
                          key={index}
                          label={taste}
                          color="info"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      不喜欢的食物
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {userProfile.profile.preference_profile.disliked_foods.map((food, index) => (
                        <Chip
                          key={index}
                          label={food}
                          onDelete={isEditing ? () => removeItem('disliked', food) : undefined}
                          color="warning"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {isEditing && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="添加不喜欢的食物"
                          value={newDislikedFood}
                          onChange={(e) => setNewDislikedFood(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addItem('disliked', newDislikedFood);
                              setNewDislikedFood('');
                            }
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => {
                            addItem('disliked', newDislikedFood);
                            setNewDislikedFood('');
                          }}
                        >
                          添加
                        </Button>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Location and Preferences */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  位置和偏好设置
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="地址"
                      value={userProfile.profile.location.address}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="预算偏好"
                      value={userProfile.profile.preferences.budget}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="烹饪技能"
                      value={userProfile.profile.preferences.cooking_skill}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
