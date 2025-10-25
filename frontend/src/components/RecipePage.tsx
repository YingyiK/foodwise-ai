import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Rating,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  Print,
  Restaurant,
  Timer,
  People,
  LocalFireDepartment
} from '@mui/icons-material';

const RecipePage = ({ recipe, onBack, onAddToFavorites, onShare, onPrint, onAddToSchedule }) => {
  if (!recipe) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Recipe Not Found</Typography>
        <Button variant="contained" onClick={onBack} startIcon={<ArrowBack />}>
          Back to Search
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="#" onClick={onBack}>
          Search Results
        </Link>
        <Typography color="text.primary">{recipe.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Recipe Image and Basic Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height="400"
              image={recipe.image}
              alt={recipe.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {recipe.name}
                </Typography>
                <Box>
                  <IconButton onClick={() => onAddToFavorites(recipe.id)}>
                    {recipe.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton onClick={() => onShare(recipe)}>
                    <Share />
                  </IconButton>
                  <IconButton onClick={() => onPrint(recipe)}>
                    <Print />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {recipe.description}
              </Typography>

              {/* Recipe Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Timer color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.prepTime}
                    </Typography>
                    <Typography variant="caption">Prep</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Timer color="secondary" />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.cookTime}
                    </Typography>
                    <Typography variant="caption">Cook</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <People color="success" />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.servings}
                    </Typography>
                    <Typography variant="caption">Servings</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocalFireDepartment color="warning" />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.calories}
                    </Typography>
                    <Typography variant="caption">Calories</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Health Score */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2">Health Score:</Typography>
                <Rating value={recipe.healthScore / 20} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {recipe.healthScore}/100
                </Typography>
              </Box>

              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {recipe.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" color="primary" />
                ))}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Restaurant />}
                  onClick={() => onAddToSchedule(recipe)}
                  sx={{ flex: 1, backgroundColor: '#2E7D32' }}
                >
                  Schedule This Recipe
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Restaurant />}
                  onClick={() => window.open(`https://www.google.com/search?q=${recipe.name}+restaurant`, '_blank')}
                  sx={{ flex: 1 }}
                >
                  Find Restaurant
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ingredients and Instructions */}
        <Grid item xs={12} md={6}>
          {/* Ingredients */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List dense>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                      secondary={ingredient.notes}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((step, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                backgroundColor: '#2E7D32',
                                color: 'white',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                mt: 0.5
                              }}
                            >
                              {index + 1}
                            </Typography>
                            <Typography variant="body1">
                              {step}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recipe.instructions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipePage;
