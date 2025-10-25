const express = require('express');
const AgentManager = require('../agents/AgentManager');
const router = express.Router();

const agentManager = new AgentManager();

/**
 * GET /api/agents/status
 * Get status of all AI agents
 */
router.get('/status', async (req, res) => {
  try {
    const agentStatus = agentManager.getAgentStatus();
    
    res.json({
      success: true,
      data: {
        agents: agentStatus,
        overallHealth: Object.values(agentStatus).every(agent => agent.status === 'healthy'),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error getting agent status:', error);
    res.status(500).json({
      error: 'Agent status retrieval failed',
      message: error.message
    });
  }
});

/**
 * POST /api/agents/test
 * Test agent functionality
 */
router.post('/test', async (req, res) => {
  try {
    const { agentType, testData } = req.body;

    if (!agentType) {
      return res.status(400).json({
        error: 'agentType is required'
      });
    }

    let testResult;
    
    switch (agentType) {
      case 'foodSearch':
        testResult = await agentManager.agents.foodSearch.searchFoods(
          testData?.query || 'healthy lunch'
        );
        break;
        
      case 'healthAssessment':
        testResult = await agentManager.agents.healthAssessment.assessHealth(
          testData?.foods || [],
          testData?.userProfile || {}
        );
        break;
        
      case 'preferenceAnalysis':
        testResult = await agentManager.agents.preferenceAnalysis.analyzePreferences(
          testData?.foods || [],
          testData?.userProfile || {}
        );
        break;
        
      case 'restaurantMatching':
        testResult = await agentManager.agents.restaurantMatching.findRestaurants(
          testData?.recommendations || [],
          testData?.userLocation || { latitude: 37.7749, longitude: -122.4194 }
        );
        break;
        
      case 'groceryPurchase':
        testResult = await agentManager.agents.groceryPurchase.generateShoppingList(
          testData?.recommendations || [],
          testData?.userLocation || { latitude: 37.7749, longitude: -122.4194 }
        );
        break;
        
      default:
        return res.status(400).json({
          error: 'Invalid agent type',
          message: 'Supported types: foodSearch, healthAssessment, preferenceAnalysis, restaurantMatching, groceryPurchase'
        });
    }

    res.json({
      success: true,
      data: {
        agentType,
        testResult,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error testing agent:', error);
    res.status(500).json({
      error: 'Agent test failed',
      message: error.message
    });
  }
});

/**
 * POST /api/agents/retrain
 * Retrain agent models (placeholder)
 */
router.post('/retrain', async (req, res) => {
  try {
    const { agentType, trainingData } = req.body;

    // This would typically trigger model retraining
    // For now, return a placeholder response
    const retrainResult = {
      agentType,
      status: 'retraining_initiated',
      estimatedTime: '2-4 hours',
      message: 'Model retraining has been initiated. You will be notified when complete.',
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: retrainResult
    });

  } catch (error) {
    console.error('Error retraining agent:', error);
    res.status(500).json({
      error: 'Agent retraining failed',
      message: error.message
    });
  }
});

/**
 * GET /api/agents/performance
 * Get agent performance metrics
 */
router.get('/performance', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;

    // Sample performance metrics
    const performanceMetrics = {
      timeRange,
      agents: {
        foodSearch: {
          accuracy: 89.2,
          responseTime: 1.2,
          successRate: 98.5,
          totalRequests: 1250
        },
        healthAssessment: {
          accuracy: 91.8,
          responseTime: 2.1,
          successRate: 97.2,
          totalRequests: 1180
        },
        preferenceAnalysis: {
          accuracy: 87.5,
          responseTime: 1.8,
          successRate: 96.8,
          totalRequests: 1100
        },
        restaurantMatching: {
          accuracy: 85.3,
          responseTime: 3.2,
          successRate: 94.5,
          totalRequests: 980
        },
        groceryPurchase: {
          accuracy: 88.7,
          responseTime: 2.5,
          successRate: 95.1,
          totalRequests: 890
        }
      },
      overall: {
        averageAccuracy: 88.5,
        averageResponseTime: 2.1,
        averageSuccessRate: 96.4,
        totalRequests: 5400
      },
      trends: {
        accuracyTrend: 'increasing',
        responseTimeTrend: 'stable',
        successRateTrend: 'increasing'
      }
    };

    res.json({
      success: true,
      data: performanceMetrics
    });

  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({
      error: 'Performance metrics retrieval failed',
      message: error.message
    });
  }
});

/**
 * POST /api/agents/optimize
 * Optimize agent performance
 */
router.post('/optimize', async (req, res) => {
  try {
    const { optimizationType, parameters } = req.body;

    if (!optimizationType) {
      return res.status(400).json({
        error: 'optimizationType is required'
      });
    }

    // Sample optimization result
    const optimizationResult = {
      optimizationType,
      parameters,
      status: 'optimization_initiated',
      expectedImprovement: {
        accuracy: '+2-5%',
        responseTime: '-10-20%',
        successRate: '+1-3%'
      },
      estimatedDuration: '30-60 minutes',
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: optimizationResult
    });

  } catch (error) {
    console.error('Error optimizing agents:', error);
    res.status(500).json({
      error: 'Agent optimization failed',
      message: error.message
    });
  }
});

module.exports = router;
