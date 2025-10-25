#!/usr/bin/env node

/**
 * Claude API 测试脚本
 * 测试所有智能体的Claude集成
 */

const Anthropic = require('@anthropic-ai/sdk');

// 检查环境变量
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ 请设置 ANTHROPIC_API_KEY 环境变量');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function testClaudeConnection() {
  console.log('🧪 测试Claude API连接...');
  
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "你好，请简单介绍一下你自己。"
        }
      ]
    });
    
    console.log('✅ Claude API连接成功！');
    console.log('📝 响应:', response.content[0].text);
    return true;
  } catch (error) {
    console.error('❌ Claude API连接失败:', error.message);
    return false;
  }
}

async function testFoodSearchAgent() {
  console.log('\n🔍 测试食品搜索智能体...');
  
  try {
    const FoodSearchAgent = require('./backend/src/agents/FoodSearchAgent');
    const agent = new FoodSearchAgent();
    
    const result = await agent.searchFoods('我想吃健康的午餐');
    console.log('✅ 食品搜索智能体测试成功！');
    console.log('📊 找到', result.length, '个食品候选');
    return true;
  } catch (error) {
    console.error('❌ 食品搜索智能体测试失败:', error.message);
    return false;
  }
}

async function testHealthAssessmentAgent() {
  console.log('\n🏥 测试健康评估智能体...');
  
  try {
    const HealthAssessmentAgent = require('./backend/src/agents/HealthAssessmentAgent');
    const agent = new HealthAssessmentAgent();
    
    const sampleFood = {
      id: 'test_001',
      name: 'Grilled Salmon',
      nutrition: { calories: 420, protein: 35, carbs: 25, fat: 18, fiber: 4 }
    };
    
    const userProfile = {
      health_profile: {
        age: 28,
        health_goals: ['减重'],
        dietary_restrictions: []
      }
    };
    
    const result = await agent.assessHealth([sampleFood], userProfile);
    console.log('✅ 健康评估智能体测试成功！');
    console.log('📊 健康评分:', result[0].healthScore);
    return true;
  } catch (error) {
    console.error('❌ 健康评估智能体测试失败:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 开始Claude集成测试...\n');
  
  const tests = [
    { name: 'Claude API连接', fn: testClaudeConnection },
    { name: '食品搜索智能体', fn: testFoodSearchAgent },
    { name: '健康评估智能体', fn: testHealthAssessmentAgent }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const success = await test.fn();
      if (success) passed++;
    } catch (error) {
      console.error(`❌ ${test.name} 测试异常:`, error.message);
    }
  }
  
  console.log('\n📊 测试结果:');
  console.log(`✅ 通过: ${passed}/${total}`);
  console.log(`❌ 失败: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 所有测试通过！Claude集成成功！');
    console.log('\n📝 下一步:');
    console.log('1. 设置完整的API密钥');
    console.log('2. 启动后端服务: npm start');
    console.log('3. 启动前端服务: npm run dev');
  } else {
    console.log('\n⚠️  部分测试失败，请检查配置');
  }
}

// 运行测试
runAllTests().catch(console.error);
