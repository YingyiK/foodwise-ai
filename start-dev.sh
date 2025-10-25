#!/bin/bash

echo "🚀 启动FoodWise AI开发环境..."

# 检查后端是否在运行
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "📦 启动后端服务..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # 等待后端启动
    echo "⏳ 等待后端启动..."
    sleep 5
else
    echo "✅ 后端服务已在运行"
fi

# 启动前端
echo "🎨 启动前端服务..."
cd frontend
npm start &
FRONTEND_PID=$!

echo "🎉 开发环境启动完成！"
echo "📊 后端: http://localhost:3001"
echo "🎨 前端: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait
