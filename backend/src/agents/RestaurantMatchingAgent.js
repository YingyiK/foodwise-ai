const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Restaurant Matching Agent
 * Finds restaurants using Yelp API based on food recommendations
 */
class RestaurantMatchingAgent {
  constructor() {
    this.yelpApiKey = process.env.YELP_API_KEY;
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.isHealthy = true;
    this.lastActivity = null;
    this.yelpBaseUrl = 'https://api.yelp.com/v3';
  }

  /**
   * Find restaurants based on food recommendations
   * @param {Array} recommendations - Food recommendations
   * @param {Object} userLocation - User's location
   * @returns {Object} Restaurant recommendations
   */
  async findRestaurants(recommendations, userLocation) {
    try {
      this.lastActivity = new Date().toISOString();
      console.log('🍽️ RestaurantMatchingAgent: Finding restaurants...');

      const restaurantResults = [];
      
      for (const recommendation of recommendations) {
        const restaurants = await this.searchRestaurantsForFood(recommendation, userLocation);
        restaurantResults.push({
          foodId: recommendation.id,
          foodName: recommendation.name,
          restaurants: restaurants
        });
      }

      // Get top 5 restaurants overall
      const allRestaurants = restaurantResults.flatMap(result => 
        result.restaurants.map(restaurant => ({
          ...restaurant,
          matchedFood: result.foodName
        }))
      );

      const topRestaurants = this.rankRestaurants(allRestaurants, userLocation);

      console.log(`✅ Found ${topRestaurants.length} restaurant recommendations`);
      return {
        success: true,
        restaurants: topRestaurants.slice(0, 5),
        totalFound: allRestaurants.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ RestaurantMatchingAgent error:', error);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Search restaurants for a specific food item
   * @param {Object} foodRecommendation - Food recommendation
   * @param {Object} userLocation - User's location
   * @returns {Array} Matching restaurants
   */
  async searchRestaurantsForFood(foodRecommendation, userLocation) {
    try {
      // Extract search terms from food recommendation
      const searchTerms = await this.extractRestaurantSearchTerms(foodRecommendation);
      
      // Search Yelp API
      const yelpResults = await this.searchYelpAPI(searchTerms, userLocation);
      
      // Process and enhance results
      const restaurants = await this.processRestaurantResults(yelpResults, foodRecommendation);
      
      return restaurants;

    } catch (error) {
      console.error('Error searching restaurants for food:', error);
      return [];
    }
  }

  /**
   * Extract search terms for restaurant search
   * @param {Object} foodRecommendation - Food recommendation
   * @returns {Object} Search terms
   */
  async extractRestaurantSearchTerms(foodRecommendation) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `You are a restaurant search expert. Extract the best search terms for finding restaurants that serve this food. Return a JSON object with: term (main search term), categories (Yelp categories), and cuisine (cuisine type).

            Food: ${foodRecommendation.name}
            Description: ${foodRecommendation.description}
            Ingredients: ${foodRecommendation.ingredients.join(', ')}
            Cuisine: ${foodRecommendation.cuisine}
            Cooking Method: ${foodRecommendation.cookingMethod}`
          }
        ]
      });

      return JSON.parse(response.content[0].text);
    } catch (error) {
      console.error('Error extracting search terms:', error);
      // Fallback search terms
      return {
        term: foodRecommendation.name,
        categories: ['restaurants'],
        cuisine: foodRecommendation.cuisine
      };
    }
  }

  /**
   * Search Yelp API
   * @param {Object} searchTerms - Search terms
   * @param {Object} userLocation - User's location
   * @returns {Array} Yelp API results
   */
  async searchYelpAPI(searchTerms, userLocation) {
    try {
      const params = {
        term: searchTerms.term,
        location: `${userLocation.latitude},${userLocation.longitude}`,
        radius: 5000, // 5km radius
        limit: 20,
        sort_by: 'best_match'
      };

      // Add categories if available
      if (searchTerms.categories && searchTerms.categories.length > 0) {
        params.categories = searchTerms.categories.join(',');
      }

      const response = await axios.get(`${this.yelpBaseUrl}/businesses/search`, {
        headers: {
          'Authorization': `Bearer ${this.yelpApiKey}`
        },
        params
      });

      return response.data.businesses || [];

    } catch (error) {
      console.error('Yelp API error:', error);
      return [];
    }
  }

  /**
   * Process and enhance restaurant results
   * @param {Array} yelpResults - Raw Yelp results
   * @param {Object} foodRecommendation - Food recommendation
   * @returns {Array} Enhanced restaurant data
   */
  async processRestaurantResults(yelpResults, foodRecommendation) {
    const restaurants = [];

    for (const business of yelpResults) {
      try {
        // Get detailed business information
        const businessDetails = await this.getBusinessDetails(business.id);
        
        // Calculate food matching score
        const foodMatchScore = await this.calculateFoodMatchScore(business, foodRecommendation);
        
        // Generate personalized recommendation
        const recommendation = await this.generateRestaurantRecommendation(
          business, 
          foodRecommendation, 
          foodMatchScore
        );

        const restaurant = {
          id: business.id,
          name: business.name,
          rating: business.rating,
          reviewCount: business.review_count,
          price: business.price,
          categories: business.categories.map(cat => cat.title),
          address: business.location.display_address.join(', '),
          phone: business.display_phone,
          distance: business.distance,
          coordinates: {
            latitude: business.coordinates.latitude,
            longitude: business.coordinates.longitude
          },
          imageUrl: business.image_url,
          url: business.url,
          isClosed: business.is_closed,
          
          // Enhanced data
          foodMatchScore,
          recommendation,
          estimatedCost: this.estimateCost(business.price, foodRecommendation),
          bestTimeToVisit: this.recommendBestTime(business),
          parkingInfo: businessDetails.parking,
          deliveryAvailable: businessDetails.transactions?.includes('delivery') || false,
          takeoutAvailable: businessDetails.transactions?.includes('pickup') || false
        };

        restaurants.push(restaurant);

      } catch (error) {
        console.error('Error processing restaurant:', error);
        continue;
      }
    }

    return restaurants;
  }

  /**
   * Get detailed business information from Yelp
   * @param {string} businessId - Yelp business ID
   * @returns {Object} Business details
   */
  async getBusinessDetails(businessId) {
    try {
      const response = await axios.get(`${this.yelpBaseUrl}/businesses/${businessId}`, {
        headers: {
          'Authorization': `Bearer ${this.yelpApiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting business details:', error);
      return {};
    }
  }

  /**
   * Calculate how well restaurant matches the food
   * @param {Object} business - Yelp business data
   * @param {Object} foodRecommendation - Food recommendation
   * @returns {number} Match score (0-100)
   */
  async calculateFoodMatchScore(business, foodRecommendation) {
    let score = 50; // Base score
    
    // Category matching
    const businessCategories = business.categories.map(cat => cat.title.toLowerCase());
    const foodCuisine = foodRecommendation.cuisine.toLowerCase();
    
    if (businessCategories.some(cat => cat.includes(foodCuisine))) {
      score += 20;
    }
    
    // Review analysis for food matching
    if (business.review_count > 50) {
      score += 10; // Popular restaurant
    }
    
    // Rating consideration
    if (business.rating >= 4.0) {
      score += 15;
    } else if (business.rating >= 3.5) {
      score += 10;
    }
    
    // Price matching (simplified)
    const foodComplexity = this.assessFoodComplexity(foodRecommendation);
    if (foodComplexity === 'high' && business.price === '$$$') {
      score += 10;
    } else if (foodComplexity === 'medium' && business.price === '$$') {
      score += 10;
    } else if (foodComplexity === 'low' && business.price === '$') {
      score += 10;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Assess food complexity for price matching
   * @param {Object} foodRecommendation - Food recommendation
   * @returns {string} Complexity level
   */
  assessFoodComplexity(foodRecommendation) {
    const complexIngredients = ['truffle', 'lobster', 'wagyu', 'foie gras'];
    const hasComplexIngredients = foodRecommendation.ingredients.some(ingredient =>
      complexIngredients.some(complex => ingredient.toLowerCase().includes(complex))
    );
    
    if (hasComplexIngredients || foodRecommendation.cookingMethod === 'sous vide') {
      return 'high';
    } else if (foodRecommendation.ingredients.length > 8) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Generate personalized restaurant recommendation
   * @param {Object} business - Restaurant data
   * @param {Object} foodRecommendation - Food recommendation
   * @param {number} foodMatchScore - Food match score
   * @returns {string} Personalized recommendation
   */
  async generateRestaurantRecommendation(business, foodRecommendation, foodMatchScore) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 150,
        temperature: 0.4,
        messages: [
          {
            role: "user",
            content: `You are a restaurant recommendation expert. Create a brief, personalized recommendation for this restaurant based on the food the user wants and the restaurant's characteristics. Be specific about why this restaurant is good for this particular food.

            Restaurant: ${business.name}
            Rating: ${business.rating}/5 (${business.review_count} reviews)
            Price: ${business.price}
            Categories: ${business.categories.map(cat => cat.title).join(', ')}
            Distance: ${Math.round(business.distance / 1000 * 0.621371 * 100) / 100} miles
            
            Food: ${foodRecommendation.name}
            Match Score: ${foodMatchScore}/100`
          }
        ]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating restaurant recommendation:', error);
      return `Great choice for ${foodRecommendation.name}! This restaurant has a ${business.rating}/5 rating and is ${Math.round(business.distance / 1000 * 0.621371 * 100) / 100} miles away.`;
    }
  }

  /**
   * Estimate cost for the food at this restaurant
   * @param {string} priceLevel - Restaurant price level ($, $$, $$$, $$$$)
   * @param {Object} foodRecommendation - Food recommendation
   * @returns {string} Estimated cost range
   */
  estimateCost(priceLevel, foodRecommendation) {
    const baseCosts = {
      '$': { min: 8, max: 15 },
      '$$': { min: 15, max: 25 },
      '$$$': { min: 25, max: 40 },
      '$$$$': { min: 40, max: 60 }
    };
    
    const base = baseCosts[priceLevel] || { min: 15, max: 25 };
    const complexity = this.assessFoodComplexity(foodRecommendation);
    
    let multiplier = 1;
    if (complexity === 'high') multiplier = 1.3;
    else if (complexity === 'low') multiplier = 0.8;
    
    return `$$${Math.round(base.min * multiplier)}-$$${Math.round(base.max * multiplier)}`;
  }

  /**
   * Recommend best time to visit
   * @param {Object} business - Restaurant data
   * @returns {string} Best time recommendation
   */
  recommendBestTime(business) {
    // This would typically use business hours data
    // For now, provide general recommendations
    if (business.rating >= 4.5) {
      return 'Popular spot - consider off-peak hours (2-4 PM or after 8 PM)';
    } else if (business.rating >= 4.0) {
      return 'Good choice - standard dining hours work well';
    } else {
      return 'Less crowded - flexible timing available';
    }
  }

  /**
   * Rank restaurants by overall score
   * @param {Array} restaurants - All restaurants
   * @param {Object} userLocation - User's location
   * @returns {Array} Ranked restaurants
   */
  rankRestaurants(restaurants, userLocation) {
    return restaurants
      .map(restaurant => ({
        ...restaurant,
        overallScore: this.calculateOverallRestaurantScore(restaurant, userLocation)
      }))
      .sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Calculate overall restaurant score
   * @param {Object} restaurant - Restaurant data
   * @param {Object} userLocation - User's location
   * @returns {number} Overall score
   */
  calculateOverallRestaurantScore(restaurant, userLocation) {
    // Weighted scoring: 40% food match, 30% Yelp rating, 20% distance, 10% price
    const foodMatchWeight = 0.4;
    const ratingWeight = 0.3;
    const distanceWeight = 0.2;
    const priceWeight = 0.1;
    
    const foodMatchScore = restaurant.foodMatchScore;
    const ratingScore = (restaurant.rating / 5) * 100;
    const distanceScore = Math.max(0, 100 - (restaurant.distance / 1000) * 20); // Penalty for distance
    const priceScore = this.calculatePriceScore(restaurant.price);
    
    return Math.round(
      (foodMatchScore * foodMatchWeight) +
      (ratingScore * ratingWeight) +
      (distanceScore * distanceWeight) +
      (priceScore * priceWeight)
    );
  }

  /**
   * Calculate price score based on price level
   * @param {string} priceLevel - Price level ($, $$, $$$, $$$$)
   * @returns {number} Price score (0-100)
   */
  calculatePriceScore(priceLevel) {
    const priceScores = {
      '$': 90,
      '$$': 80,
      '$$$': 60,
      '$$$$': 40
    };
    
    return priceScores[priceLevel] || 70;
  }
}

module.exports = RestaurantMatchingAgent;
