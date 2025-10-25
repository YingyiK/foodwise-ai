#!/bin/bash

echo "🚀 Starting FoodWise AI Database Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start database services
echo "📦 Starting MongoDB, Redis, and PostgreSQL..."
docker-compose up -d mongodb redis postgres

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "🔍 Checking service status..."

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running on port 27017"
else
    echo "❌ MongoDB failed to start"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running on port 6379"
else
    echo "❌ Redis failed to start"
fi

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U admin > /dev/null 2>&1; then
    echo "✅ PostgreSQL is running on port 5432"
else
    echo "❌ PostgreSQL failed to start"
fi

echo ""
echo "🌐 Database Management UIs:"
echo "   📊 MongoDB Express: http://localhost:8081 (admin/admin123)"
echo "   🔴 Redis Commander: http://localhost:8082"
echo ""
echo "🔗 Connection Strings:"
echo "   MongoDB: mongodb://admin:password123@localhost:27017/foodwise?authSource=admin"
echo "   Redis: redis://localhost:6379"
echo "   PostgreSQL: postgresql://admin:password123@localhost:5432/foodwise"
echo ""
echo "✅ Database services are ready!"
