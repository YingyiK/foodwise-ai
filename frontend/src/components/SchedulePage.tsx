import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Delete,
  LocalGroceryStore,
  Print,
  DragIndicator
} from '@mui/icons-material';

const SchedulePage = ({ scheduleList, setScheduleList }) => {
  console.log('SchedulePage rendered with scheduleList:', scheduleList);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [schedule, setSchedule] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('foodwise-schedule');
    return saved ? JSON.parse(saved) : {};
  });
  const [shoppingList, setShoppingList] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Common ingredients to filter out
  const commonIngredients = [
    'salt', 'pepper', 'black pepper', 'white pepper', 'garlic powder', 'onion powder',
    'paprika', 'cumin', 'oregano', 'basil', 'thyme', 'rosemary', 'parsley',
    'olive oil', 'vegetable oil', 'butter', 'sugar', 'brown sugar', 'flour',
    'baking powder', 'baking soda', 'vanilla extract', 'lemon juice', 'lime juice',
    'vinegar', 'soy sauce', 'worcestershire sauce', 'hot sauce', 'ketchup',
    'mustard', 'mayonnaise', 'honey', 'maple syrup', 'cinnamon', 'nutmeg',
    'ginger', 'garlic', 'onion', 'shallot', 'chives', 'cilantro', 'mint'
  ];

  useEffect(() => {
    updateShoppingList();
  }, [schedule]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddRecipe = () => {
    if (selectedDate && selectedMeal && selectedRecipe) {
      const key = `${selectedDate}-${selectedMeal}`;
      const newSchedule = {
        ...schedule,
        [key]: selectedRecipe
      };
      setSchedule(newSchedule);
      localStorage.setItem('foodwise-schedule', JSON.stringify(newSchedule));
      setOpenDialog(false);
      setSelectedDate('');
      setSelectedMeal('');
      setSelectedRecipe(null);
      updateShoppingList();
    }
  };

  const handleRemoveRecipe = (date, meal) => {
    const key = `${date}-${meal}`;
    const newSchedule = { ...schedule };
    delete newSchedule[key];
    setSchedule(newSchedule);
    localStorage.setItem('foodwise-schedule', JSON.stringify(newSchedule));
    updateShoppingList();
  };

  const handleRemoveShoppingItem = (index) => {
    const newList = shoppingList.filter((_, i) => i !== index);
    setShoppingList(newList);
  };


  const updateShoppingList = () => {
    const allIngredients = {};
    
    // Count ingredients from all scheduled meals
    Object.values(schedule).forEach(recipe => {
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const key = ingredient.name.toLowerCase();
          
          // Skip common ingredients
          if (commonIngredients.some(common => key.includes(common.toLowerCase()))) {
            return;
          }
          
          if (allIngredients[key]) {
            allIngredients[key].total += 1;
          } else {
            allIngredients[key] = {
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              total: 1
            };
          }
        });
      }
    });

    setShoppingList(Object.values(allIngredients));
  };

  const getScheduleForDay = (day) => {
    const today = new Date();
    const dayIndex = daysOfWeek.indexOf(day);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (dayIndex - today.getDay()));
    const dateStr = targetDate.toISOString().split('T')[0];
    
    return {
      breakfast: schedule[`${dateStr}-Breakfast`],
      lunch: schedule[`${dateStr}-Lunch`],
      dinner: schedule[`${dateStr}-Dinner`]
    };
  };

  const handleDragStart = (e, recipe) => {
    setDraggedItem(recipe);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, day, meal) => {
    e.preventDefault();
    if (draggedItem) {
      const today = new Date();
      const dayIndex = daysOfWeek.indexOf(day);
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + (dayIndex - today.getDay()));
      const dateStr = targetDate.toISOString().split('T')[0];
      const key = `${dateStr}-${meal}`;
      
      const newSchedule = {
        ...schedule,
        [key]: draggedItem
      };
      setSchedule(newSchedule);
      localStorage.setItem('foodwise-schedule', JSON.stringify(newSchedule));
      updateShoppingList();
      setDraggedItem(null);
    }
  };

  const getDayColor = (day) => {
    const colors = {
      'Monday': '#FFEBEE',
      'Tuesday': '#E3F2FD',
      'Wednesday': '#E8F5E8',
      'Thursday': '#FFF8E1',
      'Friday': '#FCE4EC',
      'Saturday': '#F3E5F5',
      'Sunday': '#E0F2F1'
    };
    return colors[day] || '#F5F5F5';
  };

  const renderScheduleCard = (day) => {
    const daySchedule = getScheduleForDay(day);
    
    return (
      <Card elevation={2} sx={{ mb: 2, minHeight: '400px', maxHeight: '500px' }}>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            backgroundColor: getDayColor(day), 
            color: 'white', 
            p: 0.5, 
            borderRadius: 1,
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {day}
          </Typography>
          
          {/* Vertical meal layout */}
          {mealTypes.map(meal => (
            <Box key={meal} sx={{ mb: 1, minHeight: 100 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                {meal}
              </Typography>
              {daySchedule[meal.toLowerCase()] ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 0.5, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 1,
                  border: '1px solid #e0e0e0'
                }}>
                  <img
                    src={daySchedule[meal.toLowerCase()].image}
                    alt={daySchedule[meal.toLowerCase()].name}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '2px'
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.6rem', display: 'block', lineHeight: 1.2 }}>
                    {daySchedule[meal.toLowerCase()].name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const today = new Date();
                      const dayIndex = daysOfWeek.indexOf(day);
                      const targetDate = new Date(today);
                      targetDate.setDate(today.getDate() + (dayIndex - today.getDay()));
                      const dateStr = targetDate.toISOString().split('T')[0];
                      handleRemoveRecipe(dateStr, meal);
                    }}
                    sx={{ mt: 0.5, p: 0.5 }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 0.5, 
                  border: '2px dashed #ccc', 
                  borderRadius: 1,
                  minHeight: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day, meal)}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Drop recipe here
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderShoppingList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Shopping List
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
            sx={{ mr: 1 }}
          >
            Print List
          </Button>
          <Button
            variant="contained"
            startIcon={<LocalGroceryStore />}
            onClick={() => window.open('https://www.instacart.com', '_blank')}
          >
            Shop Online
          </Button>
        </Box>
      </Box>

      {shoppingList.length > 0 ? (
        <List>
          {shoppingList.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={item.name}
                secondary={`${item.amount} ${item.unit} × ${item.total}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleRemoveShoppingItem(index)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Alert severity="info">
          No items in shopping list. Add recipes to your schedule to generate a shopping list.
        </Alert>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Meal Schedule
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Plan your daily and weekly meals. Drag recipes from the schedule list to your calendar.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Weekly Schedule" />
          <Tab label="Shopping List" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Schedule List - Left Side */}
          <Card sx={{ minWidth: 300, maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DragIndicator sx={{ mr: 1 }} />
                Available Recipes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Drag recipes to your calendar
              </Typography>
              
              {scheduleList.length > 0 ? (
                <List dense>
                  {scheduleList.map((recipe, index) => (
                    <ListItem 
                      key={recipe.id}
                      sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 1,
                        cursor: 'grab',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginRight: '12px'
                        }}
                      />
                      <ListItemText
                        primary={recipe.name}
                        secondary={`${recipe.prepTime} + ${recipe.cookTime}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            const newScheduleList = scheduleList.filter(item => item.id !== recipe.id);
                            setScheduleList(newScheduleList);
                            localStorage.setItem('foodwise-schedule-list', JSON.stringify(newScheduleList));
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No recipes in schedule list. Add recipes from the home page or recommendations.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Weekly Calendar - Right Side */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                This Week's Meals
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
              >
                Add Recipe
              </Button>
            </Box>

            <Grid container spacing={1}>
              {daysOfWeek.map(day => (
                <Grid item xs={12} sm={6} md={4} lg={1.7} xl={1.4} key={day}>
                  {renderScheduleCard(day)}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      {activeTab === 1 && renderShoppingList()}

      {/* Add Recipe Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Recipe to Schedule</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={selectedMeal}
                  onChange={(e) => setSelectedMeal(e.target.value)}
                >
                  {mealTypes.map(meal => (
                    <MenuItem key={meal} value={meal}>{meal}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Recipe
              </Typography>
              <Grid container spacing={2}>
                {scheduleList.map(recipe => (
                  <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedRecipe?.id === recipe.id ? '2px solid #2E7D32' : '1px solid #e0e0e0',
                        '&:hover': { borderColor: '#2E7D32' }
                      }}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover'
                        }}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {recipe.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {recipe.prepTime} + {recipe.cookTime} • {recipe.calories} cal
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {recipe.tags.slice(0, 2).map((tag, index) => (
                            <Chip key={index} label={tag} size="small" />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddRecipe}
            variant="contained"
            disabled={!selectedDate || !selectedMeal || !selectedRecipe}
          >
            Add to Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SchedulePage;