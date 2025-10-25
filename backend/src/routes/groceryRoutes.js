const express = require('express');
const router = express.Router();

/**
 * POST /api/grocery/shopping-list
 * Generate shopping list for food recommendations
 */
router.post('/shopping-list', async (req, res) => {
  try {
    const { foodRecommendations, userProfile } = req.body;

    if (!foodRecommendations || !userProfile) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'foodRecommendations and userProfile are required'
      });
    }

    // Sample shopping list data
    const shoppingList = {
      recipes: [
        {
          id: 'recipe_001',
          name: 'Grilled Salmon with Quinoa',
          ingredients: [
            { name: 'Salmon fillet', quantity: '200g', unit: 'grams', category: 'meat' },
            { name: 'Quinoa', quantity: '100g', unit: 'grams', category: 'pantry' },
            { name: 'Broccoli', quantity: '150g', unit: 'grams', category: 'produce' },
            { name: 'Olive oil', quantity: '15ml', unit: 'ml', category: 'pantry' },
            { name: 'Lemon', quantity: '1', unit: 'piece', category: 'produce' }
          ],
          instructions: [
            'Preheat grill to medium-high heat',
            'Season salmon with salt and pepper',
            'Grill salmon for 4-5 minutes per side',
            'Cook quinoa according to package directions',
            'Steam broccoli until tender'
          ],
          prepTime: 15,
          cookTime: 20,
          servings: 2
        }
      ],
      items: [
        {
          category: 'produce',
          items: [
            { name: 'Broccoli', quantity: '150g', unit: 'grams', estimated: '$2.50' },
            { name: 'Lemon', quantity: '1', unit: 'piece', estimated: '$0.50' }
          ],
          count: 2
        },
        {
          category: 'meat',
          items: [
            { name: 'Salmon fillet', quantity: '200g', unit: 'grams', estimated: '$12.00' }
          ],
          count: 1
        },
        {
          category: 'pantry',
          items: [
            { name: 'Quinoa', quantity: '100g', unit: 'grams', estimated: '$3.00' },
            { name: 'Olive oil', quantity: '15ml', unit: 'ml', estimated: '$0.30' }
          ],
          count: 2
        }
      ],
      totalItems: 5,
      estimatedCost: '$18.30',
      shoppingTips: [
        '🥬 考虑购买有机蔬菜，特别是绿叶蔬菜',
        '📋 按商店布局顺序购物：农产品 → 肉类 → 乳制品 → 干货',
        '💰 比较价格，考虑购买商店品牌',
        '📅 计划一周的餐食，避免浪费'
      ],
      mealPrep: [
        '提前准备蔬菜，清洗并切好',
        '腌制肉类过夜，增加风味',
        '准备基础调料和香料',
        '考虑批量烹饪，分装保存'
      ]
    };

    res.json({
      success: true,
      data: shoppingList
    });

  } catch (error) {
    console.error('Error generating shopping list:', error);
    res.status(500).json({
      error: 'Shopping list generation failed',
      message: error.message
    });
  }
});

/**
 * GET /api/grocery/stores
 * Get nearby grocery stores
 */
router.get('/stores', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Latitude and longitude are required'
      });
    }

    // Sample grocery stores data
    const stores = [
      {
        id: 'store_001',
        name: 'Whole Foods Market',
        rating: 4.4,
        priceLevel: 3,
        vicinity: 'Castro Valley, CA',
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        distance: 0.8,
        phone: '(555) 123-4567',
        openingHours: [
          'Monday: 7:00 AM - 10:00 PM',
          'Tuesday: 7:00 AM - 10:00 PM',
          'Wednesday: 7:00 AM - 10:00 PM',
          'Thursday: 7:00 AM - 10:00 PM',
          'Friday: 7:00 AM - 10:00 PM',
          'Saturday: 7:00 AM - 10:00 PM',
          'Sunday: 8:00 AM - 9:00 PM'
        ],
        website: 'https://wholefoodsmarket.com',
        photos: [
          'https://example.com/wholefoods1.jpg',
          'https://example.com/wholefoods2.jpg'
        ],
        features: [
          'Organic produce',
          'Fresh seafood',
          'Bulk foods',
          'Hot food bar',
          'Wine selection'
        ],
        estimatedCost: '$28',
        coverage: '95%',
        bestFor: 'Organic and specialty items'
      },
      {
        id: 'store_002',
        name: 'Sprouts Farmers Market',
        rating: 4.3,
        priceLevel: 2,
        vicinity: 'San Francisco, CA',
        coordinates: {
          latitude: 37.7849,
          longitude: -122.4094
        },
        distance: 1.2,
        phone: '(555) 234-5678',
        openingHours: [
          'Monday: 7:00 AM - 10:00 PM',
          'Tuesday: 7:00 AM - 10:00 PM',
          'Wednesday: 7:00 AM - 10:00 PM',
          'Thursday: 7:00 AM - 10:00 PM',
          'Friday: 7:00 AM - 10:00 PM',
          'Saturday: 7:00 AM - 10:00 PM',
          'Sunday: 8:00 AM - 9:00 PM'
        ],
        website: 'https://sprouts.com',
        photos: [
          'https://example.com/sprouts1.jpg'
        ],
        features: [
          'Fresh produce',
          'Natural foods',
          'Vitamins and supplements',
          'Bulk bins',
          'Deli counter'
        ],
        estimatedCost: '$23',
        coverage: '90%',
        bestFor: 'Natural and organic foods at better prices'
      }
    ];

    res.json({
      success: true,
      data: {
        stores,
        totalFound: stores.length,
        searchCriteria: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radius: parseInt(radius)
        }
      }
    });

  } catch (error) {
    console.error('Error getting grocery stores:', error);
    res.status(500).json({
      error: 'Grocery store search failed',
      message: error.message
    });
  }
});

/**
 * POST /api/grocery/online-shopping
 * Get online shopping options
 */
router.post('/online-shopping', async (req, res) => {
  try {
    const { shoppingList, userLocation } = req.body;

    if (!shoppingList || !userLocation) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'shoppingList and userLocation are required'
      });
    }

    // Sample online shopping options
    const onlineOptions = [
      {
        platform: 'Instacart',
        name: 'Instacart Delivery',
        deliveryTime: '2小时内',
        deliveryFee: '$3.99',
        estimatedTotal: '$22.29',
        coverage: '95%',
        features: [
          '2小时内送达',
          'Whole Foods',
          'Sprouts',
          'Safeway'
        ],
        actionUrl: 'https://instacart.com/cart?items=salmon,quinoa,broccoli',
        partnerStores: [
          'Whole Foods Market',
          'Sprouts Farmers Market',
          'Safeway'
        ]
      },
      {
        platform: 'Amazon Fresh',
        name: 'Amazon Fresh',
        deliveryTime: '次日达',
        deliveryFee: 'Prime会员免运费',
        estimatedTotal: '$20.30',
        coverage: '85%',
        features: [
          'Prime会员免运费',
          'Whole Foods',
          '有机食品'
        ],
        actionUrl: 'https://amazon.com/fresh?items=salmon,quinoa,broccoli',
        partnerStores: [
          'Whole Foods Market',
          'Amazon Fresh'
        ]
      }
    ];

    res.json({
      success: true,
      data: {
        options: onlineOptions,
        totalOptions: onlineOptions.length,
        recommendations: {
          bestValue: 'Amazon Fresh',
          fastestDelivery: 'Instacart',
          bestCoverage: 'Instacart'
        }
      }
    });

  } catch (error) {
    console.error('Error getting online shopping options:', error);
    res.status(500).json({
      error: 'Online shopping options failed',
      message: error.message
    });
  }
});

/**
 * POST /api/grocery/check-availability
 * Check item availability at stores
 */
router.post('/check-availability', async (req, res) => {
  try {
    const { items, storeId } = req.body;

    if (!items || !storeId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'items and storeId are required'
      });
    }

    // Sample availability data
    const availability = {
      storeId,
      items: items.map(item => ({
        name: item.name,
        available: Math.random() > 0.2, // 80% availability
        inStock: Math.random() > 0.1, // 90% in stock
        alternatives: item.name.includes('salmon') ? ['Trout', 'Cod'] : [],
        price: `$${(Math.random() * 10 + 5).toFixed(2)}`,
        lastUpdated: new Date().toISOString()
      }))
    };

    res.json({
      success: true,
      data: availability
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      error: 'Availability check failed',
      message: error.message
    });
  }
});

module.exports = router;
