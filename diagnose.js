#!/usr/bin/env node

/**
 * FoodWise AI 问题诊断脚本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 FoodWise AI 问题诊断...\n');

// 检查项目结构
console.log('📁 检查项目结构...');
const requiredDirs = ['backend', 'frontend'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ 目录存在`);
  } else {
    console.log(`❌ ${dir}/ 目录不存在`);
  }
});

// 检查关键文件
console.log('\n📄 检查关键文件...');
const keyFiles = [
  'backend/src/index.js',
  'backend/package.json',
  'frontend/src/App.js',
  'frontend/src/index.tsx',
  'frontend/package.json'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} 存在`);
  } else {
    console.log(`❌ ${file} 不存在`);
  }
});

// 检查依赖
console.log('\n📦 检查依赖...');
try {
  const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  if (backendPackage.dependencies['@anthropic-ai/sdk']) {
    console.log('✅ 后端Claude依赖已安装');
  } else {
    console.log('❌ 后端缺少Claude依赖');
  }
} catch (error) {
  console.log('❌ 无法读取后端package.json');
}

try {
  const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  if (frontendPackage.dependencies['react']) {
    console.log('✅ 前端React依赖已安装');
  } else {
    console.log('❌ 前端缺少React依赖');
  }
} catch (error) {
  console.log('❌ 无法读取前端package.json');
}

// 检查端口占用
console.log('\n🌐 检查端口占用...');
try {
  execSync('lsof -ti:3001', { stdio: 'pipe' });
  console.log('✅ 端口3001已被占用（后端可能正在运行）');
} catch (error) {
  console.log('⚠️  端口3001未被占用（后端可能未启动）');
}

try {
  execSync('lsof -ti:3000', { stdio: 'pipe' });
  console.log('✅ 端口3000已被占用（前端可能正在运行）');
} catch (error) {
  console.log('⚠️  端口3000未被占用（前端可能未启动）');
}

// 检查环境变量
console.log('\n🔧 检查环境变量...');
const envPath = 'backend/.env';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('ANTHROPIC_API_KEY')) {
    console.log('✅ Claude API密钥已配置');
  } else {
    console.log('❌ 缺少Claude API密钥配置');
  }
} else {
  console.log('❌ .env文件不存在');
}

console.log('\n🎯 诊断完成！');
console.log('\n💡 如果仍有问题，请尝试：');
console.log('1. 删除node_modules并重新安装: rm -rf */node_modules && npm install');
console.log('2. 检查防火墙设置');
console.log('3. 确保端口3000和3001未被其他程序占用');
console.log('4. 运行: ./start-dev.sh 启动开发环境');
