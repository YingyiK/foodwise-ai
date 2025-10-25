import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Restaurant,
  LocalGroceryStore,
  LocalHospital,
  Star,
  Timer,
  AttachMoney,
  Favorite,
  History,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard: React.FC = () => {
  // Fetch user statistics
  const { data: stats, isLoading: statsLoading } = useQuery(
    'userStats',
    async () => {
      const response = await axios.get('/api/user/history/12345', {
        params: { limit: 50 }
      });
      return response.data.data;
    }
  );

  // Fetch agent performance
  const { data: agentPerformance } = useQuery(
    'agentPerformance',
    async () => {
      const response = await axios.get('/api/agents/performance');
      return response.data.data;
    }
  );

  // Mock data for charts
  const weeklyActivityData = [
    { name: '周一', recommendations: 3, restaurants: 2, grocery: 1 },
    { name: '周二', recommendations: 2, restaurants: 1, grocery: 2 },
    { name: '周三', recommendations: 4, restaurants: 3, grocery: 1 },
    { name: '周四', recommendations: 3, restaurants: 2, grocery: 2 },
    { name: '周五', recommendations: 5, restaurants: 4, grocery: 3 },
    { name: '周六', recommendations: 4, restaurants: 3, grocery: 2 },
    { name: '周日', recommendations: 2, restaurants: 1, grocery: 1 },
  ];

  const cuisinePreferences = [
    { name: '中餐', value: 35, color: '#4CAF50' },
    { name: '日料', value: 25, color: '#FF9800' },
    { name: '健康', value: 20, color: '#2196F3' },
    { name: '地中海', value: 15, color: '#9C27B0' },
    { name: '其他', value: 5, color: '#607D8B' },
  ];

  const healthGoals = [
    { name: '减重', value: 40, color: '#4CAF50' },
    { name: '增肌', value: 30, color: '#FF9800' },
    { name: '健康饮食', value: 20, color: '#2196F3' },
    { name: '其他', value: 10, color: '#9C27B0' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'recommendation',
      title: 'Grilled Salmon with Quinoa',
      rating: 5,
      date: '2024-01-15',
      icon: <Restaurant />,
      color: '#4CAF50',
    },
    {
      id: 2,
      type: 'restaurant',
      title: 'The Healthy Kitchen',
      rating: 4,
      date: '2024-01-14',
      icon: <Restaurant />,
      color: '#FF9800',
    },
    {
      id: 3,
      type: 'grocery',
      title: 'Whole Foods Market',
      rating: 5,
      date: '2024-01-13',
      icon: <LocalGroceryStore />,
      color: '#2196F3',
    },
  ];

  const quickStats = [
    {
      title: '本月推荐',
      value: '24',
      change: '+12%',
      icon: <TrendingUp />,
      color: '#4CAF50',
    },
    {
      title: '访问餐厅',
      value: '8',
      change: '+25%',
      icon: <Restaurant />,
      color: '#FF9800',
    },
    {
      title: '购物次数',
      value: '12',
      change: '+8%',
      icon: <LocalGroceryStore />,
      color: '#2196F3',
    },
    {
      title: '健康评分',
      value: '89',
      change: '+5%',
      icon: <LocalHospital />,
      color: '#9C27B0',
    },
  ];

  if (statsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6">加载仪表板中...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        我的仪表板
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        您的智能饮食决策数据概览
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" color="primary">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="success.main">
                    {stat.change} 较上月
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Weekly Activity Chart */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  本周活动趋势
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="recommendations"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      name="推荐"
                    />
                    <Line
                      type="monotone"
                      dataKey="restaurants"
                      stroke="#FF9800"
                      strokeWidth={2}
                      name="餐厅"
                    />
                    <Line
                      type="monotone"
                      dataKey="grocery"
                      stroke="#2196F3"
                      strokeWidth={2}
                      name="购物"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Cuisine Preferences */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  菜系偏好
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={cuisinePreferences}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {cuisinePreferences.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Health Goals */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  健康目标分布
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={healthGoals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  最近活动
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={activity.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: activity.color, width: 32, height: 32 }}>
                          {activity.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star fontSize="small" color="warning" />
                            <Typography variant="body2" component="span">
                              {activity.rating}/5
                            </Typography>
                            <Typography variant="body2" component="span" color="text.secondary">
                              • {activity.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* AI Agent Performance */}
        {agentPerformance && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI 智能体性能
                  </Typography>
                  <Grid container spacing={3}>
                    {Object.entries(agentPerformance.agents).map(([agentName, performance]: [string, any]) => (
                      <Grid item xs={12} sm={6} md={3} key={agentName}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {agentName}
                          </Typography>
                          <Typography variant="h4" color="primary" gutterBottom>
                            {performance.accuracy}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            准确率
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={performance.accuracy}
                            sx={{ mt: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            响应时间: {performance.responseTime}s
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
