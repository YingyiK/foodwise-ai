const Anthropic = require('@anthropic-ai/sdk');

/**
 * Health Assessment Agent
 * Evaluates food items based on nutritional value and user health profile
 */
class HealthAssessmentAgent {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.isHealthy = true;
    this.lastActivity = null;
  }

  /**
   * Assess health value of food candidates
   * @param {Array} foodCandidates - Array of food items to assess
   * @param {Object} userProfile - User's health profile
   * @returns {Array} Health scores for each food item
   */
  async assessHealth(foodCandidates, userProfile) {
    try {
      this.lastActivity = new Date().toISOString();
      console.log('🏥 HealthAssessmentAgent: Assessing health values...');

      const healthScores = [];
      
      for (const food of foodCandidates) {
        const score = await this.calculateHealthScore(food, userProfile);
        healthScores.push({
          foodId: food.id,
          healthScore: score.overall,
          nutritionScore: score.nutrition,
          compatibilityScore: score.compatibility,
          reasoning: score.reasoning,
          recommendations: score.recommendations
        });
      }

      console.log(`✅ Health assessment completed for ${healthScores.length} foods`);
      return healthScores;

    } catch (error) {
      console.error('❌ HealthAssessmentAgent error:', error);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Calculate comprehensive health score for a food item
   * @param {Object} food - Food item to assess
   * @param {Object} userProfile - User's health profile
   * @returns {Object} Detailed health assessment
   */
  async calculateHealthScore(food, userProfile) {
    try {
      // Basic nutritional scoring
      const nutritionScore = this.calculateNutritionScore(food.nutrition);
      
      // Compatibility with user profile
      const compatibilityScore = this.calculateCompatibilityScore(food, userProfile);
      
      // Overall health score (weighted average)
      const overallScore = Math.round(
        (nutritionScore * 0.6) + (compatibilityScore * 0.4)
      );

      // Generate AI-powered reasoning
      const reasoning = await this.generateHealthReasoning(food, userProfile, {
        nutrition: nutritionScore,
        compatibility: compatibilityScore,
        overall: overallScore
      });

      return {
        nutrition: nutritionScore,
        compatibility: compatibilityScore,
        overall: overallScore,
        reasoning,
        recommendations: this.generateRecommendations(food, userProfile)
      };

    } catch (error) {
      console.error('Error calculating health score:', error);
      return {
        nutrition: 50,
        compatibility: 50,
        overall: 50,
        reasoning: 'Unable to assess health value',
        recommendations: []
      };
    }
  }

  /**
   * Calculate nutritional score based on macro and micronutrients
   * @param {Object} nutrition - Nutritional information
   * @returns {number} Nutrition score (0-100)
   */
  calculateNutritionScore(nutrition) {
    let score = 0;
    
    // Protein quality (0-25 points)
    const proteinScore = Math.min(25, (nutrition.protein / 30) * 25);
    score += proteinScore;
    
    // Fiber content (0-20 points)
    const fiberScore = Math.min(20, (nutrition.fiber / 10) * 20);
    score += fiberScore;
    
    // Calorie density (0-20 points) - lower is better for most foods
    const calorieDensity = nutrition.calories / 100;
    const calorieScore = Math.max(0, 20 - (calorieDensity / 5) * 20);
    score += calorieScore;
    
    // Macronutrient balance (0-20 points)
    const proteinRatio = nutrition.protein / nutrition.calories * 4;
    const carbRatio = nutrition.carbs / nutrition.calories * 4;
    const fatRatio = nutrition.fat / nutrition.calories * 9;
    
    const balanceScore = 20 - Math.abs(proteinRatio - 0.25) * 40 - 
                        Math.abs(carbRatio - 0.5) * 20 - 
                        Math.abs(fatRatio - 0.25) * 20;
    score += Math.max(0, balanceScore);
    
    // Vitamin and mineral content (0-15 points) - simplified
    score += 15; // Assume all foods have some vitamins/minerals
    
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * Calculate compatibility with user's health profile
   * @param {Object} food - Food item
   * @param {Object} userProfile - User's health profile
   * @returns {number} Compatibility score (0-100)
   */
  calculateCompatibilityScore(food, userProfile) {
    let score = 50; // Base score
    
    // Check dietary restrictions
    if (userProfile.dietary_restrictions) {
      for (const restriction of userProfile.dietary_restrictions) {
        if (this.violatesRestriction(food, restriction)) {
          score -= 30;
        }
      }
    }
    
    // Check allergies
    if (userProfile.allergies) {
      for (const allergy of userProfile.allergies) {
        if (this.containsAllergen(food, allergy)) {
          score -= 50; // Severe penalty for allergens
        }
      }
    }
    
    // Check health goals
    if (userProfile.health_goals) {
      for (const goal of userProfile.health_goals) {
        if (this.supportsGoal(food, goal)) {
          score += 15;
        }
      }
    }
    
    // Age-based adjustments
    if (userProfile.age) {
      if (userProfile.age > 65 && food.health_tags.includes('high-fiber')) {
        score += 10;
      }
      if (userProfile.age < 30 && food.health_tags.includes('high-protein')) {
        score += 10;
      }
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Check if food violates dietary restriction
   * @param {Object} food - Food item
   * @param {string} restriction - Dietary restriction
   * @returns {boolean} True if violates restriction
   */
  violatesRestriction(food, restriction) {
    const restrictionMap = {
      '无麸质': () => food.ingredients.some(ing => 
        ['wheat', 'flour', 'bread', 'pasta'].some(gluten => ing.includes(gluten))
      ),
      '素食': () => food.ingredients.some(ing => 
        ['chicken', 'beef', 'pork', 'fish', 'salmon'].some(meat => ing.includes(meat))
      ),
      '纯素': () => food.ingredients.some(ing => 
        ['chicken', 'beef', 'pork', 'fish', 'salmon', 'cheese', 'milk', 'eggs'].some(animal => ing.includes(animal))
      )
    };
    
    return restrictionMap[restriction] ? restrictionMap[restriction]() : false;
  }

  /**
   * Check if food contains allergen
   * @param {Object} food - Food item
   * @param {string} allergen - Allergen to check
   * @returns {boolean} True if contains allergen
   */
  containsAllergen(food, allergen) {
    const allergenMap = {
      '坚果': () => food.ingredients.some(ing => 
        ['nuts', 'almonds', 'walnuts', 'peanuts'].some(nut => ing.includes(nut))
      ),
      '乳制品': () => food.ingredients.some(ing => 
        ['cheese', 'milk', 'butter', 'cream'].some(dairy => ing.includes(dairy))
      ),
      '海鲜': () => food.ingredients.some(ing => 
        ['fish', 'salmon', 'tuna', 'shrimp'].some(seafood => ing.includes(seafood))
      )
    };
    
    return allergenMap[allergen] ? allergenMap[allergen]() : false;
  }

  /**
   * Check if food supports health goal
   * @param {Object} food - Food item
   * @param {string} goal - Health goal
   * @returns {boolean} True if supports goal
   */
  supportsGoal(food, goal) {
    const goalMap = {
      '减重': () => food.nutrition.calories < 400 && food.health_tags.includes('low-carb'),
      '增肌': () => food.nutrition.protein > 25 && food.health_tags.includes('high-protein'),
      '降血压': () => food.health_tags.includes('mediterranean') || food.health_tags.includes('high-fiber'),
      '降血糖': () => food.health_tags.includes('low-carb') && food.nutrition.fiber > 5
    };
    
    return goalMap[goal] ? goalMap[goal]() : false;
  }

  /**
   * Generate AI-powered health reasoning
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @param {Object} scores - Calculated scores
   * @returns {string} AI-generated reasoning
   */
  async generateHealthReasoning(food, userProfile, scores) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 200,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `You are a nutritionist. Provide a brief, helpful explanation of why this food is good or not good for the user based on their health profile. Be specific and actionable.

            Food: ${food.name}
            Nutrition: ${JSON.stringify(food.nutrition)}
            User Profile: ${JSON.stringify(userProfile)}
            Scores: Nutrition ${scores.nutrition}/100, Compatibility ${scores.compatibility}/100, Overall ${scores.overall}/100`
          }
        ]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating health reasoning:', error);
      return `This food has a health score of ${scores.overall}/100. ${scores.nutrition > 70 ? 'Good nutritional value.' : 'Consider healthier alternatives.'}`;
    }
  }

  /**
   * Generate specific recommendations for the food
   * @param {Object} food - Food item
   * @param {Object} userProfile - User profile
   * @returns {Array} Array of recommendations
   */
  generateRecommendations(food, userProfile) {
    const recommendations = [];
    
    if (food.nutrition.protein < 20) {
      recommendations.push('Consider adding a protein source');
    }
    
    if (food.nutrition.fiber < 5) {
      recommendations.push('Add more fiber-rich vegetables');
    }
    
    if (food.nutrition.calories > 500) {
      recommendations.push('Consider reducing portion size');
    }
    
    return recommendations;
  }
}

module.exports = HealthAssessmentAgent;
