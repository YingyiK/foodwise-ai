#!/usr/bin/env node

/**
 * 配置检查脚本
 * 验证所有必要的环境变量和依赖
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 检查FoodWise AI配置...\n');

// 检查环境变量文件
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env文件存在');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // 检查Claude配置
  if (envContent.includes('ANTHROPIC_API_KEY')) {
    console.log('✅ Claude API配置已设置');
  } else {
    console.log('❌ 缺少ANTHROPIC_API_KEY配置');
  }
  
  // 检查其他必要配置
  const requiredConfigs = [
    'YELP_API_KEY',
    'GOOGLE_MAPS_API_KEY',
    'MONGODB_URI',
    'JWT_SECRET'
  ];
  
  requiredConfigs.forEach(config => {
    if (envContent.includes(config)) {
      console.log(`✅ ${config} 已配置`);
    } else {
      console.log(`❌ 缺少 ${config} 配置`);
    }
  });
  
} else {
  console.log('❌ .env文件不存在');
  console.log('💡 请运行: cp backend/env.example backend/.env');
}

// 检查依赖
console.log('\n📦 检查依赖...');

const backendPackageJson = path.join(__dirname, 'backend', 'package.json');
if (fs.existsSync(backendPackageJson)) {
  const packageJson = JSON.parse(fs.readFileSync(backendPackageJson, 'utf8'));
  
  if (packageJson.dependencies['@anthropic-ai/sdk']) {
    console.log('✅ @anthropic-ai/sdk 已安装');
  } else {
    console.log('❌ 缺少 @anthropic-ai/sdk 依赖');
  }
  
  if (packageJson.dependencies['express']) {
    console.log('✅ Express.js 已安装');
  } else {
    console.log('❌ 缺少 Express.js 依赖');
  }
}

const frontendPackageJson = path.join(__dirname, 'frontend', 'package.json');
if (fs.existsSync(frontendPackageJson)) {
  console.log('✅ 前端依赖配置存在');
} else {
  console.log('❌ 前端package.json不存在');
}

// 检查智能体文件
console.log('\n🤖 检查AI智能体...');

const agentsPath = path.join(__dirname, 'backend', 'src', 'agents');
const agentFiles = [
  'FoodSearchAgent.js',
  'HealthAssessmentAgent.js',
  'PreferenceAnalysisAgent.js',
  'RecommendationAgent.js',
  'RestaurantMatchingAgent.js',
  'GroceryPurchaseAgent.js'
];

agentFiles.forEach(agentFile => {
  const agentPath = path.join(agentsPath, agentFile);
  if (fs.existsSync(agentPath)) {
    const content = fs.readFileSync(agentPath, 'utf8');
    if (content.includes('@anthropic-ai/sdk')) {
      console.log(`✅ ${agentFile} 已更新为Claude`);
    } else {
      console.log(`❌ ${agentFile} 仍使用OpenAI`);
    }
  } else {
    console.log(`❌ ${agentFile} 不存在`);
  }
});

console.log('\n🎯 配置检查完成！');
console.log('\n📝 下一步:');
console.log('1. 设置您的ANTHROPIC_API_KEY');
console.log('2. 运行: npm run dev');
console.log('3. 访问: http://localhost:3000');
