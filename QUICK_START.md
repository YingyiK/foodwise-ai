# 🚀 FoodWise AI Quick Start Guide

## Prerequisites

- Node.js 18+ 
- npm 9+
- MongoDB (local or cloud)
- API Keys (see Environment Setup)

## Environment Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd FoodWise

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Variables

Create `.env` file in the `backend` directory:

```env
# Anthropic Claude Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Yelp API Configuration
YELP_API_KEY=your_yelp_api_key_here

# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-west-2

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/foodwise

# Grocery Partner APIs
INSTACART_API_KEY=your_instacart_api_key_here
AMAZON_FRESH_API_KEY=your_amazon_fresh_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### 3. API Keys Setup

#### Anthropic Claude API
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account and get your API key
3. Add to `.env`: `ANTHROPIC_API_KEY=your_key_here`

#### Yelp Fusion API
1. Visit [Yelp for Developers](https://www.yelp.com/developers)
2. Create an app and get your API key
3. Add to `.env`: `YELP_API_KEY=your_key_here`

#### Google Maps API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API and get your API key
3. Add to `.env`: `GOOGLE_MAPS_API_KEY=your_key_here`

## Quick Start

### Option 1: Using the Start Script

```bash
# Make the script executable
chmod +x start-dev.sh

# Start both backend and frontend
./start-dev.sh
```

### Option 2: Manual Start

#### Start Backend
```bash
cd backend
npm start
```

#### Start Frontend (in a new terminal)
```bash
cd frontend
npm start
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend Health Check**: http://localhost:3001/health
- **Backend API**: http://localhost:3001/api

## Troubleshooting

### Port Conflicts

If you get "Something is already running on port 3000":

```bash
# Find processes using port 3000
lsof -i :3000

# Kill the processes
lsof -ti:3000 | xargs kill -9
```

### Module Resolution Errors

If you get "Module not found" errors:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

If you get TypeScript compilation errors:

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix import issues
# Make sure all imports are correct
```

## Development Commands

```bash
# Backend development
cd backend
npm run dev          # Start with nodemon
npm test            # Run tests
npm run lint        # Run ESLint

# Frontend development
cd frontend
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run lint        # Run ESLint

# Full project
npm run dev         # Start both backend and frontend
npm run build       # Build both for production
npm run test        # Run all tests
```

## Project Structure

```
FoodWise/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── agents/          # AI agents
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── package.json
├── docker-compose.yml       # Docker configuration
├── start-dev.sh            # Development startup script
└── README.md
```

## Next Steps

1. **Set up your API keys** in the `.env` file
2. **Start the development servers** using the commands above
3. **Visit http://localhost:3000** to see the frontend
4. **Test the API** at http://localhost:3001/health
5. **Start developing** your features!

## Need Help?

- Check the [README.md](./README.md) for detailed project information
- Review the [API documentation](./docs/api.md) for backend endpoints
- Look at the [component documentation](./docs/components.md) for frontend structure

Happy coding! 🚀