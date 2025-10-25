const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Grocery Purchase Agent
 * Generates shopping lists and finds grocery stores
 */
class GroceryPurchaseAgent {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.isHealthy = true;
    this.lastActivity = null;
    this.groceryPartners = {
      instacart: {
        name: 'Instacart',
        apiKey: process.env.INSTACART_API_KEY,
        baseUrl: 'https://api.instacart.com'
      },
      amazonFresh: {
        name: 'Amazon Fresh',
        apiKey: process.env.AMAZON_FRESH_API_KEY,
        baseUrl: 'https://api.amazon.com'
      }
    };
  }

  /**
   * Generate shopping list and grocery options
   * @param {Array} recommendations - Food recommendations
   * @param {Object} userLocation - User's location
   * @returns {Object} Grocery shopping options
   */
  async generateShoppingList(recommendations, userLocation) {
    try {
      this.lastActivity = new Date().toISOString();
      console.log('🛒 GroceryPurchaseAgent: Generating shopping list...');

      // Generate comprehensive shopping list
      const shoppingList = await this.createShoppingList(recommendations);
      
      // Find nearby grocery stores
      const groceryStores = await this.findNearbyGroceryStores(userLocation);
      
      // Generate online shopping options
      const onlineOptions = await this.generateOnlineShoppingOptions(shoppingList, userLocation);
      
      // Calculate cost estimates
      const costEstimates = await this.calculateCostEstimates(shoppingList, groceryStores, onlineOptions);

      console.log(`✅ Generated shopping list with ${shoppingList.items.length} items`);
      return {
        success: true,
        shoppingList,
        groceryStores: groceryStores.slice(0, 3), // Top 3 stores
        onlineOptions,
        costEstimates,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ GroceryPurchaseAgent error:', error);
      this.isHealthy = false;
      throw error;
    }
  }

  /**
   * Create comprehensive shopping list from food recommendations
   * @param {Array} recommendations - Food recommendations
   * @returns {Object} Shopping list with items and categories
   */
  async createShoppingList(recommendations) {
    try {
      const allIngredients = [];
      const recipes = [];

      // Extract ingredients from each recommendation
      for (const recommendation of recommendations) {
        const recipe = await this.createRecipeFromRecommendation(recommendation);
        recipes.push(recipe);
        allIngredients.push(...recipe.ingredients);
      }

      // Consolidate and optimize ingredients
      const optimizedIngredients = this.optimizeIngredientList(allIngredients);
      
      // Categorize ingredients
      const categorizedIngredients = this.categorizeIngredients(optimizedIngredients);
      
      // Generate shopping tips
      const shoppingTips = await this.generateShoppingTips(categorizedIngredients);

      return {
        recipes,
        items: categorizedIngredients,
        totalItems: categorizedIngredients.length,
        estimatedCost: this.estimateShoppingCost(categorizedIngredients),
        shoppingTips,
        mealPrep: this.generateMealPrepSuggestions(recipes)
      };

    } catch (error) {
      console.error('Error creating shopping list:', error);
      return {
        recipes: [],
        items: [],
        totalItems: 0,
        estimatedCost: '$0',
        shoppingTips: ['Check your pantry first', 'Buy fresh ingredients'],
        mealPrep: []
      };
    }
  }

  /**
   * Create detailed recipe from food recommendation
   * @param {Object} recommendation - Food recommendation
   * @returns {Object} Detailed recipe
   */
  async createRecipeFromRecommendation(recommendation) {
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `You are a cooking expert. Create a detailed recipe with specific ingredient quantities and cooking instructions for this food. Return a JSON object with: ingredients (array of objects with name, quantity, unit, category), instructions (array of steps), prepTime, cookTime, servings.

            Food: ${recommendation.name}
            Description: ${recommendation.description}
            Ingredients: ${recommendation.ingredients.join(', ')}
            Cooking Method: ${recommendation.cookingMethod || 'grilled'}`
          }
        ]
      });

      const recipe = JSON.parse(response.content[0].text);
      return {
        id: recommendation.id,
        name: recommendation.name,
        ...recipe
      };
    } catch (error) {
      console.error('Error creating recipe:', error);
      // Fallback recipe
      return {
        id: recommendation.id,
        name: recommendation.name,
        ingredients: recommendation.ingredients.map(ingredient => ({
          name: ingredient,
          quantity: '1',
          unit: 'portion',
          category: 'produce'
        })),
        instructions: ['Follow the cooking method specified'],
        prepTime: 15,
        cookTime: 30,
        servings: 2
      };
    }
  }

  /**
   * Optimize ingredient list by consolidating duplicates
   * @param {Array} ingredients - All ingredients
   * @returns {Array} Optimized ingredient list
   */
  optimizeIngredientList(ingredients) {
    const ingredientMap = new Map();
    
    for (const ingredient of ingredients) {
      const key = ingredient.name.toLowerCase();
      if (ingredientMap.has(key)) {
        // Merge quantities if same ingredient
        const existing = ingredientMap.get(key);
        existing.quantity = this.mergeQuantities(existing.quantity, ingredient.quantity);
      } else {
        ingredientMap.set(key, { ...ingredient });
      }
    }
    
    return Array.from(ingredientMap.values());
  }

  /**
   * Merge ingredient quantities
   * @param {string} qty1 - First quantity
   * @param {string} qty2 - Second quantity
   * @returns {string} Merged quantity
   */
  mergeQuantities(qty1, qty2) {
    // Simple merge - in real implementation, would parse and add quantities
    const num1 = parseFloat(qty1) || 1;
    const num2 = parseFloat(qty2) || 1;
    return `${num1 + num2}`;
  }

  /**
   * Categorize ingredients for better shopping organization
   * @param {Array} ingredients - Ingredients to categorize
   * @returns {Array} Categorized ingredients
   */
  categorizeIngredients(ingredients) {
    const categories = {
      produce: [],
      meat: [],
      dairy: [],
      pantry: [],
      frozen: [],
      bakery: [],
      other: []
    };

    for (const ingredient of ingredients) {
      const category = this.determineIngredientCategory(ingredient);
      if (categories[category]) {
        categories[category].push(ingredient);
      } else {
        categories.other.push(ingredient);
      }
    }

    return Object.entries(categories)
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({
        category,
        items,
        count: items.length
      }));
  }

  /**
   * Determine ingredient category
   * @param {Object} ingredient - Ingredient object
   * @returns {string} Category name
   */
  determineIngredientCategory(ingredient) {
    const name = ingredient.name.toLowerCase();
    
    if (ingredient.category) {
      return ingredient.category;
    }
    
    // Produce
    if (['tomato', 'onion', 'garlic', 'lettuce', 'spinach', 'carrot', 'broccoli', 'pepper'].some(veg => name.includes(veg))) {
      return 'produce';
    }
    
    // Meat
    if (['chicken', 'beef', 'pork', 'salmon', 'fish', 'turkey'].some(meat => name.includes(meat))) {
      return 'meat';
    }
    
    // Dairy
    if (['cheese', 'milk', 'butter', 'yogurt', 'cream'].some(dairy => name.includes(dairy))) {
      return 'dairy';
    }
    
    // Pantry
    if (['rice', 'pasta', 'flour', 'sugar', 'oil', 'vinegar', 'spice'].some(pantry => name.includes(pantry))) {
      return 'pantry';
    }
    
    return 'other';
  }

  /**
   * Find nearby grocery stores using Google Maps API
   * @param {Object} userLocation - User's location
   * @returns {Array} Nearby grocery stores
   */
  async findNearbyGroceryStores(userLocation) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${userLocation.latitude},${userLocation.longitude}`,
          radius: 5000, // 5km radius
          type: 'grocery_or_supermarket',
          key: this.googleMapsApiKey
        }
      });

      const stores = response.data.results || [];
      
      // Enhance store data
      const enhancedStores = await Promise.all(
        stores.slice(0, 10).map(async (store) => {
          const details = await this.getStoreDetails(store.place_id);
          return {
            id: store.place_id,
            name: store.name,
            rating: store.rating,
            priceLevel: store.price_level,
            vicinity: store.vicinity,
            coordinates: {
              latitude: store.geometry.location.lat,
              longitude: store.geometry.location.lng
            },
            distance: this.calculateDistance(userLocation, store.geometry.location),
            ...details
          };
        })
      );

      return enhancedStores.sort((a, b) => a.distance - b.distance);

    } catch (error) {
      console.error('Error finding grocery stores:', error);
      return [];
    }
  }

  /**
   * Get detailed store information
   * @param {string} placeId - Google Places place ID
   * @returns {Object} Store details
   */
  async getStoreDetails(placeId) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,formatted_phone_number,opening_hours,website,photos',
          key: this.googleMapsApiKey
        }
      });

      const result = response.data.result;
      return {
        phone: result.formatted_phone_number,
        openingHours: result.opening_hours?.weekday_text || [],
        website: result.website,
        photos: result.photos?.slice(0, 3).map(photo => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.googleMapsApiKey}`
        ) || []
      };
    } catch (error) {
      console.error('Error getting store details:', error);
      return {};
    }
  }

  /**
   * Calculate distance between two points
   * @param {Object} point1 - First point
   * @param {Object} point2 - Second point
   * @returns {number} Distance in meters
   */
  calculateDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat - point1.latitude) * Math.PI/180;
    const Δλ = (point2.lng - point1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * Generate online shopping options
   * @param {Object} shoppingList - Shopping list
   * @param {Object} userLocation - User's location
   * @returns {Array} Online shopping options
   */
  async generateOnlineShoppingOptions(shoppingList, userLocation) {
    const options = [];

    // Instacart option
    if (this.groceryPartners.instacart.apiKey) {
      options.push({
        platform: 'Instacart',
        name: 'Instacart Delivery',
        deliveryTime: '2小时内',
        deliveryFee: '$3.99',
        estimatedTotal: this.estimateInstacartCost(shoppingList),
        coverage: this.calculateItemCoverage(shoppingList, 'instacart'),
        features: ['2小时内送达', 'Whole Foods', 'Sprouts', 'Safeway'],
        actionUrl: await this.generateInstacartCartUrl(shoppingList, userLocation)
      });
    }

    // Amazon Fresh option
    if (this.groceryPartners.amazonFresh.apiKey) {
      options.push({
        platform: 'Amazon Fresh',
        name: 'Amazon Fresh',
        deliveryTime: '次日达',
        deliveryFee: 'Prime会员免运费',
        estimatedTotal: this.estimateAmazonFreshCost(shoppingList),
        coverage: this.calculateItemCoverage(shoppingList, 'amazon'),
        features: ['Prime会员免运费', 'Whole Foods', '有机食品'],
        actionUrl: await this.generateAmazonFreshUrl(shoppingList, userLocation)
      });
    }

    return options;
  }

  /**
   * Calculate cost estimates for different options
   * @param {Object} shoppingList - Shopping list
   * @param {Array} groceryStores - Grocery stores
   * @param {Array} onlineOptions - Online options
   * @returns {Object} Cost estimates
   */
  async calculateCostEstimates(shoppingList, groceryStores, onlineOptions) {
    return {
      inStore: {
        average: shoppingList.estimatedCost,
        range: `${shoppingList.estimatedCost} - $${parseInt(shoppingList.estimatedCost.replace('$', '')) + 10}`,
        stores: groceryStores.slice(0, 3).map(store => ({
          name: store.name,
          estimatedCost: shoppingList.estimatedCost,
          distance: `${Math.round(store.distance / 1000 * 0.621371 * 100) / 100} 英里`
        }))
      },
      online: onlineOptions.map(option => ({
        platform: option.platform,
        estimatedCost: option.estimatedTotal,
        deliveryFee: option.deliveryFee,
        totalCost: option.estimatedTotal
      }))
    };
  }

  /**
   * Estimate shopping cost
   * @param {Array} categorizedIngredients - Categorized ingredients
   * @returns {string} Estimated cost
   */
  estimateShoppingCost(categorizedIngredients) {
    let totalCost = 0;
    
    for (const category of categorizedIngredients) {
      for (const item of category.items) {
        // Simple cost estimation based on category
        const categoryCosts = {
          produce: 3,
          meat: 8,
          dairy: 4,
          pantry: 2,
          frozen: 5,
          bakery: 3,
          other: 2
        };
        
        totalCost += categoryCosts[category.category] || 2;
      }
    }
    
    return `$${Math.round(totalCost)}`;
  }

  /**
   * Generate shopping tips
   * @param {Array} categorizedIngredients - Categorized ingredients
   * @returns {Array} Shopping tips
   */
  async generateShoppingTips(categorizedIngredients) {
    const tips = [];
    
    // Check for organic recommendations
    const hasProduce = categorizedIngredients.some(cat => cat.category === 'produce');
    if (hasProduce) {
      tips.push('🥬 考虑购买有机蔬菜，特别是绿叶蔬菜');
    }
    
    // Check for meat
    const hasMeat = categorizedIngredients.some(cat => cat.category === 'meat');
    if (hasMeat) {
      tips.push('🥩 选择新鲜肉类，避免预包装产品');
    }
    
    // General tips
    tips.push('📋 按商店布局顺序购物：农产品 → 肉类 → 乳制品 → 干货');
    tips.push('💰 比较价格，考虑购买商店品牌');
    tips.push('📅 计划一周的餐食，避免浪费');
    
    return tips;
  }

  /**
   * Generate meal prep suggestions
   * @param {Array} recipes - Recipes
   * @returns {Array} Meal prep suggestions
   */
  generateMealPrepSuggestions(recipes) {
    return [
      '提前准备蔬菜，清洗并切好',
      '腌制肉类过夜，增加风味',
      '准备基础调料和香料',
      '考虑批量烹饪，分装保存'
    ];
  }

  /**
   * Calculate item coverage for platform
   * @param {Object} shoppingList - Shopping list
   * @param {string} platform - Platform name
   * @returns {string} Coverage percentage
   */
  calculateItemCoverage(shoppingList, platform) {
    // Simplified coverage calculation
    const coverageMap = {
      instacart: 95,
      amazon: 85
    };
    
    return `${coverageMap[platform] || 80}%`;
  }

  /**
   * Estimate Instacart cost
   * @param {Object} shoppingList - Shopping list
   * @returns {string} Estimated cost
   */
  estimateInstacartCost(shoppingList) {
    const baseCost = parseInt(shoppingList.estimatedCost.replace('$', ''));
    return `$${baseCost + 5}`; // Add markup for delivery
  }

  /**
   * Estimate Amazon Fresh cost
   * @param {Object} shoppingList - Shopping list
   * @returns {string} Estimated cost
   */
  estimateAmazonFreshCost(shoppingList) {
    const baseCost = parseInt(shoppingList.estimatedCost.replace('$', ''));
    return `$${baseCost + 3}`; // Add markup for delivery
  }

  /**
   * Generate Instacart cart URL
   * @param {Object} shoppingList - Shopping list
   * @param {Object} userLocation - User's location
   * @returns {string} Cart URL
   */
  async generateInstacartCartUrl(shoppingList, userLocation) {
    // This would integrate with Instacart API
    return `https://instacart.com/cart?items=${shoppingList.items.map(item => item.name).join(',')}`;
  }

  /**
   * Generate Amazon Fresh URL
   * @param {Object} shoppingList - Shopping list
   * @param {Object} userLocation - User's location
   * @returns {string} Amazon Fresh URL
   */
  async generateAmazonFreshUrl(shoppingList, userLocation) {
    // This would integrate with Amazon Fresh API
    return `https://amazon.com/fresh?items=${shoppingList.items.map(item => item.name).join(',')}`;
  }
}

module.exports = GroceryPurchaseAgent;
