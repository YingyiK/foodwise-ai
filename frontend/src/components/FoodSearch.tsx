import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  Restaurant,
  LocalHospital,
  Favorite,
} from '@mui/icons-material';

interface FoodSearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onSearch, loading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Healthy breakfast options',
    'Low-carb dinner ideas',
    'Vegetarian lunch',
    'High protein snacks',
  ]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      // Add to recent searches
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev.slice(0, 3)]);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Card elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Search sx={{ mr: 1, color: '#2E7D32' }} />
          What would you like to eat?
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for food, cuisine, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            sx={{
              backgroundColor: '#2E7D32',
              borderRadius: 2,
              px: 4,
              '&:hover': {
                backgroundColor: '#1B5E20',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>

        {/* Recent Searches */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Recent Searches:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {recentSearches.map((search, index) => (
              <Chip
                key={index}
                label={search}
                onClick={() => setSearchQuery(search)}
                variant="outlined"
                size="small"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>

        {/* Quick Search Categories */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Quick Categories:
          </Typography>
          <Grid container spacing={1}>
            {[
              { label: 'Healthy', icon: <LocalHospital />, color: '#4CAF50' },
              { label: 'Popular', icon: <Favorite />, color: '#F44336' },
              { label: 'Restaurants', icon: <Restaurant />, color: '#FF9800' },
            ].map((category) => (
              <Grid item key={category.label}>
                <Chip
                  icon={category.icon}
                  label={category.label}
                  onClick={() => setSearchQuery(category.label)}
                  sx={{
                    backgroundColor: category.color,
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: category.color,
                      opacity: 0.8,
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default FoodSearch;
