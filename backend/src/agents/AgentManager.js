const FoodSearchAgent = require('./FoodSearchAgent');
const HealthAssessmentAgent = require('./HealthAssessmentAgent');
const PreferenceAnalysisAgent = require('./PreferenceAnalysisAgent');
const RecommendationAgent = require('./RecommendationAgent');
const RestaurantMatchingAgent = require('./RestaurantMatchingAgent');
const GroceryPurchaseAgent = require('./GroceryPurchaseAgent');

/**
 * Multi-Agent System Manager
 * Orchestrates collaboration between different AI agents
 */
class AgentManager {
  constructor() {
    this.agents = {
      foodSearch: new FoodSearchAgent(),
      healthAssessment: new HealthAssessmentAgent(),
      preferenceAnalysis: new PreferenceAnalysisAgent(),
      recommendation: new RecommendationAgent(),
      restaurantMatching: new RestaurantMatchingAgent(),
      groceryPurchase: new GroceryPurchaseAgent()
    };
  }

  /**
   * Main orchestration method for food recommendation workflow
   * @param {Object} userQuery - User's natural language query
   * @param {Object} userProfile - User's health and preference profile
   * @returns {Object} Complete recommendation with restaurant and grocery options
   */
  async processFoodRecommendation(userQuery, userProfile) {
    try {
      console.log('🤖 Starting multi-agent food recommendation process...');
      
      // Stage 1: Food Search and Health Assessment
      const foodCandidates = await this.agents.foodSearch.searchFoods(userQuery);
      const healthScores = await this.agents.healthAssessment.assessHealth(foodCandidates, userProfile);
      
      // Stage 2: Preference Analysis
      const preferenceScores = await this.agents.preferenceAnalysis.analyzePreferences(
        foodCandidates, 
        userProfile
      );
      
      // Stage 3: Generate Final Recommendations
      const recommendations = await this.agents.recommendation.generateRecommendations(
        foodCandidates,
        healthScores,
        preferenceScores,
        userProfile
      );

      // Stage 4: Prepare Restaurant and Grocery Options
      const restaurantOptions = await this.agents.restaurantMatching.findRestaurants(
        recommendations,
        userProfile.location
      );

      const groceryOptions = await this.agents.groceryPurchase.generateShoppingList(
        recommendations,
        userProfile.location
      );

      return {
        success: true,
        recommendations,
        restaurantOptions,
        groceryOptions,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error in multi-agent process:', error);
      throw new Error(`Multi-agent processing failed: ${error.message}`);
    }
  }

  /**
   * Process restaurant recommendation specifically
   * @param {Object} selectedFood - User's selected food item
   * @param {Object} userProfile - User's profile and location
   * @returns {Object} Restaurant recommendations
   */
  async processRestaurantRecommendation(selectedFood, userProfile) {
    try {
      return await this.agents.restaurantMatching.findRestaurants(
        [selectedFood], 
        userProfile.location
      );
    } catch (error) {
      console.error('❌ Error in restaurant recommendation:', error);
      throw new Error(`Restaurant recommendation failed: ${error.message}`);
    }
  }

  /**
   * Process grocery shopping recommendation
   * @param {Object} selectedFood - User's selected food item
   * @param {Object} userProfile - User's profile and location
   * @returns {Object} Grocery shopping options
   */
  async processGroceryRecommendation(selectedFood, userProfile) {
    try {
      return await this.agents.groceryPurchase.generateShoppingList(
        [selectedFood], 
        userProfile.location
      );
    } catch (error) {
      console.error('❌ Error in grocery recommendation:', error);
      throw new Error(`Grocery recommendation failed: ${error.message}`);
    }
  }

  /**
   * Get agent status and health
   * @returns {Object} Status of all agents
   */
  getAgentStatus() {
    const status = {};
    for (const [name, agent] of Object.entries(this.agents)) {
      status[name] = {
        name: agent.constructor.name,
        status: agent.isHealthy ? 'healthy' : 'unhealthy',
        lastActivity: agent.lastActivity || 'never'
      };
    }
    return status;
  }
}

module.exports = AgentManager;
