const express = require('express');
const router = express.Router();

/**
 * POST /api/user/profile
 * Create or update user profile
 */
router.post('/profile', async (req, res) => {
  try {
    const { userId, profile } = req.body;

    if (!userId || !profile) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and profile are required'
      });
    }

    // Sample user profile creation
    const userProfile = {
      userId,
      profile: {
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      data: userProfile,
      message: 'User profile created successfully'
    });

  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({
      error: 'User profile creation failed',
      message: error.message
    });
  }
});

/**
 * GET /api/user/profile/:userId
 * Get user profile
 */
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Sample user profile data
    const userProfile = {
      userId,
      profile: {
        health_profile: {
          age: 28,
          dietary_restrictions: ['无麸质', '乳糖不耐'],
          health_goals: ['减重', '增肌'],
          allergies: ['坚果']
        },
        preference_profile: {
          cuisine_preferences: ['中餐', '日料'],
          taste_preferences: ['偏辣', '少油'],
          disliked_foods: ['香菜', '动物内脏'],
          meal_history: [
            {
              name: 'Grilled Chicken Salad',
              date: '2024-01-15',
              rating: 4,
              cuisine: 'healthy'
            },
            {
              name: 'Sushi Bowl',
              date: '2024-01-14',
              rating: 5,
              cuisine: 'japanese'
            }
          ]
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'San Francisco, CA'
        },
        preferences: {
          budget: '$$',
          delivery_preference: 'fast',
          cooking_skill: 'intermediate'
        }
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      error: 'User profile retrieval failed',
      message: error.message
    });
  }
});

/**
 * PUT /api/user/profile/:userId
 * Update user profile
 */
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({
        error: 'Profile data is required'
      });
    }

    // Sample profile update
    const updatedProfile = {
      userId,
      profile: {
        ...profile,
        updatedAt: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      data: updatedProfile,
      message: 'User profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'User profile update failed',
      message: error.message
    });
  }
});

/**
 * POST /api/user/feedback
 * Submit user feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    const { userId, feedback } = req.body;

    if (!userId || !feedback) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and feedback are required'
      });
    }

    // Sample feedback processing
    const feedbackRecord = {
      id: `feedback_${Date.now()}`,
      userId,
      feedback: {
        ...feedback,
        submittedAt: new Date().toISOString()
      },
      status: 'received'
    };

    res.json({
      success: true,
      data: feedbackRecord,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      error: 'Feedback submission failed',
      message: error.message
    });
  }
});

/**
 * GET /api/user/history/:userId
 * Get user meal history
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // Sample meal history data
    const mealHistory = [
      {
        id: 'meal_001',
        userId,
        foodName: 'Grilled Salmon with Quinoa',
        restaurant: 'The Healthy Kitchen',
        date: '2024-01-15',
        rating: 5,
        feedback: 'Excellent! Perfectly cooked salmon.',
        nutrition: {
          calories: 420,
          protein: 35,
          carbs: 25,
          fat: 18
        },
        tags: ['healthy', 'high-protein', 'mediterranean']
      },
      {
        id: 'meal_002',
        userId,
        foodName: 'Mediterranean Chicken Bowl',
        restaurant: 'Cafe Mediterranean',
        date: '2024-01-14',
        rating: 4,
        feedback: 'Good portion size and fresh ingredients.',
        nutrition: {
          calories: 380,
          protein: 32,
          carbs: 30,
          fat: 15
        },
        tags: ['mediterranean', 'balanced', 'fresh']
      }
    ];

    res.json({
      success: true,
      data: {
        meals: mealHistory.slice(offset, offset + limit),
        total: mealHistory.length,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + limit < mealHistory.length
        }
      }
    });

  } catch (error) {
    console.error('Error getting meal history:', error);
    res.status(500).json({
      error: 'Meal history retrieval failed',
      message: error.message
    });
  }
});

/**
 * POST /api/user/preferences/learn
 * Learn from user preferences
 */
router.post('/preferences/learn', async (req, res) => {
  try {
    const { userId, interaction } = req.body;

    if (!userId || !interaction) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and interaction are required'
      });
    }

    // Sample preference learning
    const learningResult = {
      userId,
      interaction,
      learnedPreferences: {
        cuisine_preferences: ['mediterranean', 'healthy'],
        taste_preferences: ['balanced', 'fresh'],
        health_goals: ['high-protein', 'low-calorie']
      },
      confidence: 0.85,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: learningResult,
      message: 'Preferences learned successfully'
    });

  } catch (error) {
    console.error('Error learning preferences:', error);
    res.status(500).json({
      error: 'Preference learning failed',
      message: error.message
    });
  }
});

module.exports = router;
