const express = require('express');
const AgentManager = require('../agents/AgentManager');
const router = express.Router();

const agentManager = new AgentManager();

/**
 * POST /api/food/recommend
 * Get food recommendations based on user query and profile
 */
router.post('/recommend', async (req, res) => {
  try {
    const { userQuery, userProfile } = req.body;

    if (!userQuery || !userProfile) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userQuery and userProfile are required'
      });
    }

    console.log('🍎 Processing food recommendation request...');
    
    const result = await agentManager.processFoodRecommendation(userQuery, userProfile);
    
    res.json({
      success: true,
      data: result,
      message: 'Food recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error in food recommendation:', error);
    res.status(500).json({
      error: 'Food recommendation failed',
      message: error.message
    });
  }
});

/**
 * POST /api/food/restaurant
 * Get restaurant recommendations for selected food
 */
router.post('/restaurant', async (req, res) => {
  try {
    const { selectedFood, userProfile } = req.body;

    if (!selectedFood || !userProfile) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'selectedFood and userProfile are required'
      });
    }

    console.log('🍽️ Processing restaurant recommendation request...');
    
    const result = await agentManager.processRestaurantRecommendation(selectedFood, userProfile);
    
    res.json({
      success: true,
      data: result,
      message: 'Restaurant recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error in restaurant recommendation:', error);
    res.status(500).json({
      error: 'Restaurant recommendation failed',
      message: error.message
    });
  }
});

/**
 * POST /api/food/grocery
 * Get grocery shopping options for selected food
 */
router.post('/grocery', async (req, res) => {
  try {
    const { selectedFood, userProfile } = req.body;

    if (!selectedFood || !userProfile) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'selectedFood and userProfile are required'
      });
    }

    console.log('🛒 Processing grocery recommendation request...');
    
    const result = await agentManager.processGroceryRecommendation(selectedFood, userProfile);
    
    res.json({
      success: true,
      data: result,
      message: 'Grocery recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error in grocery recommendation:', error);
    res.status(500).json({
      error: 'Grocery recommendation failed',
      message: error.message
    });
  }
});

/**
 * GET /api/food/health
 * Get health analysis for a specific food
 */
router.get('/health/:foodId', async (req, res) => {
  try {
    const { foodId } = req.params;
    const { userProfile } = req.query;

    if (!foodId) {
      return res.status(400).json({
        error: 'Missing foodId parameter'
      });
    }

    // This would typically fetch from database
    // For now, return sample health analysis
    const healthAnalysis = {
      foodId,
      healthScore: 85,
      nutritionScore: 90,
      compatibilityScore: 80,
      reasoning: 'This food provides excellent nutritional value with high protein and fiber content.',
      recommendations: [
        'Consider adding more vegetables',
        'Great choice for muscle building'
      ]
    };

    res.json({
      success: true,
      data: healthAnalysis
    });

  } catch (error) {
    console.error('Error getting health analysis:', error);
    res.status(500).json({
      error: 'Health analysis failed',
      message: error.message
    });
  }
});

/**
 * GET /api/food/nutrition/:foodId
 * Get detailed nutrition information for a food
 */
router.get('/nutrition/:foodId', async (req, res) => {
  try {
    const { foodId } = req.params;

    // Sample nutrition data
    const nutritionData = {
      foodId,
      name: 'Grilled Salmon with Quinoa',
      nutrition: {
        calories: 420,
        protein: 35,
        carbs: 25,
        fat: 18,
        fiber: 4,
        sugar: 3,
        sodium: 280,
        cholesterol: 65
      },
      vitamins: {
        vitaminA: '15%',
        vitaminC: '8%',
        calcium: '4%',
        iron: '12%'
      },
      healthBenefits: [
        'High in omega-3 fatty acids',
        'Excellent source of protein',
        'Supports heart health',
        'Rich in B vitamins'
      ],
      allergens: ['fish'],
      dietaryInfo: {
        glutenFree: true,
        dairyFree: true,
        vegetarian: false,
        vegan: false
      }
    };

    res.json({
      success: true,
      data: nutritionData
    });

  } catch (error) {
    console.error('Error getting nutrition data:', error);
    res.status(500).json({
      error: 'Nutrition data retrieval failed',
      message: error.message
    });
  }
});

module.exports = router;
