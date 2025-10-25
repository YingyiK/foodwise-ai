const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

/**
 * Food Search Agent
 * Searches and retrieves food candidates from the database
 */
class FoodSearchAgent {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.isHealthy = true;
    this.lastActivity = null;
  }

  /**
   * Search for food candidates based on user query
   * @param {string} userQuery - Natural language food query
   * @returns {Array} Array of food candidates
   */
  async searchFoods(userQuery) {
    try {
      this.lastActivity = new Date().toISOString();
      console.log('🔍 FoodSearchAgent: Searching for foods...');

      // Extract keywords and intent from user query
      const searchIntent = await this.extractSearchIntent(userQuery);
      
      // Search food database (simulated with sample data)
      const foodCandidates = await this.searchFoodDatabase(searchIntent);
      
      console.log(`✅ Found ${foodCandidates.length} food candidates`);
      return foodCandidates;

    } catch (error) {
      console.error('❌ FoodSearchAgent error:', error);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Extract search intent using Claude
   * @param {string} userQuery - User's natural language query
   * @returns {Object} Structured search intent
   */
  async extractSearchIntent(userQuery) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `You are a food search expert. Extract the following from user queries:
            - Main ingredients or food types
            - Cuisine style
            - Cooking method
            - Health requirements (low-calorie, high-protein, etc.)
            - Meal type (breakfast, lunch, dinner)
            - Dietary restrictions
            
            Return a JSON object with these fields.
            
            User query: ${userQuery}`
          }
        ]
      });

      const content = response.content[0].text;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error extracting search intent:', error);
      // Fallback to basic keyword extraction
      return this.extractBasicKeywords(userQuery);
    }
  }

  /**
   * Basic keyword extraction fallback
   * @param {string} userQuery - User query
   * @returns {Object} Basic search intent
   */
  extractBasicKeywords(userQuery) {
    const keywords = userQuery.toLowerCase().split(' ');
    return {
      ingredients: keywords.filter(word => 
        ['chicken', 'salmon', 'beef', 'vegetables', 'rice', 'pasta'].includes(word)
      ),
      cuisine: keywords.filter(word => 
        ['chinese', 'italian', 'mexican', 'japanese', 'healthy'].includes(word)
      ),
      health_requirements: keywords.filter(word => 
        ['low-calorie', 'high-protein', 'healthy', 'low-carb'].includes(word)
      ),
      meal_type: keywords.filter(word => 
        ['breakfast', 'lunch', 'dinner', 'snack'].includes(word)
      )
    };
  }

  /**
   * Search food database (simulated with sample data)
   * @param {Object} searchIntent - Search criteria
   * @returns {Array} Food candidates
   */
  async searchFoodDatabase(searchIntent) {
    // This would typically query a real database
    // For now, return sample data based on search intent
    const sampleFoods = [
      {
        id: 'food_001',
        name: 'Grilled Salmon with Quinoa',
        description: 'Wild-caught salmon grilled with herbs, served with quinoa and steamed broccoli',
        ingredients: ['salmon', 'quinoa', 'broccoli', 'olive oil', 'herbs'],
        nutrition: {
          calories: 420,
          protein: 35,
          carbs: 25,
          fat: 18,
          fiber: 4
        },
        cuisine: 'healthy',
        cooking_method: 'grilled',
        meal_type: 'lunch',
        health_tags: ['high-protein', 'omega-3', 'low-carb']
      },
      {
        id: 'food_002',
        name: 'Mediterranean Chicken Bowl',
        description: 'Grilled chicken breast with Mediterranean vegetables and brown rice',
        ingredients: ['chicken', 'tomatoes', 'cucumber', 'olives', 'brown rice'],
        nutrition: {
          calories: 380,
          protein: 32,
          carbs: 30,
          fat: 15,
          fiber: 6
        },
        cuisine: 'mediterranean',
        cooking_method: 'grilled',
        meal_type: 'lunch',
        health_tags: ['high-protein', 'mediterranean', 'balanced']
      },
      {
        id: 'food_003',
        name: 'Vegetarian Buddha Bowl',
        description: 'Roasted vegetables with chickpeas, avocado, and tahini dressing',
        ingredients: ['sweet potato', 'chickpeas', 'avocado', 'kale', 'tahini'],
        nutrition: {
          calories: 350,
          protein: 18,
          carbs: 45,
          fat: 12,
          fiber: 12
        },
        cuisine: 'vegetarian',
        cooking_method: 'roasted',
        meal_type: 'lunch',
        health_tags: ['vegetarian', 'high-fiber', 'plant-based']
      }
    ];

    // Filter based on search intent
    return sampleFoods.filter(food => {
      const matchesIngredients = !searchIntent.ingredients?.length || 
        searchIntent.ingredients.some(ingredient => 
          food.ingredients.some(foodIngredient => 
            foodIngredient.includes(ingredient)
          )
        );
      
      const matchesCuisine = !searchIntent.cuisine?.length || 
        searchIntent.cuisine.some(cuisine => 
          food.cuisine.includes(cuisine)
        );

      const matchesHealth = !searchIntent.health_requirements?.length ||
        searchIntent.health_requirements.some(requirement =>
          food.health_tags.some(tag => tag.includes(requirement))
        );

      return matchesIngredients || matchesCuisine || matchesHealth;
    });
  }
}

module.exports = FoodSearchAgent;
