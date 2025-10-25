import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Pagination,
  Alert
} from '@mui/material';
import RecommendationCard from './RecommendationCard';

const SearchResults = ({ searchQuery, onRecipeSelect, onAddToSchedule, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sample search results based on query
  const getSearchResults = (query) => {
    const allRecipes = [
      {
        id: '1',
        name: 'Grilled Salmon with Asparagus',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        description: 'Fresh Atlantic salmon with seasonal asparagus and lemon herb butter',
        healthScore: 95,
        preferenceScore: 88,
        rating: 4.8,
        prepTime: '15 min',
        cookTime: '20 min',
        servings: 4,
        calories: 380,
        cuisine: 'American',
        tags: ['High Protein', 'Omega-3', 'Low Carb', 'Healthy'],
        ingredients: [
          { amount: '4', unit: 'pieces', name: 'salmon fillets', notes: '6-8 oz each' },
          { amount: '1', unit: 'bunch', name: 'asparagus', notes: 'trimmed' },
          { amount: '2', unit: 'tbsp', name: 'olive oil', notes: 'extra virgin' },
          { amount: '2', unit: 'tbsp', name: 'lemon juice', notes: 'fresh' },
          { amount: '2', unit: 'tbsp', name: 'butter', notes: 'unsalted' },
          { amount: '1', unit: 'tsp', name: 'garlic', notes: 'minced' },
          { amount: '1', unit: 'tsp', name: 'dill', notes: 'fresh, chopped' },
          { amount: '1/2', unit: 'tsp', name: 'salt', notes: 'to taste' },
          { amount: '1/4', unit: 'tsp', name: 'black pepper', notes: 'freshly ground' }
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
        id: '2',
        name: 'Mediterranean Quinoa Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        description: 'Nutritious quinoa with fresh vegetables, olives, and feta cheese',
        healthScore: 92,
        preferenceScore: 85,
        rating: 4.6,
        prepTime: '10 min',
        cookTime: '15 min',
        servings: 2,
        calories: 420,
        cuisine: 'Mediterranean',
        tags: ['Healthy', 'Vegetarian', 'High Protein', 'Gluten-Free'],
        ingredients: [
          { amount: '1', unit: 'cup', name: 'quinoa', notes: 'rinsed' },
          { amount: '2', unit: 'cups', name: 'vegetable broth', notes: 'low sodium' },
          { amount: '1', unit: 'cup', name: 'cherry tomatoes', notes: 'halved' },
          { amount: '1', unit: 'cucumber', name: 'cucumber', notes: 'diced' },
          { amount: '1/2', unit: 'cup', name: 'kalamata olives', notes: 'pitted' },
          { amount: '1/4', unit: 'cup', name: 'feta cheese', notes: 'crumbled' },
          { amount: '2', unit: 'tbsp', name: 'olive oil', notes: 'extra virgin' },
          { amount: '1', unit: 'tbsp', name: 'lemon juice', notes: 'fresh' },
          { amount: '1', unit: 'tsp', name: 'oregano', notes: 'dried' },
          { amount: '1/2', unit: 'tsp', name: 'salt', notes: 'to taste' }
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
        id: '3',
        name: 'Thai Green Curry',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
        description: 'Authentic Thai curry with coconut milk, vegetables, and jasmine rice',
        healthScore: 78,
        preferenceScore: 82,
        rating: 4.7,
        prepTime: '20 min',
        cookTime: '25 min',
        servings: 4,
        calories: 520,
        cuisine: 'Thai',
        tags: ['Spicy', 'Vegetarian Option', 'Comfort Food', 'Asian'],
        ingredients: [
          { amount: '1', unit: 'can', name: 'coconut milk', notes: 'full fat' },
          { amount: '2', unit: 'tbsp', name: 'green curry paste', notes: 'Thai' },
          { amount: '1', unit: 'onion', name: 'onion', notes: 'sliced' },
          { amount: '1', unit: 'bell pepper', name: 'bell pepper', notes: 'sliced' },
          { amount: '1', unit: 'cup', name: 'broccoli florets', notes: 'fresh' },
          { amount: '1', unit: 'cup', name: 'snap peas', notes: 'trimmed' },
          { amount: '2', unit: 'cloves', name: 'garlic', notes: 'minced' },
          { amount: '1', unit: 'tbsp', name: 'fish sauce', notes: 'or soy sauce' },
          { amount: '1', unit: 'tbsp', name: 'brown sugar', notes: 'or palm sugar' },
          { amount: '1', unit: 'tsp', name: 'lime juice', notes: 'fresh' },
          { amount: '1/4', unit: 'cup', name: 'basil leaves', notes: 'Thai basil' },
          { amount: '2', unit: 'cups', name: 'jasmine rice', notes: 'cooked' }
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

    // Filter recipes based on search query
    const searchTerm = query.toLowerCase();
    return allRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      recipe.cuisine.toLowerCase().includes(searchTerm)
    );
  };

  const searchResults = getSearchResults(searchQuery);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResults = searchResults.slice(startIndex, startIndex + itemsPerPage);


  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
          sx={{ mb: 2 }}
        >
          ← Back to Search
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Search Results for "{searchQuery}"
        </Typography>
        
        {searchResults.length > 0 ? (
          <Typography variant="body1" color="text.secondary">
            Found {searchResults.length} recipe{searchResults.length !== 1 ? 's' : ''}
          </Typography>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            No recipes found for "{searchQuery}". Try different keywords like "healthy", "vegetarian", or "quick".
          </Alert>
        )}
      </Box>

      {/* Search Results Grid */}
      {searchResults.length > 0 && (
        <>
          <Grid container spacing={3}>
            {currentResults.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <RecommendationCard
                  food={recipe}
                  onFavorite={() => {}}
                  onFindRestaurant={(id) => console.log('Find restaurant:', id)}
                  onRecipeSelect={onRecipeSelect}
                  onAddToSchedule={onAddToSchedule}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchResults;
