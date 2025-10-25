import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import { 
  Restaurant, 
  Dashboard,
  Person,
  CalendarToday,
  AutoAwesome,
  Search
} from '@mui/icons-material';

// Import new components
import SearchResults from './components/SearchResults';
import RecipePage from './components/RecipePage';
import SchedulePage from './components/SchedulePage';
import RecommendationCard from './components/RecommendationCard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#638d47', // Darker green theme
    },
    secondary: {
      main: '#53773b',
    },
    background: {
      default: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

// Sample data for demonstration
const sampleRecommendations = [
  {
    id: '1',
    name: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    description: 'Nutritious quinoa with fresh vegetables, olives, and feta cheese',
    healthScore: 92,
    preferenceScore: 88,
    calories: 420,
    cuisine: 'Mediterranean',
    tags: ['Healthy', 'Vegetarian', 'High Protein'],
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 2,
    ingredients: [
      { name: 'quinoa', amount: '1 cup', unit: 'rinsed' },
      { name: 'vegetable broth', amount: '2 cups', unit: 'low sodium' },
      { name: 'cherry tomatoes', amount: '1 cup', unit: 'halved' },
      { name: 'cucumber', amount: '1', unit: 'diced' },
      { name: 'kalamata olives', amount: '1/2 cup', unit: 'pitted' },
      { name: 'feta cheese', amount: '1/4 cup', unit: 'crumbled' },
      { name: 'olive oil', amount: '2 tbsp', unit: 'extra virgin' },
      { name: 'lemon juice', amount: '1 tbsp', unit: 'fresh' },
      { name: 'oregano', amount: '1 tsp', unit: 'dried' },
      { name: 'salt', amount: '1/2 tsp', unit: 'to taste' }
    ],
    instructions: [
      'Rinse quinoa thoroughly and cook in vegetable broth according to package directions.',
      'Let quinoa cool to room temperature.',
      'In a large bowl, combine cooked quinoa with tomatoes, cucumber, and olives.',
      'Whisk together olive oil, lemon juice, oregano, and salt to make dressing.',
      'Toss quinoa mixture with dressing.',
      'Top with crumbled feta cheese and serve immediately.'
    ]
  },
  {
    id: '2',
    name: 'Grilled Salmon with Asparagus',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    description: 'Fresh Atlantic salmon with seasonal asparagus and lemon herb butter',
    healthScore: 95,
    preferenceScore: 91,
    calories: 380,
    cuisine: 'American',
    tags: ['High Protein', 'Omega-3', 'Low Carb'],
    prepTime: '15 min',
    cookTime: '20 min',
    servings: 4,
    ingredients: [
      { name: 'salmon fillets', amount: '4 pieces', unit: '6-8 oz each' },
      { name: 'asparagus', amount: '1 bunch', unit: 'trimmed' },
      { name: 'olive oil', amount: '2 tbsp', unit: 'extra virgin' },
      { name: 'lemon juice', amount: '2 tbsp', unit: 'fresh' },
      { name: 'butter', amount: '2 tbsp', unit: 'unsalted' },
      { name: 'garlic', amount: '1 tsp', unit: 'minced' },
      { name: 'dill', amount: '1 tsp', unit: 'fresh, chopped' },
      { name: 'salt', amount: '1/2 tsp', unit: 'to taste' },
      { name: 'black pepper', amount: '1/4 tsp', unit: 'freshly ground' }
    ],
    instructions: [
      'Preheat grill to medium-high heat (400°F).',
      'Season salmon fillets with salt, pepper, and half of the lemon juice.',
      'Toss asparagus with olive oil, salt, and pepper.',
      'Grill salmon for 4-5 minutes per side, until fish flakes easily.',
      'Grill asparagus for 3-4 minutes, turning occasionally.',
      'In a small saucepan, melt butter and add garlic, remaining lemon juice, and dill.',
      'Serve salmon over asparagus, drizzled with lemon herb butter.'
    ]
  },
  {
    id: '3',
    name: 'Thai Green Curry',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    description: 'Authentic Thai curry with coconut milk, vegetables, and jasmine rice',
    healthScore: 78,
    preferenceScore: 85,
    calories: 520,
    cuisine: 'Thai',
    tags: ['Spicy', 'Vegetarian Option', 'Comfort Food'],
    prepTime: '20 min',
    cookTime: '25 min',
    servings: 4,
    ingredients: [
      { name: 'coconut milk', amount: '1 can', unit: 'full fat' },
      { name: 'green curry paste', amount: '2 tbsp', unit: 'Thai' },
      { name: 'onion', amount: '1', unit: 'sliced' },
      { name: 'bell pepper', amount: '1', unit: 'sliced' },
      { name: 'broccoli florets', amount: '1 cup', unit: 'fresh' },
      { name: 'snap peas', amount: '1 cup', unit: 'trimmed' },
      { name: 'garlic', amount: '2 cloves', unit: 'minced' },
      { name: 'fish sauce', amount: '1 tbsp', unit: 'or soy sauce' },
      { name: 'brown sugar', amount: '1 tbsp', unit: 'or palm sugar' },
      { name: 'lime juice', amount: '1 tsp', unit: 'fresh' },
      { name: 'basil leaves', amount: '1/4 cup', unit: 'Thai basil' },
      { name: 'jasmine rice', amount: '2 cups', unit: 'cooked' }
    ],
    instructions: [
      'Heat half the coconut milk in a large pot over medium heat.',
      'Add curry paste and cook for 2-3 minutes until fragrant.',
      'Add remaining coconut milk and bring to a simmer.',
      'Add onion, bell pepper, and broccoli. Cook for 5 minutes.',
      'Add snap peas and garlic. Cook for 3 more minutes.',
      'Stir in fish sauce, brown sugar, and lime juice.',
      'Simmer for 5 minutes until vegetables are tender.',
      'Garnish with basil leaves and serve over jasmine rice.'
    ]
  }
];


// Navigation Component
function Navigation({ currentPage, onPageChange }) {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderBottom: '1px solid #E5E7EB', zIndex: 1000 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 4 }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            backgroundColor: '#638d47', 
            borderRadius: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mr: 2
          }}>
            <AutoAwesome sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#1F2937' }}>
              SmartMeal
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
              Smart Meal Planning
            </Typography>
          </Box>
        </Box>
        
        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Button
            onClick={() => onPageChange('home')}
            sx={{ 
              color: currentPage === 'home' ? '#638d47' : '#6B7280',
              fontWeight: currentPage === 'home' ? 600 : 400,
              textTransform: 'none',
              borderBottom: currentPage === 'home' ? '2px solid #638d47' : 'none',
              borderRadius: 0,
              px: 0,
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => onPageChange('recommendations')}
            sx={{ 
              color: currentPage === 'recommendations' ? '#638d47' : '#6B7280',
              fontWeight: currentPage === 'recommendations' ? 600 : 400,
              textTransform: 'none',
              borderBottom: currentPage === 'recommendations' ? '2px solid #638d47' : 'none',
              borderRadius: 0,
              px: 0,
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Recommendations
          </Button>
          <Button
            onClick={() => onPageChange('schedule')}
            sx={{ 
              color: currentPage === 'schedule' ? '#638d47' : '#6B7280',
              fontWeight: currentPage === 'schedule' ? 600 : 400,
              textTransform: 'none',
              borderBottom: currentPage === 'schedule' ? '2px solid #638d47' : 'none',
              borderRadius: 0,
              px: 0,
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Schedule
          </Button>
          <Button
            onClick={() => onPageChange('profile')}
            sx={{ 
              color: currentPage === 'profile' ? '#638d47' : '#6B7280',
              fontWeight: currentPage === 'profile' ? 600 : 400,
              textTransform: 'none',
              borderBottom: currentPage === 'profile' ? '2px solid #638d47' : 'none',
              borderRadius: 0,
              px: 0,
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Profile
          </Button>
        </Box>

        {/* User Avatar and Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Search sx={{ color: '#6B7280', cursor: 'pointer' }} />
          <Avatar sx={{ bgcolor: '#638d47', width: 40, height: 40 }}>
            JD
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}



function HomePage({ onSearch, onRecipeSelect, onAddToSchedule }) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        px: 4,
        background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)'
      }}>
        <Container maxWidth="md">
          {/* AI-Powered Badge */}
          <Chip
            icon={<AutoAwesome sx={{ fontSize: 16 }} />}
            label="AI-Powered Meal Planning"
            sx={{
              backgroundColor: '#F3F4F6',
              color: '#374151',
              border: '1px solid #D1D5DB',
              borderRadius: 3,
              px: 2,
              py: 1,
              mb: 4,
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          />

          {/* Main Title */}
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              color: '#1F2937',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Welcome to SmartMeal
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#6B7280',
              fontWeight: 400,
              mb: 4,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Your Personal AI Nutrition Assistant
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#4B5563',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.125rem',
              lineHeight: 1.6
            }}
          >
            Discover personalized recipe recommendations tailored to your health goals, 
            dietary preferences, and taste profile. Plan your entire week, generate smart 
            shopping lists, and achieve your wellness goals with SmartMeal.
          </Typography>

          {/* Call-to-Action Buttons */}
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              onClick={() => onSearch('AI recommendations')}
              sx={{
                backgroundColor: '#638d47',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 4px 14px 0 rgba(99, 141, 71, 0.3)',
                '&:hover': {
                  backgroundColor: '#53773b',
                  boxShadow: '0 6px 20px 0 rgba(99, 141, 71, 0.4)',
                }
              }}
            >
              Get Recommendations
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => onSearch('meal planning')}
              sx={{
                borderColor: '#638d47',
                color: '#638d47',
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#53773b',
                  backgroundColor: 'rgba(99, 141, 71, 0.04)',
                  borderWidth: 2,
                }
              }}
            >
              Plan Your Week
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 6, backgroundColor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: '#1F2937',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                1000+
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#6B7280',
                  fontWeight: 500
                }}
              >
                Recipes
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: '#1F2937',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                95%
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#6B7280',
                  fontWeight: 500
                }}
              >
                Match Rate
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: '#1F2937',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                24/7
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#6B7280',
                  fontWeight: 500
                }}
              >
                AI Support
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Recommendations Section */}
      <Box sx={{ py: 8, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center',
              color: '#1F2937',
              fontWeight: 700,
              mb: 6
            }}
          >
            Featured Recipes
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 3,
            px: 2
          }}>
            {sampleRecommendations.map((food) => (
              <RecommendationCard
                key={food.id}
                food={food}
                onFavorite={(id) => console.log('Favorite:', id)}
                onFindRestaurant={(id) => console.log('Find restaurant:', id)}
                onRecipeSelect={onRecipeSelect}
                onAddToSchedule={onAddToSchedule}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your personalized food insights and recommendations.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your nutritional goals and health improvements.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your recent food searches and recommendations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function RecommendationsPage({ onRecipeSelect, onAddToSchedule }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState(['Italian']);
  const [selectedDiets, setSelectedDiets] = useState(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein', 'low-carb', 'keto-friendly']);
  const [selectedHealthGoals, setSelectedHealthGoals] = useState([]);
  const [recentSearches] = useState([
    'High protein breakfast',
    'Vegan dinner', 
    'Low carb lunch'
  ]);

  const cuisineTypes = ['Italian', 'American', 'Japanese', 'Indian', 'Mediterranean', 'Mexican', 'Chinese'];
  const dietaryPreferences = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein', 'low-carb', 'keto-friendly'];
  const healthGoals = ['Weight Loss', 'Muscle Gain', 'Heart Health', 'Energy Boost', 'Better Sleep'];

  const handleCuisineToggle = (cuisine) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleDietToggle = (diet) => {
    setSelectedDiets(prev => 
      prev.includes(diet) 
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const handleHealthGoalToggle = (goal) => {
    setSelectedHealthGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', gap: 4, p: 4 }}>
      {/* Left Side - Filter Box */}
      <Box sx={{ 
        width: 400,
        backgroundColor: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        p: 4,
        height: 'fit-content',
        position: 'sticky',
        top: 100
      }}>
        {/* Search Section */}
        <Box sx={{ mb: 4 }}>
          {/* Search Box */}
          <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <Search sx={{ 
                position: 'absolute', 
                left: 12, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6B7280',
                fontSize: 20
              }} />
              <input
                type="text"
                placeholder="Search recipes by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#F9FAFB'
                }}
              />
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1F2937',
                color: 'white',
                minWidth: '80px',
                px: 3,
                '&:hover': { backgroundColor: '#374151' }
              }}
            >
              Search
            </Button>
          </Box>

          {/* AI-Powered Recommendations Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1F2937' }}>
              AI-Powered Recommendations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              8 recipes match your preferences
            </Typography>
          </Box>

          {/* Recent Searches */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#374151' }}>
              Recent searches
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recentSearches.map((search, index) => (
                <Chip
                  key={index}
                  label={search}
                  onClick={() => setSearchQuery(search)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#000000',
                    borderColor: '#D1D5DB',
                    backgroundColor: '#F9FAFB',
                    '&:hover': { backgroundColor: '#F3F4F6' }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Filters */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center' }}>
              Filters
            </Typography>

            {/* Cuisine Type */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500, color: '#6B7280' }}>
                Cuisine Type
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cuisineTypes.map((cuisine) => (
                  <Chip
                    key={cuisine}
                    label={cuisine}
                    onClick={() => handleCuisineToggle(cuisine)}
                    variant={selectedCuisines.includes(cuisine) ? "filled" : "outlined"}
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      backgroundColor: selectedCuisines.includes(cuisine) ? '#638d47' : '#F9FAFB',
                      color: selectedCuisines.includes(cuisine) ? 'white' : '#000000',
                      borderColor: '#D1D5DB',
                      '&:hover': { backgroundColor: selectedCuisines.includes(cuisine) ? '#53773b' : '#F3F4F6' }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Dietary Preferences */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500, color: '#6B7280' }}>
                Dietary Preferences
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {dietaryPreferences.map((diet) => (
                  <Chip
                    key={diet}
                    label={diet}
                    onClick={() => handleDietToggle(diet)}
                    variant={selectedDiets.includes(diet) ? "filled" : "outlined"}
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      backgroundColor: selectedDiets.includes(diet) ? '#638d47' : '#F9FAFB',
                      color: selectedDiets.includes(diet) ? 'white' : '#000000',
                      borderColor: '#D1D5DB',
                      '&:hover': { backgroundColor: selectedDiets.includes(diet) ? '#53773b' : '#F3F4F6' }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Health Goals */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500, color: '#6B7280' }}>
                Health Goals
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {healthGoals.map((goal) => (
                  <Chip
                    key={goal}
                    label={goal}
                    onClick={() => handleHealthGoalToggle(goal)}
                    variant={selectedHealthGoals.includes(goal) ? "filled" : "outlined"}
                    size="small"
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      backgroundColor: selectedHealthGoals.includes(goal) ? '#638d47' : '#F9FAFB',
                      color: selectedHealthGoals.includes(goal) ? 'white' : '#000000',
                      borderColor: '#D1D5DB',
                      '&:hover': { backgroundColor: selectedHealthGoals.includes(goal) ? '#53773b' : '#F3F4F6' }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Recipe Cards Section */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 3
        }}>
          {sampleRecommendations.map((food) => (
            <RecommendationCard
              key={food.id}
              food={food}
              onFavorite={(id) => console.log('Favorite:', id)}
              onFindRestaurant={(id) => console.log('Find restaurant:', id)}
              onRecipeSelect={onRecipeSelect}
              onAddToSchedule={onAddToSchedule}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ProfilePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your health profile and dietary preferences.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your health information and dietary restrictions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set your taste preferences and cuisine preferences.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [scheduleList, setScheduleList] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('foodwise-schedule-list');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
    setCurrentPage('search-results');
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setCurrentPage('recipe');
  };

  const handleBackToSearch = () => {
    setCurrentPage('search-results');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSearchQuery('');
    setSelectedRecipe(null);
  };

  const handleAddToFavorites = (recipeId) => {
    console.log('Added to favorites:', recipeId);
    // Here you would implement the actual favorite functionality
  };

  const handleShare = (recipe) => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href,
      }).catch((error) => {
        // Handle share cancellation or errors gracefully
        if (error.name === 'AbortError') {
          // User cancelled the share dialog - this is normal, don't show error
          console.log('Share cancelled by user');
        } else {
          console.error('Share failed:', error);
          // Fallback to clipboard
          navigator.clipboard.writeText(window.location.href);
          alert('Recipe link copied to clipboard!');
        }
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  const handlePrint = (recipe) => {
    window.print();
  };

  const handleAddToSchedule = (recipe) => {
    console.log('Added to schedule:', recipe);
    const newScheduleList = [...scheduleList, recipe];
    setScheduleList(newScheduleList);
    // Save to localStorage
    localStorage.setItem('foodwise-schedule-list', JSON.stringify(newScheduleList));
    alert(`${recipe.name} added to schedule list!`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'recommendations':
        return <RecommendationsPage onRecipeSelect={handleRecipeSelect} onAddToSchedule={handleAddToSchedule} />;
      case 'schedule':
        console.log('Rendering Schedule page with scheduleList:', scheduleList);
        return <SchedulePage scheduleList={scheduleList} setScheduleList={setScheduleList} />;
      case 'profile':
        return <ProfilePage />;
      case 'search-results':
        return (
          <SearchResults 
            searchQuery={searchQuery}
            onRecipeSelect={handleRecipeSelect}
            onAddToSchedule={handleAddToSchedule}
            onBack={handleBackToHome}
          />
        );
      case 'recipe':
        return (
          <RecipePage 
            recipe={selectedRecipe}
            onBack={handleBackToSearch}
            onAddToFavorites={handleAddToFavorites}
            onShare={handleShare}
            onPrint={handlePrint}
            onAddToSchedule={handleAddToSchedule}
          />
        );
      default:
        return <HomePage onSearch={handleSearch} onRecipeSelect={handleRecipeSelect} onAddToSchedule={handleAddToSchedule} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <Box sx={{ pt: 8 }}>
        {renderPage()}
      </Box>
    </ThemeProvider>
  );
}

export default App;