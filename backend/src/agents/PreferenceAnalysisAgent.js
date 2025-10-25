const Anthropic = require('@anthropic-ai/sdk');

/**
 * Preference Analysis Agent
 * Analyzes user preferences based on history and profile
 */
class PreferenceAnalysisAgent {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.isHealthy = true;
    this.lastActivity = null;
  }

  /**
   * Analyze user preferences for food candidates
   * @param {Array} foodCandidates - Food items to analyze
   * @param {Object} userProfile - User's preference profile
   * @returns {Array} Preference scores for each food
   */
  async analyzePreferences(foodCandidates, userProfile) {
    try {
      this.lastActivity = new Date().toISOString();
      console.log('🎯 PreferenceAnalysisAgent: Analyzing user preferences...');

      const preferenceScores = [];
      
      for (const food of foodCandidates) {
        const score = await this.calculatePreferenceScore(food, userProfile);
        preferenceScores.push({
          foodId: food.id,
          preferenceScore: score.overall,
          tasteMatch: score.taste,
          cuisineMatch: score.cuisine,
          diversityScore: score.diversity,
          reasoning: score.reasoning
        });
      }

      console.log(`✅ Preference analysis completed for ${preferenceScores.length} foods`);
      return preferenceScores;

    } catch (error) {
      console.error('❌ PreferenceAnalysisAgent error:', error);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Calculate comprehensive preference score
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {Object} Detailed preference analysis
   */
  async calculatePreferenceScore(food, userProfile) {
    try {
      // Taste preference matching
      const tasteScore = this.calculateTasteScore(food, userProfile);
      
      // Cuisine preference matching
      const cuisineScore = this.calculateCuisineScore(food, userProfile);
      
      // Diversity score (avoid repetition)
      const diversityScore = this.calculateDiversityScore(food, userProfile);
      
      // Overall preference score
      const overallScore = Math.round(
        (tasteScore * 0.4) + (cuisineScore * 0.4) + (diversityScore * 0.2)
      );

      // Generate AI reasoning
      const reasoning = await this.generatePreferenceReasoning(food, userProfile, {
        taste: tasteScore,
        cuisine: cuisineScore,
        diversity: diversityScore,
        overall: overallScore
      });

      return {
        taste: tasteScore,
        cuisine: cuisineScore,
        diversity: diversityScore,
        overall: overallScore,
        reasoning
      };

    } catch (error) {
      console.error('Error calculating preference score:', error);
      return {
        taste: 50,
        cuisine: 50,
        diversity: 50,
        overall: 50,
        reasoning: 'Unable to analyze preferences'
      };
    }
  }

  /**
   * Calculate taste preference score
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {number} Taste score (0-100)
   */
  calculateTasteScore(food, userProfile) {
    let score = 50; // Base score
    
    if (userProfile.preference_profile?.taste_preferences) {
      const tastePreferences = userProfile.preference_profile.taste_preferences;
      
      // Spicy preference
      if (tastePreferences.includes('偏辣') && this.isSpicyFood(food)) {
        score += 20;
      } else if (tastePreferences.includes('不辣') && this.isSpicyFood(food)) {
        score -= 20;
      }
      
      // Oil preference
      if (tastePreferences.includes('少油') && this.isLowOilFood(food)) {
        score += 15;
      } else if (tastePreferences.includes('多油') && this.isHighOilFood(food)) {
        score += 15;
      }
      
      // Sweet preference
      if (tastePreferences.includes('偏甜') && this.isSweetFood(food)) {
        score += 15;
      } else if (tastePreferences.includes('不甜') && this.isSweetFood(food)) {
        score -= 15;
      }
    }
    
    // Check disliked foods
    if (userProfile.preference_profile?.disliked_foods) {
      const dislikedFoods = userProfile.preference_profile.disliked_foods;
      for (const disliked of dislikedFoods) {
        if (this.containsDislikedIngredient(food, disliked)) {
          score -= 30;
        }
      }
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate cuisine preference score
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {number} Cuisine score (0-100)
   */
  calculateCuisineScore(food, userProfile) {
    let score = 50; // Base score
    
    if (userProfile.preference_profile?.cuisine_preferences) {
      const cuisinePreferences = userProfile.preference_profile.cuisine_preferences;
      
      for (const preferredCuisine of cuisinePreferences) {
        if (this.matchesCuisine(food, preferredCuisine)) {
          score += 25;
        }
      }
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate diversity score to avoid repetitive recommendations
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {number} Diversity score (0-100)
   */
  calculateDiversityScore(food, userProfile) {
    let score = 50; // Base score
    
    if (userProfile.preference_profile?.meal_history) {
      const mealHistory = userProfile.preference_profile.meal_history;
      const recentMeals = mealHistory.slice(-10); // Last 10 meals
      
      // Check for repetition
      const isRepeated = recentMeals.some(meal => 
        meal.name === food.name || 
        this.hasSimilarIngredients(meal.ingredients, food.ingredients)
      );
      
      if (isRepeated) {
        score -= 20; // Penalty for repetition
      } else {
        score += 15; // Bonus for diversity
      }
      
      // Check cuisine diversity
      const recentCuisines = recentMeals.map(meal => meal.cuisine);
      const cuisineDiversity = new Set(recentCuisines).size;
      
      if (cuisineDiversity < 3 && !recentCuisines.includes(food.cuisine)) {
        score += 10; // Bonus for introducing new cuisine
      }
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Check if food is spicy
   * @param {Object} food - Food item
   * @returns {boolean} True if spicy
   */
  isSpicyFood(food) {
    const spicyIngredients = ['chili', 'pepper', 'spicy', 'hot', 'jalapeno', 'cayenne'];
    return food.ingredients.some(ingredient => 
      spicyIngredients.some(spicy => ingredient.includes(spicy))
    );
  }

  /**
   * Check if food is low in oil
   * @param {Object} food - Food item
   * @returns {boolean} True if low oil
   */
  isLowOilFood(food) {
    const fatRatio = food.nutrition.fat / food.nutrition.calories * 9;
    return fatRatio < 0.3; // Less than 30% calories from fat
  }

  /**
   * Check if food is high in oil
   * @param {Object} food - Food item
   * @returns {boolean} True if high oil
   */
  isHighOilFood(food) {
    const fatRatio = food.nutrition.fat / food.nutrition.calories * 9;
    return fatRatio > 0.4; // More than 40% calories from fat
  }

  /**
   * Check if food is sweet
   * @param {Object} food - Food item
   * @returns {boolean} True if sweet
   */
  isSweetFood(food) {
    const sweetIngredients = ['sugar', 'honey', 'maple', 'sweet', 'fruit'];
    return food.ingredients.some(ingredient => 
      sweetIngredients.some(sweet => ingredient.includes(sweet))
    );
  }

  /**
   * Check if food contains disliked ingredient
   * @param {Object} food - Food item
   * @param {string} disliked - Disliked ingredient
   * @returns {boolean} True if contains disliked ingredient
   */
  containsDislikedIngredient(food, disliked) {
    return food.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(disliked.toLowerCase())
    );
  }

  /**
   * Check if food matches cuisine preference
   * @param {Object} food - Food item
   * @param {string} cuisine - Preferred cuisine
   * @returns {boolean} True if matches cuisine
   */
  matchesCuisine(food, cuisine) {
    const cuisineMap = {
      '中餐': ['chinese', 'asian', 'stir-fry'],
      '日料': ['japanese', 'sushi', 'teriyaki'],
      '意餐': ['italian', 'pasta', 'pizza'],
      '墨西哥菜': ['mexican', 'taco', 'burrito'],
      '健康': ['healthy', 'mediterranean', 'vegetarian']
    };
    
    const keywords = cuisineMap[cuisine] || [cuisine];
    return keywords.some(keyword => 
      food.cuisine.includes(keyword) || 
      food.ingredients.some(ingredient => ingredient.includes(keyword))
    );
  }

  /**
   * Check if two ingredient lists are similar
   * @param {Array} ingredients1 - First ingredient list
   * @param {Array} ingredients2 - Second ingredient list
   * @returns {boolean} True if similar
   */
  hasSimilarIngredients(ingredients1, ingredients2) {
    if (!ingredients1 || !ingredients2) return false;
    
    const commonIngredients = ingredients1.filter(ing1 => 
      ingredients2.some(ing2 => ing1.includes(ing2) || ing2.includes(ing1))
    );
    
    return commonIngredients.length >= 3; // At least 3 common ingredients
  }

  /**
   * Generate AI-powered preference reasoning
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @param {Object} scores - Calculated scores
   * @returns {string} AI-generated reasoning
   */
  async generatePreferenceReasoning(food, userProfile, scores) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 200,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `You are a personal food preference analyst. Explain why this food matches or doesn't match the user's preferences based on their taste, cuisine, and history. Be specific and helpful.

            Food: ${food.name}
            User Preferences: ${JSON.stringify(userProfile.preference_profile)}
            Scores: Taste ${scores.taste}/100, Cuisine ${scores.cuisine}/100, Diversity ${scores.diversity}/100, Overall ${scores.overall}/100`
          }
        ]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating preference reasoning:', error);
      return `This food has a preference score of ${scores.overall}/100. ${scores.overall > 70 ? 'Good match for your preferences.' : 'May not align with your usual preferences.'}`;
    }
  }
}

module.exports = PreferenceAnalysisAgent;
