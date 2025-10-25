const Anthropic = require('@anthropic-ai/sdk');

/**
 * Recommendation Agent
 * Generates final recommendations by combining all agent outputs
 */
class RecommendationAgent {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.isHealthy = true;
    this.lastActivity = null;
  }

  /**
   * Generate final recommendations
   * @param {Array} foodCandidates - Original food candidates
   * @param {Array} healthScores - Health assessment scores
   * @param {Array} preferenceScores - Preference analysis scores
   * @param {Object} userProfile - User profile
   * @returns {Array} Final recommendations
   */
  async generateRecommendations(foodCandidates, healthScores, preferenceScores, userProfile) {
    try {
      this.lastActivity = new Date().toISOString();
      console.log('🎯 RecommendationAgent: Generating final recommendations...');

      // Combine scores and create comprehensive recommendations
      const recommendations = [];
      
      for (let i = 0; i < foodCandidates.length; i++) {
        const food = foodCandidates[i];
        const healthScore = healthScores.find(h => h.foodId === food.id);
        const preferenceScore = preferenceScores.find(p => p.foodId === food.id);
        
        if (healthScore && preferenceScore) {
          const recommendation = await this.createRecommendation(
            food, 
            healthScore, 
            preferenceScore, 
            userProfile
          );
          recommendations.push(recommendation);
        }
      }

      // Sort by overall score and return top 5
      const sortedRecommendations = recommendations
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, 5);

      console.log(`✅ Generated ${sortedRecommendations.length} final recommendations`);
      return sortedRecommendations;

    } catch (error) {
      console.error('❌ RecommendationAgent error:', error);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Create comprehensive recommendation for a food item
   * @param {Object} food - Food item
   * @param {Object} healthScore - Health assessment
   * @param {Object} preferenceScore - Preference analysis
   * @param {Object} userProfile - User profile
   * @returns {Object} Complete recommendation
   */
  async createRecommendation(food, healthScore, preferenceScore, userProfile) {
    try {
      // Calculate weighted overall score
      const overallScore = this.calculateOverallScore(healthScore, preferenceScore);
      
      // Generate personalized reasoning
      const reasoning = await this.generatePersonalizedReasoning(
        food, 
        healthScore, 
        preferenceScore, 
        userProfile
      );
      
      // Generate cooking tips
      const cookingTips = await this.generateCookingTips(food, userProfile);
      
      // Generate nutritional insights
      const nutritionalInsights = this.generateNutritionalInsights(food, userProfile);
      
      // Generate meal timing recommendation
      const mealTiming = this.recommendMealTiming(food, userProfile);

      return {
        id: food.id,
        name: food.name,
        description: food.description,
        ingredients: food.ingredients,
        nutrition: food.nutrition,
        cuisine: food.cuisine,
        cookingMethod: food.cooking_method,
        mealType: food.meal_type,
        healthTags: food.health_tags,
        
        // Scores
        overallScore,
        healthScore: healthScore.healthScore,
        preferenceScore: preferenceScore.preferenceScore,
        
        // Detailed analysis
        healthAnalysis: {
          score: healthScore.healthScore,
          nutritionScore: healthScore.nutritionScore,
          compatibilityScore: healthScore.compatibilityScore,
          reasoning: healthScore.reasoning,
          recommendations: healthScore.recommendations
        },
        
        preferenceAnalysis: {
          score: preferenceScore.preferenceScore,
          tasteMatch: preferenceScore.tasteMatch,
          cuisineMatch: preferenceScore.cuisineMatch,
          diversityScore: preferenceScore.diversityScore,
          reasoning: preferenceScore.reasoning
        },
        
        // Personalized content
        personalizedReasoning: reasoning,
        cookingTips,
        nutritionalInsights,
        mealTiming,
        
        // Visual data for frontend
        nutritionVisualization: this.createNutritionVisualization(food.nutrition),
        healthScoreBreakdown: this.createHealthScoreBreakdown(healthScore),
        
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error creating recommendation:', error);
      return this.createFallbackRecommendation(food, healthScore, preferenceScore);
    }
  }

  /**
   * Calculate weighted overall score
   * @param {Object} healthScore - Health assessment
   * @param {Object} preferenceScore - Preference analysis
   * @returns {number} Overall score (0-100)
   */
  calculateOverallScore(healthScore, preferenceScore) {
    // Weighted combination: 60% health, 40% preference
    const weightedScore = Math.round(
      (healthScore.healthScore * 0.6) + (preferenceScore.preferenceScore * 0.4)
    );
    
    return Math.min(100, Math.max(0, weightedScore));
  }

  /**
   * Generate personalized reasoning using AI
   * @param {Object} food - Food item
   * @param {Object} healthScore - Health assessment
   * @param {Object} preferenceScore - Preference analysis
   * @param {Object} userProfile - User profile
   * @returns {string} Personalized reasoning
   */
  async generatePersonalizedReasoning(food, healthScore, preferenceScore, userProfile) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 300,
        temperature: 0.4,
        messages: [
          {
            role: "user",
            content: `You are a personal nutritionist and food advisor. Create a personalized explanation of why this food is recommended for this specific user. Consider their health goals, preferences, and dietary restrictions. Be encouraging and specific.

            Food: ${food.name}
            Health Score: ${healthScore.healthScore}/100
            Preference Score: ${preferenceScore.preferenceScore}/100
            User Profile: ${JSON.stringify(userProfile)}
            
            Health Reasoning: ${healthScore.reasoning}
            Preference Reasoning: ${preferenceScore.reasoning}`
          }
        ]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating personalized reasoning:', error);
      return `This ${food.name} is a great choice for you! It scores ${healthScore.healthScore}/100 for health and ${preferenceScore.preferenceScore}/100 for your preferences.`;
    }
  }

  /**
   * Generate cooking tips for the food
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {Array} Cooking tips
   */
  async generateCookingTips(food, userProfile) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 200,
        temperature: 0.5,
        messages: [
          {
            role: "user",
            content: `You are a cooking expert. Provide 3-4 practical cooking tips for this specific food, considering the user's skill level and dietary preferences. Be specific and actionable.

            Food: ${food.name}
            Ingredients: ${food.ingredients.join(', ')}
            Cooking Method: ${food.cooking_method}
            User Profile: ${JSON.stringify(userProfile)}`
          }
        ]
      });

      return response.content[0].text.split('\n').filter(tip => tip.trim());
    } catch (error) {
      console.error('Error generating cooking tips:', error);
      return [
        `Cook ${food.name} using the ${food.cooking_method} method`,
        'Season to taste with herbs and spices',
        'Check doneness before serving'
      ];
    }
  }

  /**
   * Generate nutritional insights
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {Object} Nutritional insights
   */
  generateNutritionalInsights(food, userProfile) {
    const insights = {
      highlights: [],
      considerations: [],
      benefits: []
    };

    // Protein insights
    if (food.nutrition.protein > 25) {
      insights.highlights.push(`High protein content (${food.nutrition.protein}g) - great for muscle building`);
    }

    // Fiber insights
    if (food.nutrition.fiber > 8) {
      insights.highlights.push(`Excellent fiber content (${food.nutrition.fiber}g) - supports digestive health`);
    }

    // Calorie insights
    if (food.nutrition.calories < 400) {
      insights.highlights.push(`Low calorie option (${food.nutrition.calories} calories) - perfect for weight management`);
    }

    // Health goal alignment
    if (userProfile.health_goals) {
      userProfile.health_goals.forEach(goal => {
        if (goal === '减重' && food.nutrition.calories < 400) {
          insights.benefits.push('Supports weight loss goals');
        }
        if (goal === '增肌' && food.nutrition.protein > 25) {
          insights.benefits.push('Supports muscle building goals');
        }
      });
    }

    return insights;
  }

  /**
   * Recommend optimal meal timing
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {Object} Meal timing recommendation
   */
  recommendMealTiming(food, userProfile) {
    const timing = {
      recommended: food.meal_type,
      reasoning: '',
      alternatives: []
    };

    // Base reasoning on nutrition and meal type
    if (food.meal_type === 'breakfast' && food.nutrition.protein > 20) {
      timing.reasoning = 'High protein breakfast helps maintain energy throughout the morning';
    } else if (food.meal_type === 'lunch' && food.nutrition.calories < 500) {
      timing.reasoning = 'Balanced lunch that won\'t cause afternoon energy crash';
    } else if (food.meal_type === 'dinner' && food.nutrition.calories < 600) {
      timing.reasoning = 'Light dinner that supports healthy digestion';
    }

    return timing;
  }

  /**
   * Create nutrition visualization data
   * @param {Object} nutrition - Nutritional data
   * @returns {Object} Visualization data
   */
  createNutritionVisualization(nutrition) {
    return {
      macronutrients: [
        { name: 'Protein', value: nutrition.protein, unit: 'g', color: '#FF6B6B' },
        { name: 'Carbs', value: nutrition.carbs, unit: 'g', color: '#4ECDC4' },
        { name: 'Fat', value: nutrition.fat, unit: 'g', color: '#45B7D1' }
      ],
      calories: nutrition.calories,
      fiber: nutrition.fiber
    };
  }

  /**
   * Create health score breakdown
   * @param {Object} healthScore - Health assessment
   * @returns {Object} Score breakdown
   */
  createHealthScoreBreakdown(healthScore) {
    return {
      overall: healthScore.healthScore,
      nutrition: healthScore.nutritionScore,
      compatibility: healthScore.compatibilityScore,
      recommendations: healthScore.recommendations
    };
  }

  /**
   * Create fallback recommendation when AI fails
   * @param {Object} food - Food item
   * @param {Object} healthScore - Health assessment
   * @param {Object} preferenceScore - Preference analysis
   * @returns {Object} Fallback recommendation
   */
  createFallbackRecommendation(food, healthScore, preferenceScore) {
    return {
      id: food.id,
      name: food.name,
      description: food.description,
      ingredients: food.ingredients,
      nutrition: food.nutrition,
      overallScore: this.calculateOverallScore(healthScore, preferenceScore),
      healthScore: healthScore.healthScore,
      preferenceScore: preferenceScore.preferenceScore,
      personalizedReasoning: `This ${food.name} is recommended based on your preferences and health profile.`,
      cookingTips: ['Follow the cooking method specified', 'Season to taste'],
      nutritionalInsights: { highlights: ['Good nutritional balance'] },
      mealTiming: { recommended: food.meal_type, reasoning: 'Suitable for this meal type' }
    };
  }
}

module.exports = RecommendationAgent;
