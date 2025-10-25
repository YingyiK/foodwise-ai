# Claude API 配置指南

## 🚀 从OpenAI迁移到Claude

您的FoodWise AI项目已成功从OpenAI迁移到Claude API！

### ✅ 已完成的更改

1. **依赖更新**: 替换 `openai` 为 `@anthropic-ai/sdk`
2. **环境变量**: 更新为 `ANTHROPIC_API_KEY`
3. **所有智能体**: 已更新为使用Claude API
4. **模型配置**: 使用 `claude-3-sonnet-20240229`

### 🔧 配置步骤

#### 1. 获取Claude API密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册账户并验证邮箱
3. 在API Keys页面创建新的API密钥
4. 复制API密钥

#### 2. 设置环境变量

```bash
# 复制环境变量模板
cp backend/env.example backend/.env

# 编辑 .env 文件，添加您的API密钥
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### 3. 测试配置

```bash
# 启动后端服务
cd backend
npm start

# 测试API端点
curl -X POST http://localhost:3001/api/food/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "userQuery": "我想吃健康的午餐",
    "userProfile": {
      "health_profile": {
        "age": 28,
        "dietary_restrictions": ["无麸质"],
        "health_goals": ["减重"],
        "allergies": []
      },
      "preference_profile": {
        "cuisine_preferences": ["中餐"],
        "taste_preferences": ["偏辣"],
        "disliked_foods": []
      },
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194
      }
    }
  }'
```

### 🧠 Claude模型优势

#### 相比OpenAI的优势：

1. **更好的中文理解**: Claude对中文语境理解更准确
2. **更长的上下文**: 支持更长的对话历史
3. **更安全的输出**: 内置安全机制，减少有害内容
4. **更好的推理能力**: 在复杂推理任务上表现更佳

#### 在FoodWise AI中的应用：

- **食品推荐**: 更准确理解中文饮食偏好
- **健康分析**: 更专业的营养建议
- **餐厅推荐**: 更好的中文餐厅描述
- **购物建议**: 更贴近中文用户习惯

### 📊 API使用统计

| 智能体 | 功能 | Claude模型 | 预期响应时间 |
|--------|------|------------|--------------|
| FoodSearchAgent | 食品搜索 | claude-3-sonnet | 2-3秒 |
| HealthAssessmentAgent | 健康评估 | claude-3-sonnet | 3-4秒 |
| PreferenceAnalysisAgent | 偏好分析 | claude-3-sonnet | 2-3秒 |
| RecommendationAgent | 推荐生成 | claude-3-sonnet | 4-5秒 |
| RestaurantMatchingAgent | 餐厅匹配 | claude-3-sonnet | 3-4秒 |
| GroceryPurchaseAgent | 购物建议 | claude-3-sonnet | 3-4秒 |

### 💰 成本对比

| 服务 | 模型 | 输入价格 | 输出价格 | 优势 |
|------|------|----------|----------|------|
| OpenAI | GPT-4 | $0.03/1K tokens | $0.06/1K tokens | 成熟生态 |
| Claude | Claude-3-Sonnet | $0.003/1K tokens | $0.015/1K tokens | 更便宜，中文更好 |

### 🔧 故障排除

#### 常见问题：

1. **API密钥错误**
   ```
   Error: Invalid API key
   ```
   解决：检查 `ANTHROPIC_API_KEY` 是否正确设置

2. **网络连接问题**
   ```
   Error: Network timeout
   ```
   解决：检查网络连接，考虑使用代理

3. **模型限制**
   ```
   Error: Rate limit exceeded
   ```
   解决：添加重试机制或降低请求频率

#### 调试模式：

```bash
# 启用详细日志
DEBUG=claude* npm start

# 测试单个智能体
node -e "
const FoodSearchAgent = require('./src/agents/FoodSearchAgent');
const agent = new FoodSearchAgent();
agent.searchFoods('我想吃健康的午餐').then(console.log);
"
```

### 🚀 部署到生产环境

#### AWS Lambda部署：

```bash
cd backend
npm run deploy
```

#### Docker部署：

```bash
docker-compose up -d
```

### 📈 性能优化

1. **缓存机制**: 对重复查询进行缓存
2. **批处理**: 批量处理多个请求
3. **异步处理**: 使用队列处理长时间任务
4. **监控**: 设置API使用监控

### 🎯 下一步

1. ✅ 配置API密钥
2. ✅ 测试所有智能体
3. ✅ 部署到生产环境
4. ✅ 监控API使用情况
5. ✅ 优化性能和成本

您的FoodWise AI现在完全使用Claude API，享受更好的中文理解和更低的成本！🎉
