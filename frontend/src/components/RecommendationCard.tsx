import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, IconButton } from '@mui/material';
import { LocalHospital, Star, Restaurant, CalendarToday, LocationOn, Favorite, FavoriteBorder } from '@mui/icons-material';

function RecommendationCard({ food, onFavorite, onFindRestaurant, onRecipeSelect, onAddToSchedule }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getHealthColor = (score) => {
    if (score >= 85) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const getPreferenceColor = (score) => {
    if (score >= 85) return '#2196F3';
    if (score >= 70) return '#FF9800';
    return '#9E9E9E';
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '480px',
        width: '280px',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }
      }}
      onClick={() => onRecipeSelect(food)}
    >
      {/* Image Section - 60% height */}
      <Box sx={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        <img
          src={food.image}
          alt={food.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        
        {/* Wishlist Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'white' }
          }}
        >
          {isWishlisted ? <Favorite sx={{ color: '#F44336' }} /> : <FavoriteBorder />}
        </IconButton>

        {/* Health Score Badge */}
        <Chip
          label={`Health: ${food.healthScore}`}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: getHealthColor(food.healthScore),
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>

      {/* Content Section - 40% height */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h6" component="h3" sx={{ 
          mb: 1, 
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {food.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2, 
          flexGrow: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {food.description}
        </Typography>

        {/* Scores Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star sx={{ color: getPreferenceColor(food.preferenceScore), fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: getPreferenceColor(food.preferenceScore), fontWeight: 'bold' }}>
              Match: {food.preferenceScore}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {food.calories} cal
          </Typography>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          <Chip label={food.cuisine} size="small" variant="outlined" />
          {food.tags.slice(0, 1).map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="secondary" />
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<CalendarToday />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToSchedule(food);
            }}
            sx={{ 
              flex: 1, 
              backgroundColor: '#638d47',
              '&:hover': { backgroundColor: '#53773b' }
            }}
          >
            Schedule
          </Button>
          <Button
            variant="outlined"
            startIcon={<LocationOn />}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.google.com/search?q=${food.name}+restaurant`, '_blank');
            }}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            Find
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RecommendationCard;
