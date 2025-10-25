const express = require('express');
const router = express.Router();

/**
 * GET /api/restaurant/search
 * Search restaurants by location and criteria
 */
router.get('/search', async (req, res) => {
  try {
    const { 
      location, 
      radius = 5000, 
      categories, 
      price, 
      rating 
    } = req.query;

    if (!location) {
      return res.status(400).json({
        error: 'Location is required'
      });
    }

    // Sample restaurant data
    const restaurants = [
      {
        id: 'rest_001',
        name: 'The Healthy Kitchen',
        rating: 4.5,
        reviewCount: 234,
        price: '$$',
        categories: ['Healthy', 'Mediterranean'],
        address: '123 Main St, San Francisco, CA',
        phone: '(555) 123-4567',
        distance: 0.8,
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        imageUrl: 'https://example.com/restaurant1.jpg',
        url: 'https://yelp.com/biz/healthy-kitchen',
        isClosed: false,
        foodMatchScore: 92,
        recommendation: 'Perfect for healthy Mediterranean cuisine with fresh ingredients',
        estimatedCost: '$18-$25',
        bestTimeToVisit: 'Less crowded during weekday afternoons',
        parkingInfo: 'Street parking available',
        deliveryAvailable: true,
        takeoutAvailable: true
      },
      {
        id: 'rest_002',
        name: 'Ocean Fresh Seafood',
        rating: 4.3,
        reviewCount: 189,
        price: '$$$',
        categories: ['Seafood', 'Fine Dining'],
        address: '456 Ocean Ave, San Francisco, CA',
        phone: '(555) 234-5678',
        distance: 1.2,
        coordinates: {
          latitude: 37.7849,
          longitude: -122.4094
        },
        imageUrl: 'https://example.com/restaurant2.jpg',
        url: 'https://yelp.com/biz/ocean-fresh',
        isClosed: false,
        foodMatchScore: 88,
        recommendation: 'Excellent for fresh salmon and seafood dishes',
        estimatedCost: '$28-$40',
        bestTimeToVisit: 'Make reservations for dinner',
        parkingInfo: 'Valet parking available',
        deliveryAvailable: false,
        takeoutAvailable: true
      }
    ];

    res.json({
      success: true,
      data: {
        restaurants,
        totalFound: restaurants.length,
        searchCriteria: {
          location,
          radius,
          categories,
          price,
          rating
        }
      }
    });

  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({
      error: 'Restaurant search failed',
      message: error.message
    });
  }
});

/**
 * GET /api/restaurant/:id
 * Get detailed restaurant information
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Sample detailed restaurant data
    const restaurant = {
      id,
      name: 'The Healthy Kitchen',
      rating: 4.5,
      reviewCount: 234,
      price: '$$',
      categories: ['Healthy', 'Mediterranean'],
      address: '123 Main St, San Francisco, CA',
      phone: '(555) 123-4567',
      website: 'https://healthy-kitchen.com',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      openingHours: [
        'Monday: 11:00 AM - 9:00 PM',
        'Tuesday: 11:00 AM - 9:00 PM',
        'Wednesday: 11:00 AM - 9:00 PM',
        'Thursday: 11:00 AM - 9:00 PM',
        'Friday: 11:00 AM - 10:00 PM',
        'Saturday: 10:00 AM - 10:00 PM',
        'Sunday: 10:00 AM - 8:00 PM'
      ],
      photos: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
        'https://example.com/photo3.jpg'
      ],
      menu: {
        popularDishes: [
          {
            name: 'Grilled Salmon Bowl',
            description: 'Fresh salmon with quinoa and vegetables',
            price: '$18',
            calories: 420
          },
          {
            name: 'Mediterranean Chicken',
            description: 'Grilled chicken with herbs and olive oil',
            price: '$16',
            calories: 380
          }
        ]
      },
      reviews: [
        {
          id: 'rev_001',
          rating: 5,
          text: 'Amazing healthy food! The salmon was perfectly cooked.',
          author: 'Sarah M.',
          date: '2024-01-15'
        },
        {
          id: 'rev_002',
          rating: 4,
          text: 'Great atmosphere and fresh ingredients.',
          author: 'John D.',
          date: '2024-01-10'
        }
      ],
      amenities: {
        wifi: true,
        parking: 'Street parking',
        outdoorSeating: true,
        wheelchairAccessible: true,
        acceptsReservations: true
      }
    };

    res.json({
      success: true,
      data: restaurant
    });

  } catch (error) {
    console.error('Error getting restaurant details:', error);
    res.status(500).json({
      error: 'Restaurant details retrieval failed',
      message: error.message
    });
  }
});

/**
 * POST /api/restaurant/navigate
 * Get navigation directions to restaurant
 */
router.post('/navigate', async (req, res) => {
  try {
    const { restaurantId, userLocation } = req.body;

    if (!restaurantId || !userLocation) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'restaurantId and userLocation are required'
      });
    }

    // Sample navigation data
    const navigation = {
      restaurantId,
      directions: {
        distance: '0.8 miles',
        duration: '12 minutes',
        route: [
          {
            instruction: 'Head north on Main St',
            distance: '0.3 miles'
          },
          {
            instruction: 'Turn right on Oak Ave',
            distance: '0.2 miles'
          },
          {
            instruction: 'Turn left on Pine St',
            distance: '0.3 miles'
          },
          {
            instruction: 'Arrive at destination',
            distance: '0 feet'
          }
        ]
      },
      mapsUrl: `https://maps.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/37.7749,-122.4194`,
      estimatedArrival: new Date(Date.now() + 12 * 60 * 1000).toISOString()
    };

    res.json({
      success: true,
      data: navigation
    });

  } catch (error) {
    console.error('Error getting navigation:', error);
    res.status(500).json({
      error: 'Navigation failed',
      message: error.message
    });
  }
});

module.exports = router;
